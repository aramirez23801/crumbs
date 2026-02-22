import { useState } from 'react'
import { X, MapPin, ExternalLink, Star, Pencil, Trash2, CheckSquare, Bookmark } from 'lucide-react'
import type { Restaurant } from '../api/restaurants'
import { restaurantsApi } from '../api/restaurants'
import { priceRangeLabel, starsArray, formatDate } from '../utils/helpers'

interface RestaurantModalProps {
  restaurant: Restaurant
  onClose: () => void
  onUpdate: (updated: Restaurant) => void
  onDelete: (id: string) => void
}

export default function RestaurantModal({ restaurant, onClose, onUpdate, onDelete }: RestaurantModalProps) {
  const [loading, setLoading] = useState(false)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [rating, setRating] = useState(restaurant.review?.rating ?? 5)
  const [reviewText, setReviewText] = useState(restaurant.review?.review_text ?? '')
  const [confirmDelete, setConfirmDelete] = useState(false)

  const handleMarkTried = async () => {
    setLoading(true)
    try {
      const updated = await restaurantsApi.markTried(restaurant.id, { rating, review_text: reviewText })
      onUpdate(updated)
      setShowReviewForm(false)
    } finally {
      setLoading(false)
    }
  }

  const handleMarkSaved = async () => {
    setLoading(true)
    try {
      const updated = await restaurantsApi.markSaved(restaurant.id)
      onUpdate(updated)
    } finally {
      setLoading(false)
    }
  }

  const handleToggleFavorite = async () => {
    setLoading(true)
    try {
      const updated = await restaurantsApi.toggleFavorite(restaurant.id)
      onUpdate(updated)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    setLoading(true)
    try {
      await restaurantsApi.delete(restaurant.id)
      onDelete(restaurant.id)
      onClose()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 bg-brown-dark/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={onClose}
    >
      <div
        className="bg-cream w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-9 h-1 bg-[#E8E2DA] rounded-full" />
        </div>

        <div className="mx-4 mt-2 h-44 rounded-2xl bg-gradient-to-br from-cream-dark to-terracotta-pale flex items-center justify-center text-5xl relative">
          🍽️
          {restaurant.status === 'tried' && (
            <span className="absolute top-3 right-3 bg-olive text-white text-xs font-semibold px-3 py-1 rounded-full">
              ✓ Tried
            </span>
          )}
          <button
            onClick={onClose}
            className="absolute top-3 left-3 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center text-brown-mid hover:bg-white transition-colors"
          >
            <X size={15} />
          </button>
        </div>

        <div className="p-5">
          <div className="flex items-start justify-between mb-1">
            <h2 className="font-serif text-2xl font-bold text-brown-dark">{restaurant.name}</h2>
            {restaurant.status === 'tried' && (
              <button
                onClick={handleToggleFavorite}
                disabled={loading}
                className="flex-shrink-0 ml-2 mt-1"
              >
                <Star
                  size={22}
                  className={restaurant.is_favorite
                    ? 'text-terracotta fill-terracotta'
                    : 'text-[#E8E2DA] hover:text-terracotta transition-colors'
                  }
                />
              </button>
            )}
          </div>

          <div className="flex items-center gap-3 text-sm text-brown-light mb-3">
            <span className="flex items-center gap-1">
              <MapPin size={13} />
              {restaurant.area ? `${restaurant.area}, ` : ''}{restaurant.city}, {restaurant.country}
            </span>
            {restaurant.price_range && (
              <span className="text-olive font-semibold">{priceRangeLabel(restaurant.price_range)}</span>
            )}
          </div>

          {restaurant.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {restaurant.tags.map((tag) => (
                <span
                  key={tag.id}
                  className={`text-xs font-medium px-3 py-1 rounded-full ${
                    tag.category === 'mood' ? 'bg-[#EEF2E8] text-olive' : 'bg-terracotta-pale text-terracotta'
                  }`}
                >
                  {tag.name}
                </span>
              ))}
            </div>
          )}

          <div className="h-px bg-[#E8E2DA] mb-4" />

          <div className="flex flex-col gap-3 mb-4">
            <a
              href={restaurant.place_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-sm text-terracotta hover:underline"
            >
              <div className="w-8 h-8 rounded-lg bg-terracotta-pale flex items-center justify-center flex-shrink-0">
                <ExternalLink size={14} className="text-terracotta" />
              </div>
              Open link
            </a>
            {restaurant.notes && (
              <div className="flex items-start gap-3 text-sm">
                <div className="w-8 h-8 rounded-lg bg-terracotta-pale flex items-center justify-center flex-shrink-0">
                  <Pencil size={14} className="text-terracotta" />
                </div>
                <span className="text-brown-mid pt-1">{restaurant.notes}</span>
              </div>
            )}
          </div>

          {restaurant.status === 'tried' && restaurant.review && !showReviewForm && (
            <>
              <div className="h-px bg-[#E8E2DA] mb-4" />
              <div className="bg-white rounded-2xl p-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-terracotta text-lg">{starsArray(restaurant.review.rating)}</span>
                  <button
                    onClick={() => setShowReviewForm(true)}
                    className="text-xs text-brown-light hover:text-terracotta"
                  >
                    Edit review
                  </button>
                </div>
                {restaurant.review.review_text && (
                  <p className="text-sm text-brown-mid italic leading-relaxed">
                    "{restaurant.review.review_text}"
                  </p>
                )}
                {restaurant.review.visited_at && (
                  <p className="text-xs text-brown-light mt-2">
                    Visited {formatDate(restaurant.review.visited_at)}
                  </p>
                )}
              </div>
            </>
          )}

          {showReviewForm && (
            <div className="bg-white rounded-2xl p-4 mb-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-brown-light mb-3">Your Review</p>
              <div className="flex gap-1 mb-3">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button key={s} onClick={() => setRating(s)}>
                    <Star
                      size={24}
                      className={s <= rating ? 'text-terracotta fill-terracotta' : 'text-[#E8E2DA]'}
                    />
                  </button>
                ))}
              </div>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="How was it? (optional)"
                rows={3}
                className="w-full px-3 py-2 rounded-xl border border-[#E8E2DA] bg-cream text-sm text-brown-dark placeholder-brown-light/60 outline-none focus:border-terracotta resize-none"
              />
              <div className="flex gap-2 mt-3">
                <button
                  onClick={handleMarkTried}
                  disabled={loading}
                  className="flex-1 py-2.5 bg-terracotta text-white rounded-full text-sm font-semibold disabled:opacity-60"
                >
                  {loading ? 'Saving...' : 'Save Review'}
                </button>
                <button
                  onClick={() => setShowReviewForm(false)}
                  className="px-4 py-2.5 bg-white border border-[#E8E2DA] text-brown-mid rounded-full text-sm font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          <div className="flex gap-2">
            {restaurant.status === 'saved' && !showReviewForm && (
              <button
                onClick={() => setShowReviewForm(true)}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-terracotta text-white rounded-full text-sm font-semibold"
              >
                <CheckSquare size={16} />
                Mark as Tried
              </button>
            )}
            {restaurant.status === 'tried' && (
              <button
                onClick={handleMarkSaved}
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-white border border-[#E8E2DA] text-brown-mid rounded-full text-sm font-semibold"
              >
                <Bookmark size={16} />
                Move to Saved
              </button>
            )}
            {!confirmDelete ? (
              <button
                onClick={() => setConfirmDelete(true)}
                className="w-11 h-11 flex items-center justify-center bg-white border border-[#E8E2DA] rounded-full text-brown-light hover:text-red-400 transition-colors"
              >
                <Trash2 size={16} />
              </button>
            ) : (
              <button
                onClick={handleDelete}
                disabled={loading}
                className="px-4 py-3 bg-red-50 border border-red-200 text-red-500 rounded-full text-sm font-semibold"
              >
                Confirm delete
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}