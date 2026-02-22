import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import RestaurantCard from '../components/RestaurantCard'
import FilterBar from '../components/FilterBar'
import RestaurantModal from '../components/RestaurantModal'
import { restaurantsApi } from '../api/restaurants'
import { tagsApi } from '../api/tags'
import type { Restaurant, RestaurantFilters } from '../api/restaurants'
import type { Tag } from '../api/restaurants'

export default function FavoritesPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Restaurant | null>(null)

  const fetchRestaurants = async (filters: RestaurantFilters = {}) => {
    try {
      const data = await restaurantsApi.list({ ...filters, is_favorite: true })
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
    city?: string
  }) => {
    fetchRestaurants(filters)
  }

  const handleUpdate = (updated: Restaurant) => {
    if (!updated.is_favorite) {
      setRestaurants((prev) => prev.filter((r) => r.id !== updated.id))
    } else {
      setRestaurants((prev) =>
        prev.map((r) => (r.id === updated.id ? updated : r))
      )
    }
    setSelected(null)
  }

  const handleDelete = (id: string) => {
    setRestaurants((prev) => prev.filter((r) => r.id !== id))
  }

  return (
    <Layout>
      <div className='flex items-center justify-between mb-4'>
        <div>
          <h1 className='font-serif text-2xl font-bold text-brown-dark'>
            Favorites
          </h1>
          <p className='text-sm text-brown-light mt-0.5'>
            {restaurants.length} places loved
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
          <p className='text-4xl mb-3'>⭐</p>
          <p className='font-serif text-lg text-brown-dark mb-1'>
            No favourites yet
          </p>
          <p className='text-sm text-brown-light'>
            Mark a tried restaurant as favourite to see it here
          </p>
        </div>
      ) : (
        <div className='flex flex-col gap-3'>
          {restaurants.map((r) => (
            <RestaurantCard
              key={r.id}
              restaurant={r}
              onClick={() => setSelected(r)}
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
