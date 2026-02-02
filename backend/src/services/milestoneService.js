// In-memory storage (in a real app, this would be a database)
let milestones = [];

class MilestoneService {
  // Get all milestones
  getAllMilestones() {
    return milestones;
  }

  // Get milestone by ID
  getMilestoneById(id) {
    const milestone = milestones.find(m => Number(m.id) === Number(id));
    return milestone || null;
  }

  // Create a new milestone
  createMilestone(title, category) {
    // Generate new ID
    const maxId = milestones.length > 0 
      ? Math.max(...milestones.map(m => Number(m.id) || 0))
      : 0;
    
    const newMilestone = {
      id: maxId + 1,
      title: title.trim(),
      category,
      createdAt: new Date().toISOString()
    };

    milestones.push(newMilestone);
    return newMilestone;
  }

  // Delete a milestone by ID
  deleteMilestone(id) {
    const index = milestones.findIndex(m => Number(m.id) === Number(id));
    
    if (index === -1) {
      return null;
    }
    
    const deletedMilestone = milestones[index];
    milestones.splice(index, 1);
    return deletedMilestone;
  }

  // Validate milestone data
  validateMilestoneData(title, category) {
    const errors = [];

    // Validate title
    if (!title || typeof title !== 'string' || title.trim().length < 3) {
      errors.push('Title is required and must be at least 3 characters long');
    }

    // Validate category
    const allowedCategories = ['Work', 'Personal', 'Health'];
    if (!category || !allowedCategories.includes(category)) {
      errors.push('Category is required and must be one of: Work, Personal, Health');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

module.exports = new MilestoneService();
