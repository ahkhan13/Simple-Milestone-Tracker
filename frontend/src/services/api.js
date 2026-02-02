const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

export const fetchMilestones = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/milestones`)
    
    if (!response.ok) {
      if (response.status === 500) {
        throw new Error('Server error. Please try again later.')
      }
      throw new Error('Failed to fetch milestones')
    }
    
    return await response.json()
  } catch (error) {
    if (error.message) {
      throw error
    }
    throw new Error('Network error. Please check if the server is running.')
  }
}

export const createMilestone = async (milestoneData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/milestones`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(milestoneData),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      
      if (response.status === 400) {
        throw new Error(errorData.error || 'Validation error. Please check your input.')
      }
      
      if (response.status === 500) {
        throw new Error('Server error. Please try again later.')
      }
      
      throw new Error(errorData.error || 'Failed to create milestone')
    }

    return await response.json()
  } catch (error) {
    if (error.message) {
      throw error
    }
    throw new Error('Network error. Please check if the server is running.')
  }
}

export const deleteMilestone = async (id) => {
  try {
    const milestoneId = typeof id === 'string' ? parseInt(id, 10) : id
    
    if (isNaN(milestoneId)) {
      throw new Error('Invalid milestone ID')
    }

    const response = await fetch(`${API_BASE_URL}/milestones/${milestoneId}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      
      if (response.status === 404) {
        throw new Error(errorData.error || 'Milestone not found')
      }
      
      if (response.status === 500) {
        throw new Error('Server error. Please try again later.')
      }
      
      throw new Error(errorData.error || 'Failed to delete milestone')
    }

    return await response.json()
  } catch (error) {
    if (error.message) {
      throw error
    }
    throw new Error('Network error. Please check if the server is running.')
  }
}
