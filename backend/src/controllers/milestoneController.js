const milestoneService = require('../services/milestoneService');

class MilestoneController {
  // Get all milestones
  getAllMilestones(req, res) {
    try {
      const milestones = milestoneService.getAllMilestones();
      res.status(200).json(milestones);
    } catch (error) {
      console.error('Error fetching milestones:', error);
      res.status(500).json({ error: 'Failed to fetch milestones' });
    }
  }

  // Get milestone by ID
  getMilestoneById(req, res) {
    try {
      const { id } = req.params;
      const parsedId = parseInt(id, 10);

      if (isNaN(parsedId)) {
        return res.status(400).json({ error: 'Invalid milestone ID' });
      }

      const milestone = milestoneService.getMilestoneById(parsedId);

      if (!milestone) {
        return res.status(404).json({ error: 'Milestone not found' });
      }

      res.status(200).json(milestone);
    } catch (error) {
      console.error('Error fetching milestone:', error);
      res.status(500).json({ error: 'Failed to fetch milestone' });
    }
  }

  // Create a new milestone
  createMilestone(req, res) {
    try {
      const { title, category } = req.body;

      // Validate input
      const validation = milestoneService.validateMilestoneData(title, category);
      
      if (!validation.isValid) {
        return res.status(400).json({ 
          error: validation.errors.join(', ') 
        });
      }

      // Create milestone
      const newMilestone = milestoneService.createMilestone(title, category);
      res.status(201).json(newMilestone);
    } catch (error) {
      console.error('Error creating milestone:', error);
      res.status(500).json({ error: 'Failed to create milestone' });
    }
  }

  // Delete a milestone
  deleteMilestone(req, res) {
    try {
      const { id } = req.params;
      const parsedId = parseInt(id, 10);

      if (isNaN(parsedId)) {
        return res.status(400).json({ error: 'Invalid milestone ID' });
      }

      const deletedMilestone = milestoneService.deleteMilestone(parsedId);

      if (!deletedMilestone) {
        return res.status(404).json({ error: 'Milestone not found' });
      }

      res.status(200).json({ 
        message: 'Milestone deleted successfully',
        deletedMilestone 
      });
    } catch (error) {
      console.error('Error deleting milestone:', error);
      res.status(500).json({ error: 'Failed to delete milestone' });
    }
  }
}

module.exports = new MilestoneController();
