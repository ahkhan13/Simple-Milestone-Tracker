import { useState } from 'react'

const MilestoneForm = ({ onSubmit }) => {
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('Work')
  const [loading, setLoading] = useState(false)
  const [localError, setLocalError] = useState(null)
  const [isExpanded, setIsExpanded] = useState(true)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLocalError(null)

    if (!title.trim()) {
      setLocalError('Title is required')
      return
    }

    if (title.trim().length < 3) {
      setLocalError('Title must be at least 3 characters long')
      return
    }

    setLoading(true)
    const result = await onSubmit({ title: title.trim(), category })
    setLoading(false)

    if (result.success) {
      setTitle('')
      setLocalError(null)
    } else {
      setLocalError(result.error)
    }
  }

  const maxLength = 100
  const remainingChars = maxLength - title.length
  const isNearLimit = remainingChars < 20

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8 animate-fade-in">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-gray-800">
          Add New Milestone
        </h2>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-gray-500 hover:text-gray-700 transition-colors"
          type="button"
        >
          {isExpanded ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          )}
        </button>
      </div>
      
      {localError && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded animate-fade-in">
          {localError}
        </div>
      )}

      {isExpanded && (
        <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in">
          <div>
            <div className="flex justify-between items-center mb-2">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Title *
              </label>
              <span className={`text-xs ${isNearLimit ? 'text-red-500' : 'text-gray-500'}`}>
                {remainingChars} characters remaining
              </span>
            </div>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => {
                if (e.target.value.length <= maxLength) {
                  setTitle(e.target.value)
                }
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              placeholder="Enter milestone title (min. 3 characters)"
              disabled={loading}
              maxLength={maxLength}
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['Work', 'Personal', 'Health'].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  disabled={loading}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    category === cat
                      ? cat === 'Work'
                        ? 'bg-blue-600 text-white shadow-md'
                        : cat === 'Personal'
                        ? 'bg-purple-600 text-white shadow-md'
                        : 'bg-green-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !title.trim() || title.trim().length < 3}
            className={`w-full py-3 px-4 rounded-lg font-semibold transition-all transform ${
              loading || !title.trim() || title.trim().length < 3
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 hover:scale-[1.02] active:scale-[0.98] text-white shadow-md hover:shadow-lg'
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </span>
            ) : (
              'Add Milestone'
            )}
          </button>
        </form>
      )}
    </div>
  )
}

export default MilestoneForm
