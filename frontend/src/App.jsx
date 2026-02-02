import { useState, useEffect } from 'react'
import MilestoneForm from './components/MilestoneForm'
import MilestoneDashboard from './components/MilestoneDashboard'
import Toast from './components/Toast'
import { fetchMilestones, createMilestone, deleteMilestone } from './services/api'

function App() {
  const [milestones, setMilestones] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [toast, setToast] = useState(null)

  // Fetch milestones on component mount
  useEffect(() => {
    loadMilestones()
  }, [])

  const loadMilestones = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await fetchMilestones()
      setMilestones(data)
    } catch (err) {
      setError('Failed to load milestones. Please try again later.')
      console.error('Error loading milestones:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleAddMilestone = async (milestoneData) => {
    try {
      setError(null)
      const newMilestone = await createMilestone(milestoneData)
      setMilestones(prev => [newMilestone, ...prev])
      setToast({ message: 'Milestone added successfully!', type: 'success' })
      return { success: true }
    } catch (err) {
      const errorMessage = err.message || 'Failed to create milestone. Please try again.'
      setError(errorMessage)
      setToast({ message: errorMessage, type: 'error' })
      return { success: false, error: errorMessage }
    }
  }

  const handleDeleteMilestone = async (id) => {
    try {
      await deleteMilestone(id)
      setMilestones(prev => prev.filter(m => m.id !== id))
      setToast({ message: 'Milestone deleted successfully!', type: 'success' })
    } catch (err) {
      setToast({ message: err.message || 'Failed to delete milestone', type: 'error' })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <header className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Personal Milestone Tracker
          </h1>
          <p className="text-gray-600">
            Record and celebrate your achievements
          </p>
        </header>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg animate-fade-in">
            {error}
          </div>
        )}

        <MilestoneForm onSubmit={handleAddMilestone} />

        <MilestoneDashboard 
          milestones={milestones} 
          loading={loading}
          onRefresh={loadMilestones}
          onDelete={handleDeleteMilestone}
        />

        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </div>
    </div>
  )
}

export default App
