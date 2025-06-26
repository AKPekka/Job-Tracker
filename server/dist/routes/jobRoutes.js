"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jobController_1 = require("../controllers/jobController");
const router = (0, express_1.Router)();
const jobController = new jobController_1.JobController();
// Job CRUD routes
router.get('/', jobController.getAllJobs);
router.get('/stats', jobController.getJobStats);
router.get('/stage/:stage', jobController.getJobsByStage);
router.get('/:id', jobController.getJobById);
router.post('/', jobController.createJob);
router.put('/:id', jobController.updateJob);
router.patch('/:id/stage', jobController.updateJobStage);
router.delete('/:id', jobController.deleteJob);
exports.default = router;
//# sourceMappingURL=jobRoutes.js.map