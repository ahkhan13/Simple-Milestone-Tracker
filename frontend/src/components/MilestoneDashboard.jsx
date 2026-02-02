import { useState, useMemo } from 'react'
import DeleteConfirmModal from './DeleteConfirmModal'

const MilestoneDashboard = ({ milestones, loading, onRefresh, onDelete }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [sortBy, setSortBy] = useState('newest')
  const [deletingId, setDeletingId] = useState(null)
  const [milestoneToDelete, setMilestoneToDelete] = useState(null)

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Work':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'Personal':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'Health':
        return 'bg-green-100 text-green-800 border-green-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleDeleteClick = (milestone) => {
    setMilestoneToDelete(milestone)
  }

  const handleConfirmDelete = async () => {
    if (milestoneToDelete) {
      setDeletingId(milestoneToDelete.id)
      try {
        await onDelete(milestoneToDelete.id)
        setMilestoneToDelete(null)
      } catch (error) {
        // Error is handled by parent component
      } finally {
        setDeletingId(null)
      }
    }
  }

  const handleCancelDelete = () => {
    setMilestoneToDelete(null)
  }

  const filteredAndSortedMilestones = useMemo(() => {
    let filtered = milestones

    if (searchQuery.trim()) {
      filtered = filtered.filter(m =>
        m.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(m => m.category === selectedCategory)
    }

    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.createdAt) - new Date(a.createdAt)
      } else if (sortBy === 'oldest') {
        return new Date(a.createdAt) - new Date(b.createdAt)
      } else if (sortBy === 'category') {
        return a.category.localeCompare(b.category)
      }
      return 0
    })

    return sorted
  }, [milestones, searchQuery, selectedCategory, sortBy])

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center animate-fade-in">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        <p className="mt-4 text-gray-600">Loading milestones...</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-2xl font-semibold text-gray-800">
          Milestones ({filteredAndSortedMilestones.length})
        </h2>
        <div className="flex gap-2">
          <button
            onClick={onRefresh}
            className="px-4 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-lg transition-all hover:scale-105 active:scale-95"
          >
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </span>
          </button>
        </div>
      </div>

      <div className="mb-6 space-y-4">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search milestones..."
            className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
          />
          <svg
            className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Category:</span>
            <div className="flex gap-2">
              {['All', 'Work', 'Personal', 'Health'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                    selectedCategory === cat
                      ? cat === 'All'
                        ? 'bg-indigo-600 text-white shadow-md'
                        : getCategoryColor(cat) + ' border-2'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <span className="text-sm font-medium text-gray-700">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="category">By Category</option>
            </select>
          </div>
        </div>
      </div>

      {filteredAndSortedMilestones.length === 0 ? (
        <div className="text-center py-12 animate-fade-in">
          <div className="text-gray-400 mb-4">
            <svg
              className="mx-auto h-16 w-16"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
              />
            </svg>
          </div>
          <p className="text-gray-600 text-lg font-medium mb-2">
            {searchQuery || selectedCategory !== 'All'
              ? 'No milestones match your filters'
              : 'No milestones found'}
          </p>
          <p className="text-gray-500">
            {searchQuery || selectedCategory !== 'All'
              ? 'Try adjusting your search or filters'
              : 'Start by adding your first milestone above!'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAndSortedMilestones.map((milestone, index) => (
            <div
              key={milestone.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-all duration-300 animate-slide-up"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2 break-words">
                    {milestone.title}
                  </h3>
                  <p className="text-sm text-gray-500 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {formatDate(milestone.createdAt)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold border ${getCategoryColor(
                      milestone.category
                    )}`}
                  >
                    {milestone.category}
                  </span>
                  <button
                    onClick={() => handleDeleteClick(milestone)}
                    disabled={deletingId === milestone.id}
                    className={`p-2 rounded-lg transition-all hover:scale-110 active:scale-95 ${
                      deletingId === milestone.id
                        ? 'bg-gray-300 cursor-not-allowed'
                        : 'bg-red-50 text-red-600 hover:bg-red-100'
                    }`}
                    title="Delete milestone"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <DeleteConfirmModal
        isOpen={milestoneToDelete !== null}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        milestoneTitle={milestoneToDelete?.title || ''}
        isDeleting={deletingId === milestoneToDelete?.id}
      />
    </div>
  )
}

export default MilestoneDashboard
