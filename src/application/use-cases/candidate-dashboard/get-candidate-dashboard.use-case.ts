import type { ICandidateProfileRepository } from "../../interfaces/repositories/candidate-profile.repository.js";
import type { IJobApplicationRepository } from "../../interfaces/repositories/job-application.repository.js";
import type { IJobRepository } from "../../interfaces/repositories/job.repository.js";

const hasValue = (value: unknown): boolean => Array.isArray(value)
  ? value.length > 0
  : typeof value === "string" ? value.trim().length > 0
    : typeof value === "object" && value !== null ? Object.values(value).some(hasValue)
      : Boolean(value);

const completionFor = (profile: Awaited<ReturnType<ICandidateProfileRepository["findByUserId"]>>) => {
  if (!profile) return { percentage: 0, completedSections: 0, totalSections: 10 };
  const sections = [
    hasValue(profile.fullName), hasValue(profile.profilePhoto), hasValue(profile.headline), hasValue(profile.bio),
    hasValue(profile.location), hasValue(profile.personalInfo), hasValue(profile.contactLinks), hasValue(profile.skills),
    hasValue(profile.education) || hasValue(profile.experience), hasValue(profile.resume),
  ];
  const completedSections = sections.filter(Boolean).length;
  return { percentage: Math.round(completedSections / sections.length * 100), completedSections, totalSections: sections.length };
};

export class GetCandidateDashboardUseCase {
  constructor(
    private readonly profiles: ICandidateProfileRepository,
    private readonly applications: IJobApplicationRepository,
    private readonly jobs: IJobRepository,
  ) {}

  async execute(candidateId: string) {
    const [profile, applicationData, publishedJobs] = await Promise.all([
      this.profiles.findByUserId(candidateId),
      this.applications.getCandidateDashboardData(candidateId, 5),
      this.jobs.findPublished({ page: 1, limit: 100, sortBy: "latest" }),
    ]);
    const appliedJobIds = new Set(applicationData.appliedJobIds);
    const preferences = profile?.jobPreferences;
    const preferredRoles = (preferences?.preferredRoles ?? []).map((value) => value.toLowerCase());
    const preferredLocations = (preferences?.preferredLocations ?? []).map((value) => value.toLowerCase());
    const preferredSkills = (profile?.skills ?? []).map((value) => typeof value === "string" ? value : String(value.name ?? "")).filter(Boolean).map((value) => value.toLowerCase());

    const recommendedJobs = publishedJobs.jobs
      .filter((job) => !appliedJobIds.has(job.id ?? ""))
      .map((job) => ({ job, score: (preferredRoles.some((role) => job.title.toLowerCase().includes(role)) ? 3 : 0)
        + (preferredLocations.some((location) => job.location.toLowerCase().includes(location)) ? 2 : 0)
        + (preferredSkills.some((skill) => job.skills.some((jobSkill) => jobSkill.toLowerCase() === skill)) ? 2 : 0)
        + (preferences?.employmentTypes.includes(job.employmentType) ? 1 : 0)
        + (preferences?.workModes.includes(job.workMode) ? 1 : 0)
        + (preferences?.experienceLevel === job.experienceLevel ? 1 : 0) }))
      .sort((left, right) => right.score - left.score || right.job.createdAt.getTime() - left.job.createdAt.getTime())
      .slice(0, 5).map(({ job }) => job);
      
    const recentJobIds = [...new Set(applicationData.recent.map((application) => application.jobId))];
    const recentJobs = await this.jobs.findByIds(recentJobIds);
    const jobsById = new Map(recentJobs.map((job) => [job.id, job]));

    return {
      profileCompletion: completionFor(profile),
      applications: { total: applicationData.total, statusCounts: applicationData.statusCounts,
        recent: applicationData.recent.map((application) => ({
          id: application.id, jobId: application.jobId, jobTitle: jobsById.get(application.jobId)?.title ?? null,
          companyName: jobsById.get(application.jobId)?.companyName ?? null, status: application.status,
          submittedAt: application.submittedAt.toISOString(),
        })) },
      recommendedJobs,
      upcomingInterviews: [] as Array<never>,
    };
  }
}
