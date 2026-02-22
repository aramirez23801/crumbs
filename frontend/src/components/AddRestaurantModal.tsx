import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { restaurantsApi } from '../api/restaurants'
import { tagsApi } from '../api/tags'
import type { Restaurant } from '../api/restaurants'
import type { Tag } from '../api/restaurants'

interface AddRestaurantModalProps {
  onClose: () => void
  onAdd: (restaurant: Restaurant) => void
}

export default function AddRestaurantModal({
  onClose,
  onAdd
}: AddRestaurantModalProps) {
  const [tags, setTags] = useState<Tag[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [name, setName] = useState('')
  const [country, setCountry] = useState('')
  const [city, setCity] = useState('')
  const [area, setArea] = useState('')
  const [placeUrl, setPlaceUrl] = useState('')
  const [priceRange, setPriceRange] = useState<number | undefined>()
  const [notes, setNotes] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  useEffect(() => {
    tagsApi.list().then(setTags)
  }, [])

  const toggleTag = (id: string) => {
    setSelectedTags((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    )
  }

  const handleSubmit = async () => {
    if (!name || !country || !city || !placeUrl) {
      setError('Name, country, city and URL are required')
      return
    }
    setError('')
    setLoading(true)
    try {
      const restaurant = await restaurantsApi.create({
        name,
        country,
        city,
        area: area || undefined,
        place_url: placeUrl,
        price_range: priceRange,
        notes: notes || undefined,
        tag_ids: selectedTags
      })
      onAdd(restaurant)
      onClose()
    } catch {
      setError('Something went wrong, please try again')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className='fixed inset-0 bg-brown-dark/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4'
      onClick={onClose}
    >
      <div
        className='bg-cream w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl max-h-[92vh] overflow-y-auto'
        onClick={(e) => e.stopPropagation()}
      >
        <div className='flex justify-center pt-3 pb-1 sm:hidden'>
          <div className='w-9 h-1 bg-[#E8E2DA] rounded-full' />
        </div>

        <div className='p-5'>
          <div className='flex items-center justify-between mb-5'>
            <h2 className='font-serif text-xl font-bold text-brown-dark'>
              Add a place
            </h2>
            <button
              onClick={onClose}
              className='w-8 h-8 rounded-full bg-white border border-[#E8E2DA] flex items-center justify-center text-brown-mid'
            >
              <X size={15} />
            </button>
          </div>

          <div className='flex flex-col gap-4'>
            <div>
              <label className='text-xs font-semibold uppercase tracking-wide text-brown-light mb-1.5 block'>
                Restaurant Name *
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder='e.g. Casa Botín'
                className='w-full px-4 py-3 rounded-xl border border-[#E8E2DA] bg-white text-sm text-brown-dark placeholder-brown-light/60 outline-none focus:border-terracotta transition-colors'
              />
            </div>

            <div>
              <label className='text-xs font-semibold uppercase tracking-wide text-brown-light mb-1.5 block'>
                Website / Google Maps URL *
              </label>
              <input
                value={placeUrl}
                onChange={(e) => setPlaceUrl(e.target.value)}
                placeholder='https://...'
                className='w-full px-4 py-3 rounded-xl border border-[#E8E2DA] bg-white text-sm text-brown-dark placeholder-brown-light/60 outline-none focus:border-terracotta transition-colors'
              />
            </div>

            <div className='grid grid-cols-2 gap-3'>
              <div>
                <label className='text-xs font-semibold uppercase tracking-wide text-brown-light mb-1.5 block'>
                  Country *
                </label>
                <input
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder='Spain'
                  className='w-full px-4 py-3 rounded-xl border border-[#E8E2DA] bg-white text-sm text-brown-dark placeholder-brown-light/60 outline-none focus:border-terracotta transition-colors'
                />
              </div>
              <div>
                <label className='text-xs font-semibold uppercase tracking-wide text-brown-light mb-1.5 block'>
                  City *
                </label>
                <input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder='Madrid'
                  className='w-full px-4 py-3 rounded-xl border border-[#E8E2DA] bg-white text-sm text-brown-dark placeholder-brown-light/60 outline-none focus:border-terracotta transition-colors'
                />
              </div>
            </div>

            <div>
              <label className='text-xs font-semibold uppercase tracking-wide text-brown-light mb-1.5 block'>
                Area / Neighbourhood
              </label>
              <input
                value={area}
                onChange={(e) => setArea(e.target.value)}
                placeholder='e.g. La Latina'
                className='w-full px-4 py-3 rounded-xl border border-[#E8E2DA] bg-white text-sm text-brown-dark placeholder-brown-light/60 outline-none focus:border-terracotta transition-colors'
              />
            </div>

            <div>
              <label className='text-xs font-semibold uppercase tracking-wide text-brown-light mb-1.5 block'>
                Price Range
              </label>
              <div className='flex gap-2'>
                {[1, 2, 3, 4].map((range) => (
                  <button
                    key={range}
                    onClick={() =>
                      setPriceRange(priceRange === range ? undefined : range)
                    }
                    className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-all ${
                      priceRange === range
                        ? 'bg-terracotta text-white border-terracotta'
                        : 'bg-white text-brown-mid border-[#E8E2DA]'
                    }`}
                  >
                    {'€'.repeat(range)}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className='text-xs font-semibold uppercase tracking-wide text-brown-light mb-1.5 block'>
                Tags
              </label>
              <div className='flex flex-wrap gap-2'>
                {tags.map((tag) => (
                  <button
                    key={tag.id}
                    onClick={() => toggleTag(tag.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                      selectedTags.includes(tag.id)
                        ? 'bg-brown-dark text-white border-brown-dark'
                        : 'bg-white text-brown-mid border-[#E8E2DA]'
                    }`}
                  >
                    {tag.name}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className='text-xs font-semibold uppercase tracking-wide text-brown-light mb-1.5 block'>
                Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder='Anything to remember...'
                rows={2}
                className='w-full px-4 py-3 rounded-xl border border-[#E8E2DA] bg-white text-sm text-brown-dark placeholder-brown-light/60 outline-none focus:border-terracotta resize-none transition-colors'
              />
            </div>

            {error && (
              <p className='text-sm text-red-500 bg-red-50 px-4 py-2 rounded-lg'>
                {error}
              </p>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading}
              className='w-full py-3 bg-terracotta text-white rounded-full text-sm font-semibold disabled:opacity-60 transition-opacity'
            >
              {loading ? 'Saving...' : 'Save Restaurant'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
