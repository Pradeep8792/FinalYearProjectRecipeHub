import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { FiStar, FiMessageSquare, FiTrash2, FiSend, FiEdit2, FiX, FiUser } from 'react-icons/fi';
import { useNavigate, useLocation } from 'react-router-dom';
import { reviewApi } from '../../api/reviewApi.jsx';
import { useAuth } from '../../hooks/useAuth.jsx';
import Button from '../common/Button';

/**
 * StarRating - interactive clickable star rating component.
 * @param {number} rating - current rating value 1-5
 * @param {Function} onChange - callback when user picks a star
 * @param {boolean} readOnly - show stars only, no click
 */
const StarRating = ({ rating, onChange, readOnly = false, size = 20 }) => {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readOnly}
          onClick={() => !readOnly && onChange?.(star)}
          onMouseEnter={() => !readOnly && setHovered(star)}
          onMouseLeave={() => !readOnly && setHovered(0)}
          className={`transition-transform ${readOnly
            ? 'cursor-default'
            : 'cursor-pointer hover:scale-125 focus:outline-none'
          }`}
          aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
        >
          <FiStar
            size={size}
            className={`transition-colors ${
              star <= (hovered || rating)
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-surface-200'
            }`}
          />
        </button>
      ))}
    </div>
  );
};

/**
 * ReviewList - shows reviews for a recipe and a submit-review form.
 * Supports edit/delete for owner and admin.
 */
