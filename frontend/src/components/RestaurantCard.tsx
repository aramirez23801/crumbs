import { MapPin, ExternalLink, Star } from 'lucide-react'
import type { Restaurant } from '../api/restaurants'
import { priceRangeLabel, starsArray, formatDate } from '../utils/helpers'

interface RestaurantCardProps {
  restaurant: Restaurant
  onClick: () => void
}

export default function RestaurantCard({ restaurant, onClick }: RestaurantCardProps) {
  const { name, city, country, tags, price_range, status, review, google_maps_url, is_favorite } = restaurant

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl border border-[#E8E2DA]/60 shadow-sm flex overflow-hidden cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all"
    >
      <div className="w-24 flex-shrink-0 bg-gradient-to-br from-cream-dark to-terracotta-pale flex items-center justify-center text-3xl">
        🍽️
      </div>
      <div className="flex-1 p-3 flex flex-col gap-1.5 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <h3 className="font-serif font-semibold text-brown-dark text-[15px] leading-tight truncate">
              {name}
            </h3>
            {is_favorite && (
              <Star size={12} className="text-terracotta fill-terracotta flex-shrink-0" />
            )}
          </div>
          <a
            href={google_maps_url ?? undefined}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
            className="text-brown-light hover:text-terracotta transition-colors flex-shrink-0 mt-0.5"
          >
            <ExternalLink size={13} />
          </a>
        </div>
        <div className="flex items-center gap-1 text-xs text-brown-light">
          <MapPin size={11} />
          <span>{city}, {country}</span>
        </div>
        {tags.length > 0 && (
          <div className="flex gap-1.5 flex-wrap">
            {tags.slice(0, 3).map((tag) => (
              <span
                key={tag.id}
                className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                  tag.category === 'mood'
                    ? 'bg-[#EEF2E8] text-olive'
                    : 'bg-terracotta-pale text-terracotta'
                }`}
              >
                {tag.name}
              </span>
            ))}
          </div>
        )}
        <div className="flex items-center justify-between mt-auto pt-0.5">
          {price_range && (
            <span className="text-xs font-semibold text-olive">
              {priceRangeLabel(price_range)}
            </span>
          )}
          <div className="flex items-center gap-2 ml-auto">
            {status === 'tried' && review?.visited_at && (
              <span className="text-xs text-brown-light">
                {formatDate(review.visited_at)}
              </span>
            )}
            {status === 'tried' && review && (
              <span className="text-xs text-terracotta">
                {starsArray(review.rating)}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}