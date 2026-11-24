import type { QueryFilter, SortOrder } from "mongoose";
import type { IJobRepository, JobPage } from "../../application/interfaces/repositories/job.repository.js";
import type { Job } from "../../domain/entities/job.entity.js";
import type { JobQueryOptions } from "../../application/dto/jobs/job.dto.js";
import { JobModel, type JobDocument } from "../database/models/job.model.js";
import { JobMapper } from "../mappers/job.mapper.js";
import { MongoBaseRepository } from "./mongo-base.repository.js";

const escapeRegex = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export class MongoJobRepository extends MongoBaseRepository<Job, JobDocument, ReturnType<typeof JobMapper.toPersistence>> implements IJobRepository {
  constructor() {
    super(JobModel, JobMapper.toDomain, JobMapper.toPersistence, (job) => ({ $set: JobMapper.toPersistence(job) }), "Job not found");
  }

  async findById(id: string): Promise<Job | null> {
    const document = await JobModel.findById(id).exec();
    return document ? JobMapper.toDomain(document) : null;
  }

  async findByIds(ids: string[]): Promise<Job[]> {
    if (!ids.length) return [];
    const documents = await JobModel.find({
      _id: { $in: ids },
      status: "published",
      $or: [{ applicationDeadline: null }, { applicationDeadline: { $gte: new Date() } }],
    }).exec();
    return documents.map(JobMapper.toDomain);
  }

  async findByIdForRecruiter(id: string, recruiterId: string): Promise<Job | null> {
    const document = await JobModel.findOne({ _id: id, recruiterId }).exec();
    return document ? JobMapper.toDomain(document) : null;
  }

  async findForRecruiter(recruiterId: string, options: JobQueryOptions): Promise<JobPage> {
    const query = this.buildQuery(options);
    query.recruiterId = recruiterId;
    if (options.status) query.status = options.status;
    return this.findPage(query, options);
  }

  async findPublished(options: JobQueryOptions): Promise<JobPage> {
    const query = this.buildQuery(options);
    query.status = "published";
    query.$and = [
      ...(query.$and ?? []),
      { $or: [{ applicationDeadline: null }, { applicationDeadline: { $gte: new Date() } }] },
    ];
    return this.findPage(query, options);
  }

  async findRelated(jobId: string, limit: number): Promise<Job[]> {
    const baseJob = await JobModel.findOne({ _id: jobId, status: "published" }).lean().exec();
    if (!baseJob) return [];

    const relatedConditions: QueryFilter<JobDocument>[] = [
      { employmentType: baseJob.employmentType },
      { experienceLevel: baseJob.experienceLevel },
    ];
    if (baseJob.skills.length) relatedConditions.push({ skills: { $in: baseJob.skills } });

    const documents = await JobModel.find({
      _id: { $ne: jobId },
      status: "published",
      $and: [
        { $or: [{ applicationDeadline: null }, { applicationDeadline: { $gte: new Date() } }] },
        { $or: relatedConditions },
      ],
    }).sort({ createdAt: -1 }).limit(limit).exec();
    return documents.map(JobMapper.toDomain);
  }

  async deleteByIdForRecruiter(id: string, recruiterId: string): Promise<boolean> {
    const result = await JobModel.deleteOne({ _id: id, recruiterId }).exec();
    return result.deletedCount > 0;
  }

  private buildQuery(options: JobQueryOptions): QueryFilter<JobDocument> {
    const query: QueryFilter<JobDocument> = {};
    if (options.location) query.location = { $regex: escapeRegex(options.location), $options: "i" };
    if (options.employmentType) query.employmentType = options.employmentType;
    if (options.workMode) query.workMode = options.workMode;
    if (options.experienceLevel) query.experienceLevel = options.experienceLevel;
    if (options.skill) query.skills = { $regex: escapeRegex(options.skill), $options: "i" } as never;
    if (options.q) {
      const searchPattern = { $regex: escapeRegex(options.q), $options: "i" };
      query.$or = [
        { title: searchPattern },
        { description: searchPattern },
        { companyName: searchPattern },
        { skills: searchPattern },
      ];
    }
    return query;
  }

  private async findPage(query: QueryFilter<JobDocument>, options: JobQueryOptions): Promise<JobPage> {
    const skip = (options.page - 1) * options.limit;
    const sort: Record<string, SortOrder> = options.sortBy === "deadline"
      ? { applicationDeadline: 1, createdAt: -1 }
      : options.sortBy === "salary_low_to_high"
        ? { "salaryRange.minimum": 1, createdAt: -1 }
        : options.sortBy === "salary_high_to_low"
          ? { "salaryRange.maximum": -1, createdAt: -1 }
          : { createdAt: -1 };
    const [documents, total] = await Promise.all([
      JobModel.find(query).sort(sort).skip(skip).limit(options.limit).exec(),
      JobModel.countDocuments(query).exec(),
    ]);
    return {
      jobs: documents.map(JobMapper.toDomain),
      total,
      page: options.page,
      limit: options.limit,
      pages: Math.ceil(total / options.limit),
    };
  }
}
