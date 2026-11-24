import type { JobApplicationQueryDto } from "../../application/dto/applications/job-application.dto.js";
import { Types } from "mongoose";
import type { IJobApplicationRepository } from "../../application/interfaces/repositories/job-application.repository.js";
import type { JobApplication, JobApplicationStatus } from "../../domain/entities/job-application.entity.js";
import { AppError } from "../../application/errors/app-error.js";
import { HttpStatus } from "../../shared/constants/http-status.js";
import { JobApplicationModel, type JobApplicationDocument } from "../database/models/job-application.model.js";
import { JobApplicationMapper } from "../mappers/job-application.mapper.js";

export class MongoJobApplicationRepository implements IJobApplicationRepository {
  
  async getCandidateDashboardData(candidateId: string, recentLimit: number) {
    const [total, grouped, documents, jobIds] = await Promise.all([
      JobApplicationModel.countDocuments({ candidateId }).exec(),
      JobApplicationModel.aggregate<{ _id: JobApplicationStatus; count: number }>([
        { $match: { candidateId: new Types.ObjectId(candidateId) } },
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]).exec(),
      JobApplicationModel.find({ candidateId }).sort({ submittedAt: -1 }).limit(recentLimit).exec(),
      JobApplicationModel.distinct("jobId", { candidateId }).exec(),
    ]);
    const statusCounts: Record<JobApplicationStatus, number> = {
      submitted: 0, under_review: 0, shortlisted: 0, rejected: 0, withdrawn: 0,
    };
    for (const row of grouped) statusCounts[row._id] = row.count;
    return { total, statusCounts, recent: documents.map(JobApplicationMapper.toDomain), appliedJobIds: jobIds.map((id) => id.toString()) };
  }

  async create(application: JobApplication): Promise<JobApplication> {
    try {
      const document = await JobApplicationModel.create(JobApplicationMapper.toPersistence(application));
      return JobApplicationMapper.toDomain(document);
    } catch (error) {
      if (typeof error === "object" && error !== null && "code" in error && error.code === 11000) {
        throw new AppError(HttpStatus.CONFLICT, "You have already applied for this job", "APPLICATION_ALREADY_EXISTS");
      }
      throw error;
    }
  }

  async findById(id: string): Promise<JobApplication | null> {
    const document = await JobApplicationModel.findById(id).exec();
    return document ? JobApplicationMapper.toDomain(document) : null;
  }

  async findByCandidateAndJob(candidateId: string, jobId: string): Promise<JobApplication | null> {
    const document = await JobApplicationModel.findOne({ candidateId, jobId }).exec();
    return document ? JobApplicationMapper.toDomain(document) : null;
  }

  async findForCandidate(candidateId: string, options: JobApplicationQueryDto) {
    return this.findPage({ candidateId, ...(options.status ? { status: options.status } : {}) }, options);
  }

  async findForRecruiter(recruiterId: string, options: JobApplicationQueryDto) {
    return this.findPage({ recruiterId, ...(options.status ? { status: options.status } : {}), ...(options.jobId ? { jobId: options.jobId } : {}) }, options);
  }

  async updateStatus(id: string, status: JobApplicationStatus): Promise<JobApplication | null> {
    const document = await JobApplicationModel.findByIdAndUpdate(id, { $set: { status } }, { new: true, runValidators: true }).exec();
    return document ? JobApplicationMapper.toDomain(document) : null;
  }

  private async findPage(filter: Record<string, unknown>, options: JobApplicationQueryDto) {
    const [documents, total] = await Promise.all([
      JobApplicationModel.find(filter).sort({ submittedAt: -1 }).skip((options.page - 1) * options.limit).limit(options.limit).exec(),
      JobApplicationModel.countDocuments(filter).exec(),
    ]);
    return { applications: documents.map((document: JobApplicationDocument) => JobApplicationMapper.toDomain(document)), total, page: options.page, limit: options.limit, pages: Math.ceil(total / options.limit) };
  }
}