const ReviewList = ({ recipeId }) => {
  const { user, isAuthenticated } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ rating: 5, comment: '' });
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null); // review being edited
  const [editForm, setEditForm] = useState({ rating: 5, comment: '' });
  const navigate = useNavigate();
  const location = useLocation();

  // Load reviews for this recipe
  const loadReviews = async () => {
    try {
      const data = await reviewApi.getByRecipe(recipeId);
      setReviews(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load reviews', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, [recipeId]);

  // Submit a new review
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Sign in to leave a review');
      navigate('/login', { state: { from: location.pathname } });
      return;
    }
    if (!form.comment.trim()) return toast.error('Please write your thoughts');

    setSubmitting(true);
    try {
      await reviewApi.create({
        userId: user?.userId,
        recipeId: Number(recipeId),
        rating: Number(form.rating),
        comment: form.comment
      });
      toast.success('Review posted!');
      setForm({ rating: 5, comment: '' });
      loadReviews();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not post review');
    } finally {
      setSubmitting(false);
    }
  };

  // Delete a review
  const handleDelete = async (reviewId) => {
    if (!window.confirm('Remove this review?')) return;
    try {
      await reviewApi.remove(reviewId);
      toast.success('Review removed');
      loadReviews();
    } catch {
      toast.error('Could not remove review');
    }
  };

  // Start editing a review
  const startEdit = (review) => {
    setEditingId(review.reviewId);
    setEditForm({ rating: review.rating, comment: review.comment });
  };

  // Save edited review
  const handleEdit = async (reviewId) => {
    try {
      await reviewApi.update(reviewId, {
        rating: Number(editForm.rating),
        comment: editForm.comment
      });
      toast.success('Review updated!');
      setEditingId(null);
      loadReviews();
    } catch {
      toast.error('Could not update review');
    }
  };

  // Compute average rating
  const avgRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header with rating summary */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-primary-50 flex items-center justify-center text-primary-500">
            <FiMessageSquare size={22} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-surface-900">Reviews</h2>
            <p className="text-sm text-surface-400 font-medium mt-0.5">{reviews.length} review{reviews.length !== 1 ? 's' : ''}</p>
          </div>
        </div>

        {/* Average rating display */}
        {reviews.length > 0 && (
          <div className="flex items-center gap-3 bg-surface-50 border border-surface-200 px-5 py-3 rounded-2xl">
            <span className="text-3xl font-bold text-surface-900">{avgRating}</span>
            <div>
              <StarRating rating={Math.round(avgRating)} readOnly size={16} />
              <p className="text-xs text-surface-400 font-medium mt-1">Average rating</p>
            </div>
          </div>
        )}
      </header>

      {/* Write a Review Section */}
      <div className="bg-surface-50 rounded-2xl border border-surface-200 p-6 md:p-8 mb-10">
        <h3 className="text-base font-bold text-surface-900 mb-5">Share Your Experience</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Star picker */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-surface-500 uppercase tracking-wider">Your Rating</label>
            <StarRating
              rating={form.rating}
              onChange={(val) => setForm({ ...form, rating: val })}
              size={28}
            />
          </div>

          {/* Comment textarea */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-surface-500 uppercase tracking-wider">Your Review</label>
            <textarea
              className="w-full min-h-[100px] p-4 rounded-xl bg-white border border-surface-200 text-sm font-medium placeholder:text-surface-300 focus:outline-none focus:ring-4 focus:ring-primary-500/5 focus:border-primary-500 transition-all resize-none"
              placeholder="What did you love about this recipe? Any tips for others?"
              value={form.comment}
              onChange={(e) => setForm({ ...form, comment: e.target.value })}
            />
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              variant="primary"
              isLoading={submitting}
              icon={<FiSend />}
              className="px-8"
            >
              Post Review
            </Button>
          </div>
        </form>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {reviews.map((review, idx) => (
            <motion.div
              key={review.reviewId}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ delay: idx * 0.06 }}
              className="bg-white rounded-2xl border border-surface-100 p-6 hover:border-primary-100 transition-all shadow-sm group"
            >
              {editingId === review.reviewId ? (
                /* ── Edit mode ── */
                <div className="space-y-3">
                  <StarRating
                    rating={editForm.rating}
                    onChange={(val) => setEditForm({ ...editForm, rating: val })}
                    size={22}
                  />
                  <textarea
                    className="w-full min-h-[80px] p-3 rounded-xl bg-surface-50 border border-surface-200 text-sm focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/5 transition-all resize-none"
                    value={editForm.comment}
                    onChange={(e) => setEditForm({ ...editForm, comment: e.target.value })}
                  />
                  <div className="flex gap-2 justify-end">
                    <Button size="sm" variant="ghost" icon={<FiX />} onClick={() => setEditingId(null)}>Cancel</Button>
                    <Button size="sm" variant="primary" onClick={() => handleEdit(review.reviewId)}>Update</Button>
                  </div>
                </div>
              ) : (
                /* ── View mode ── */
                <>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {/* Avatar */}
                      <div className="h-10 w-10 rounded-full bg-primary-50 border border-primary-100 flex items-center justify-center text-primary-600 font-bold">
                        {review.userProfileImageUrl ? (
                          <img
                            src={review.userProfileImageUrl}
                            alt={review.userName}
                            className="h-full w-full rounded-full object-cover"
                            onError={(e) => { e.target.style.display = 'none'; }}
                          />
                        ) : (
                          <FiUser size={18} />
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-surface-900 text-sm">{review.userName || 'Anonymous'}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <StarRating rating={review.rating} readOnly size={12} />
                          {review.updatedAt && review.updatedAt !== review.createdAt && (
                            <span className="text-[10px] text-surface-400 font-medium">(edited)</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Action buttons: visible on hover */}
                    {(user?.userId === review.userId || user?.role === 'Admin') && (
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {user?.userId === review.userId && (
                          <button
                            className="h-8 w-8 flex items-center justify-center rounded-lg text-surface-400 hover:text-primary-500 hover:bg-primary-50 transition-all"
                            onClick={() => startEdit(review)}
                            title="Edit review"
                          >
                            <FiEdit2 size={14} />
                          </button>
                        )}
                        <button
                          className="h-8 w-8 flex items-center justify-center rounded-lg text-surface-400 hover:text-danger hover:bg-danger/5 transition-all"
                          onClick={() => handleDelete(review.reviewId)}
                          title="Delete review"
                        >
                          <FiTrash2 size={14} />
                        </button>
                      </div>
                    )}
                  </div>

                  <p className="text-surface-600 leading-relaxed text-sm">{review.comment}</p>

                  {/* Date */}
                  {review.createdAt && (
                    <p className="text-[11px] text-surface-400 mt-3">
                      {new Date(review.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                    </p>
                  )}
                </>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Empty state */}
        {!loading && reviews.length === 0 && (
          <div className="text-center py-16 rounded-2xl border border-dashed border-surface-200 bg-surface-50">
            <FiMessageSquare className="mx-auto mb-3 text-surface-300" size={36} />
            <p className="text-surface-500 font-medium">No reviews yet. Be the first to share your thoughts!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewList;
