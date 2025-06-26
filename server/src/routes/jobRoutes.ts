import { Router } from 'express';
import { JobController } from '../controllers/jobController';

const router = Router();
const jobController = new JobController();

// Job CRUD routes
router.get('/', jobController.getAllJobs);
router.get('/stats', jobController.getJobStats);
router.get('/stage/:stage', jobController.getJobsByStage);
router.get('/:id', jobController.getJobById);
router.post('/', jobController.createJob);
router.put('/:id', jobController.updateJob);
router.patch('/:id/stage', jobController.updateJobStage);
router.delete('/:id', jobController.deleteJob);

export default router; 