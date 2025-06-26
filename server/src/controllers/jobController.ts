import { Request, Response } from 'express';
import { JobService } from '../services/jobService';
import { JobStage } from '../generated/prisma';

export class JobController {
  private jobService: JobService;

  constructor() {
    this.jobService = new JobService();
  }

  // GET /api/jobs
  getAllJobs = async (_req: Request, res: Response): Promise<void> => {
    try {
      const jobs = await this.jobService.getAllJobs();
      res.json(jobs);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch jobs' });
    }
  };

  // GET /api/jobs/:id
  getJobById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const job = await this.jobService.getJobById(id);
      res.json(job);
    } catch (error) {
      if (error instanceof Error && error.message === 'Job not found') {
        res.status(404).json({ error: 'Job not found' });
      } else {
        res.status(500).json({ error: 'Failed to fetch job' });
      }
    }
  };

  // POST /api/jobs
  createJob = async (req: Request, res: Response): Promise<void> => {
    try {
      const jobData = req.body;
      const job = await this.jobService.createJob(jobData);
      res.status(201).json(job);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Failed to create job' });
      }
    }
  };

  // PUT /api/jobs/:id
  updateJob = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const job = await this.jobService.updateJob(id, updateData);
      res.json(job);
    } catch (error) {
      if (error instanceof Error && error.message === 'Job not found') {
        res.status(404).json({ error: 'Job not found' });
      } else if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Failed to update job' });
      }
    }
  };

  // DELETE /api/jobs/:id
  deleteJob = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      await this.jobService.deleteJob(id);
      res.status(204).send();
    } catch (error) {
      if (error instanceof Error && error.message === 'Job not found') {
        res.status(404).json({ error: 'Job not found' });
      } else {
        res.status(500).json({ error: 'Failed to delete job' });
      }
    }
  };

  // GET /api/jobs/stage/:stage
  getJobsByStage = async (req: Request, res: Response): Promise<void> => {
    try {
      const { stage } = req.params;
      
      // Validate stage
      if (!Object.values(JobStage).includes(stage as JobStage)) {
        res.status(400).json({ error: 'Invalid job stage' });
        return;
      }

      const jobs = await this.jobService.getJobsByStage(stage as JobStage);
      res.json(jobs);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch jobs by stage' });
    }
  };

  // PATCH /api/jobs/:id/stage
  updateJobStage = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { stage } = req.body;

      // Validate stage
      if (!Object.values(JobStage).includes(stage)) {
        res.status(400).json({ error: 'Invalid job stage' });
        return;
      }

      const job = await this.jobService.updateJobStage(id, stage);
      res.json(job);
    } catch (error) {
      if (error instanceof Error && error.message === 'Job not found') {
        res.status(404).json({ error: 'Job not found' });
      } else {
        res.status(500).json({ error: 'Failed to update job stage' });
      }
    }
  };

  // GET /api/jobs/stats
  getJobStats = async (_req: Request, res: Response): Promise<void> => {
    try {
      const stats = await this.jobService.getJobStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch job statistics' });
    }
  };
} 