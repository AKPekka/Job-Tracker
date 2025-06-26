import { JobRepository } from '../repositories/jobRepository';
import { Job, JobStage, Prisma } from '../generated/prisma';

interface CreateJobData {
  title: string;
  company: string;
  location?: string;
  applicationDate?: Date;
  jobUrl?: string;
  resumeUsed?: string;
  notes?: string;
  currentStage?: JobStage;
}

interface UpdateJobData {
  title?: string;
  company?: string;
  location?: string;
  applicationDate?: Date;
  jobUrl?: string;
  resumeUsed?: string;
  notes?: string;
  currentStage?: JobStage;
}

export class JobService {
  private jobRepository: JobRepository;

  constructor() {
    this.jobRepository = new JobRepository();
  }

  async createJob(data: CreateJobData): Promise<Job> {
    // Validate required fields
    if (!data.title || !data.company) {
      throw new Error('Title and company are required');
    }

    const jobData: Prisma.JobCreateInput = {
      title: data.title,
      company: data.company,
      location: data.location,
      applicationDate: data.applicationDate || new Date(),
      jobUrl: data.jobUrl,
      resumeUsed: data.resumeUsed,
      notes: data.notes,
      currentStage: data.currentStage || JobStage.SAVED,
    };

    return this.jobRepository.create(jobData);
  }

  async getAllJobs(): Promise<Job[]> {
    return this.jobRepository.findAll();
  }

  async getJobById(id: string): Promise<Job> {
    const job = await this.jobRepository.findById(id);
    if (!job) {
      throw new Error('Job not found');
    }
    return job;
  }

  async updateJob(id: string, data: UpdateJobData): Promise<Job> {
    // Check if job exists
    await this.getJobById(id);

    const updateData: Prisma.JobUpdateInput = {
      ...(data.title && { title: data.title }),
      ...(data.company && { company: data.company }),
      ...(data.location !== undefined && { location: data.location }),
      ...(data.applicationDate && { applicationDate: data.applicationDate }),
      ...(data.jobUrl !== undefined && { jobUrl: data.jobUrl }),
      ...(data.resumeUsed !== undefined && { resumeUsed: data.resumeUsed }),
      ...(data.notes !== undefined && { notes: data.notes }),
      ...(data.currentStage && { currentStage: data.currentStage }),
    };

    return this.jobRepository.update(id, updateData);
  }

  async deleteJob(id: string): Promise<Job> {
    // Check if job exists
    await this.getJobById(id);
    return this.jobRepository.delete(id);
  }

  async getJobsByStage(stage: JobStage): Promise<Job[]> {
    return this.jobRepository.findByStage(stage);
  }

  async getJobStats() {
    return this.jobRepository.getStats();
  }

  async updateJobStage(id: string, stage: JobStage): Promise<Job> {
    return this.updateJob(id, { currentStage: stage });
  }
} 