const express = require('express');
const router = express.Router();
const milestoneController = require('../controllers/milestoneController');

// GET /milestones - Get all milestones
router.get('/', milestoneController.getAllMilestones.bind(milestoneController));

// GET /milestones/:id - Get milestone by ID
router.get('/:id', milestoneController.getMilestoneById.bind(milestoneController));

// POST /milestones - Create a new milestone
router.post('/', milestoneController.createMilestone.bind(milestoneController));

// DELETE /milestones/:id - Delete a milestone
router.delete('/:id', milestoneController.deleteMilestone.bind(milestoneController));

module.exports = router;
