import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { reviewApi } from '../../api/reviewApi.jsx'
import { useAuth } from '../../hooks/useAuth.jsx'
import Button from '../common/Button'

function ReviewList({ recipeId }) {
  const { user, isAuthenticated } = useAuth()
  const [reviews, setReviews] = useState([])
  const [form, setForm] = useState({ rating: 5, comment: '' })

  const loadReviews = async () => {
    const data = await reviewApi.getByRecipe(recipeId)
    setReviews(data)
  }

  useEffect(() => {
    loadReviews()
  }, [recipeId])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!isAuthenticated) return toast.error('Please login first')

    try {
      await reviewApi.create({ userId: user?.userId, recipeId: Number(recipeId), rating: Number(form.rating), comment: form.comment })
      toast.success('Review added')
      setForm({ rating: 5, comment: '' })
      loadReviews()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not add review')
    }
  }

  const handleDelete = async (reviewId) => {
    await reviewApi.remove(reviewId)
    toast.success('Review deleted')
    loadReviews()
  }

  return (
    <div className="mt-12">
      <h2 className="text-3xl font-extrabold text-slate-900">Reviews</h2>

      <form onSubmit={handleSubmit} className="card mt-5 space-y-4 p-5">
        <select className="input-base" value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })}>
          <option value="5">5</option>
          <option value="4">4</option>
          <option value="3">3</option>
          <option value="2">2</option>
          <option value="1">1</option>
        </select>
        <textarea className="input-base min-h-[120px]" placeholder="Write your review" value={form.comment} onChange={(e) => setForm({ ...form, comment: e.target.value })} />
        <Button type="submit">Submit Review</Button>
      </form>

      <div className="mt-5 space-y-4">
        {reviews.map((review) => (
          <div key={review.reviewId} className="rounded-2xl border border-orange-100 bg-white p-4 shadow-soft">
            <div className="flex items-center justify-between">
              <p className="font-bold text-slate-900">{review.userName || 'User'}</p>
              <p className="font-bold text-orange-500">⭐ {review.rating}</p>
            </div>
            <p className="mt-2 text-slate-600">{review.comment}</p>
            {(user?.userId === review.userId || user?.role === 'Admin') && (
              <button className="mt-3 text-sm font-bold text-red-500" onClick={() => handleDelete(review.reviewId)}>Delete</button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default ReviewList
