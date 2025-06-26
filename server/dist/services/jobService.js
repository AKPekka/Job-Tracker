"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobService = void 0;
const jobRepository_1 = require("../repositories/jobRepository");
const prisma_1 = require("../generated/prisma");
class JobService {
    constructor() {
        this.jobRepository = new jobRepository_1.JobRepository();
    }
    async createJob(data) {
        // Validate required fields
        if (!data.title || !data.company) {
            throw new Error('Title and company are required');
        }
        const jobData = {
            title: data.title,
            company: data.company,
            location: data.location,
            applicationDate: data.applicationDate || new Date(),
            jobUrl: data.jobUrl,
            resumeUsed: data.resumeUsed,
            notes: data.notes,
            currentStage: data.currentStage || prisma_1.JobStage.SAVED,
        };
        return this.jobRepository.create(jobData);
    }
    async getAllJobs() {
        return this.jobRepository.findAll();
    }
    async getJobById(id) {
        const job = await this.jobRepository.findById(id);
        if (!job) {
            throw new Error('Job not found');
        }
        return job;
    }
    async updateJob(id, data) {
        // Check if job exists
        await this.getJobById(id);
        const updateData = {
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
    async deleteJob(id) {
        // Check if job exists
        await this.getJobById(id);
        return this.jobRepository.delete(id);
    }
    async getJobsByStage(stage) {
        return this.jobRepository.findByStage(stage);
    }
    async getJobStats() {
        return this.jobRepository.getStats();
    }
    async updateJobStage(id, stage) {
        return this.updateJob(id, { currentStage: stage });
    }
}
exports.JobService = JobService;
//# sourceMappingURL=jobService.js.map