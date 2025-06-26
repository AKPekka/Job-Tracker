"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobController = void 0;
const jobService_1 = require("../services/jobService");
const prisma_1 = require("../generated/prisma");
class JobController {
    constructor() {
        // GET /api/jobs
        this.getAllJobs = async (_req, res) => {
            try {
                const jobs = await this.jobService.getAllJobs();
                res.json(jobs);
            }
            catch (error) {
                res.status(500).json({ error: 'Failed to fetch jobs' });
            }
        };
        // GET /api/jobs/:id
        this.getJobById = async (req, res) => {
            try {
                const { id } = req.params;
                const job = await this.jobService.getJobById(id);
                res.json(job);
            }
            catch (error) {
                if (error instanceof Error && error.message === 'Job not found') {
                    res.status(404).json({ error: 'Job not found' });
                }
                else {
                    res.status(500).json({ error: 'Failed to fetch job' });
                }
            }
        };
        // POST /api/jobs
        this.createJob = async (req, res) => {
            try {
                const jobData = req.body;
                const job = await this.jobService.createJob(jobData);
                res.status(201).json(job);
            }
            catch (error) {
                if (error instanceof Error) {
                    res.status(400).json({ error: error.message });
                }
                else {
                    res.status(500).json({ error: 'Failed to create job' });
                }
            }
        };
        // PUT /api/jobs/:id
        this.updateJob = async (req, res) => {
            try {
                const { id } = req.params;
                const updateData = req.body;
                const job = await this.jobService.updateJob(id, updateData);
                res.json(job);
            }
            catch (error) {
                if (error instanceof Error && error.message === 'Job not found') {
                    res.status(404).json({ error: 'Job not found' });
                }
                else if (error instanceof Error) {
                    res.status(400).json({ error: error.message });
                }
                else {
                    res.status(500).json({ error: 'Failed to update job' });
                }
            }
        };
        // DELETE /api/jobs/:id
        this.deleteJob = async (req, res) => {
            try {
                const { id } = req.params;
                await this.jobService.deleteJob(id);
                res.status(204).send();
            }
            catch (error) {
                if (error instanceof Error && error.message === 'Job not found') {
                    res.status(404).json({ error: 'Job not found' });
                }
                else {
                    res.status(500).json({ error: 'Failed to delete job' });
                }
            }
        };
        // GET /api/jobs/stage/:stage
        this.getJobsByStage = async (req, res) => {
            try {
                const { stage } = req.params;
                // Validate stage
                if (!Object.values(prisma_1.JobStage).includes(stage)) {
                    res.status(400).json({ error: 'Invalid job stage' });
                    return;
                }
                const jobs = await this.jobService.getJobsByStage(stage);
                res.json(jobs);
            }
            catch (error) {
                res.status(500).json({ error: 'Failed to fetch jobs by stage' });
            }
        };
        // PATCH /api/jobs/:id/stage
        this.updateJobStage = async (req, res) => {
            try {
                const { id } = req.params;
                const { stage } = req.body;
                // Validate stage
                if (!Object.values(prisma_1.JobStage).includes(stage)) {
                    res.status(400).json({ error: 'Invalid job stage' });
                    return;
                }
                const job = await this.jobService.updateJobStage(id, stage);
                res.json(job);
            }
            catch (error) {
                if (error instanceof Error && error.message === 'Job not found') {
                    res.status(404).json({ error: 'Job not found' });
                }
                else {
                    res.status(500).json({ error: 'Failed to update job stage' });
                }
            }
        };
        // GET /api/jobs/stats
        this.getJobStats = async (_req, res) => {
            try {
                const stats = await this.jobService.getJobStats();
                res.json(stats);
            }
            catch (error) {
                res.status(500).json({ error: 'Failed to fetch job statistics' });
            }
        };
        this.jobService = new jobService_1.JobService();
    }
}
exports.JobController = JobController;
//# sourceMappingURL=jobController.js.map