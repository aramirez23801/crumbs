import { useState, useEffect } from 'react'
import { UtensilsCrossed } from 'lucide-react'
import Layout from '../components/Layout'
import RestaurantCard from '../components/RestaurantCard'
import FilterBar from '../components/FilterBar'
import RestaurantModal from '../components/RestaurantModal'
import { restaurantsApi } from '../api/restaurants'
import { tagsApi } from '../api/tags'
import type { Restaurant, RestaurantFilters } from '../api/restaurants'
import type { Tag } from '../api/restaurants'

export default function TriedPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Restaurant | null>(null)

  const fetchRestaurants = async (filters: RestaurantFilters = {}) => {
    try {
      const data = await restaurantsApi.list({ ...filters, status: 'tried' })
      setRestaurants(data)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    const init = async () => {
      setLoading(true)
      await Promise.all([fetchRestaurants(), tagsApi.list().then(setTags)])
      setLoading(false)
    }
    init()
  }, [])

  const handleFiltersChange = (filters: {
    q: string
    tag_ids: string[]
    price_range?: number
  }) => {
    fetchRestaurants(filters)
  }

  const handleUpdate = (updated: Restaurant) => {
    if (updated.status === 'saved') {
      setRestaurants((prev) => prev.filter((r) => r.id !== updated.id))
    } else {
      setRestaurants((prev) =>
        prev.map((r) => (r.id === updated.id ? updated : r))
      )
    }
    setSelected(null)
  }

  const handleToggleFavorite = async (id: string) => {
    try {
      const updated = await restaurantsApi.toggleFavorite(id)
      setRestaurants((prev) => prev.map((r) => (r.id === updated.id ? updated : r)))
    } catch (err) {
      console.error(err)
    }
  }

  const handleDelete = (id: string) => {
    setRestaurants((prev) => prev.filter((r) => r.id !== id))
  }

  return (
    <Layout>
      <div className='flex items-center justify-between mb-4'>
        <div>
          <h1 className='font-serif text-2xl font-bold text-brown-dark'>
            Places I've tried
          </h1>
          <p className='text-sm text-brown-light mt-0.5'>
            {restaurants.length} places visited
          </p>
        </div>
      </div>

      <FilterBar tags={tags} onFiltersChange={handleFiltersChange} />

      {loading ? (
        <div className='flex items-center justify-center py-16'>
          <div className='w-6 h-6 border-2 border-terracotta border-t-transparent rounded-full animate-spin' />
        </div>
      ) : restaurants.length === 0 ? (
        <div className='text-center py-16'>
          <div className='flex justify-center mb-4'>
            <div className='w-20 h-20 rounded-full bg-terracotta-pale flex items-center justify-center'>
              <UtensilsCrossed size={36} className='text-brown-mid' strokeWidth={1.5} />
            </div>
          </div>
          <p className='font-serif text-lg text-brown-dark mb-1'>
            No tried places yet
          </p>
          <p className='text-sm text-brown-light'>
            Mark a saved restaurant as tried to see it here
          </p>
        </div>
      ) : (
        <div className='flex flex-col gap-3'>
          {restaurants.map((r) => (
            <RestaurantCard
              key={r.id}
              restaurant={r}
              onClick={() => setSelected(r)}
              onToggleFavorite={() => handleToggleFavorite(r.id)}
            />
          ))}
        </div>
      )}

      {selected && (
        <RestaurantModal
          restaurant={selected}
          onClose={() => setSelected(null)}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />
      )}
    </Layout>
  )
}
