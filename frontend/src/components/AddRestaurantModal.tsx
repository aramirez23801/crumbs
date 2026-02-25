import { useState, useEffect, useRef } from 'react'
import { X, Search, CheckCircle } from 'lucide-react'
import { restaurantsApi } from '../api/restaurants'
import { tagsApi } from '../api/tags'
import { placesApi } from '../api/places'
import type { Restaurant } from '../api/restaurants'
import type { Tag } from '../api/restaurants'
import type { PlaceSuggestion } from '../api/places'

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

  // Form fields
  const [name, setName] = useState('')
  const [country, setCountry] = useState('')
  const [city, setCity] = useState('')
  const [area, setArea] = useState('')
  const [websiteUrl, setWebsiteUrl] = useState('')
  const [googleMapsUrl, setGoogleMapsUrl] = useState('')
  const [googlePlaceId, setGooglePlaceId] = useState('')
  const [priceRange, setPriceRange] = useState<number | undefined>()
  const [notes, setNotes] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  // Autocomplete state
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [autoFilled, setAutoFilled] = useState(false)
  const [searchLoading, setSearchLoading] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    tagsApi.list().then(setTags)
  }, [])

  const handleNameChange = (value: string) => {
    setName(value)
    setAutoFilled(false)
    setGooglePlaceId('')

    if (debounceRef.current) clearTimeout(debounceRef.current)

    if (value.length < 2) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }

    debounceRef.current = setTimeout(async () => {
      setSearchLoading(true)
      try {
        const results = await placesApi.search(value)
        setSuggestions(results)
        setShowSuggestions(results.length > 0)
      } catch {
        setSuggestions([])
      } finally {
        setSearchLoading(false)
      }
    }, 400)
  }

  const handleSelectSuggestion = async (suggestion: PlaceSuggestion) => {
    setShowSuggestions(false)
    setName(suggestion.main_text)
    setSearchLoading(true)
    try {
      const details = await placesApi.getDetails(suggestion.place_id)
      setName(details.name)
      setCountry(details.country ?? '')
      setCity(details.city ?? '')
      setArea(details.area ?? '')
      setWebsiteUrl(details.website_url ?? '')
      setGoogleMapsUrl(details.google_maps_url ?? '')
      setGooglePlaceId(details.place_id)
      if (details.price_range) setPriceRange(details.price_range)
      setAutoFilled(true)
    } catch {
      setError('Could not fetch place details, please fill in manually')
    } finally {
      setSearchLoading(false)
    }
  }

  const toggleTag = (id: string) => {
    setSelectedTags((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    )
  }

  const handleSubmit = async () => {
    if (!name || !country || !city) {
      setError('Name, country and city are required')
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
        website_url: websiteUrl || undefined,
        google_maps_url: googleMapsUrl || undefined,
        google_place_id: googlePlaceId || undefined,
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
            {/* Restaurant Name with Autocomplete */}
            <div className='relative'>
              <label className='text-xs font-semibold uppercase tracking-wide text-brown-light mb-1.5 block'>
                Restaurant Name *
              </label>
              <div className='relative'>
                <input
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  onBlur={() =>
                    setTimeout(() => setShowSuggestions(false), 200)
                  }
                  placeholder='e.g. Casa Botín'
                  className='w-full px-4 py-3 pr-10 rounded-xl border border-[#E8E2DA] bg-white text-sm text-brown-dark placeholder-brown-light/60 outline-none focus:border-terracotta transition-colors'
                />
                <div className='absolute right-3 top-1/2 -translate-y-1/2 text-brown-light'>
                  {searchLoading ? (
                    <div className='w-4 h-4 border-2 border-terracotta border-t-transparent rounded-full animate-spin' />
                  ) : autoFilled ? (
                    <CheckCircle size={16} className='text-green-500' />
                  ) : (
                    <Search size={16} />
                  )}
                </div>
              </div>

              {/* Suggestions dropdown */}
              {showSuggestions && (
                <div className='absolute z-10 w-full mt-1 bg-white border border-[#E8E2DA] rounded-xl shadow-lg overflow-hidden'>
                  {suggestions.map((s) => (
                    <button
                      key={s.place_id}
                      onMouseDown={() => handleSelectSuggestion(s)}
                      className='w-full px-4 py-3 text-left hover:bg-cream transition-colors border-b border-[#E8E2DA] last:border-0'
                    >
                      <p className='text-sm font-medium text-brown-dark'>
                        {s.main_text}
                      </p>
                      <p className='text-xs text-brown-light'>
                        {s.secondary_text}
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Auto-filled badge */}
            {autoFilled && (
              <p className='text-xs text-green-600 bg-green-50 px-3 py-2 rounded-lg'>
                ✓ Auto-filled from Google Maps — you can edit any field below
              </p>
            )}

            {/* Website URL */}
            <div>
              <label className='text-xs font-semibold uppercase tracking-wide text-brown-light mb-1.5 block'>
                Website URL
              </label>
              <input
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                placeholder='https://...'
                className='w-full px-4 py-3 rounded-xl border border-[#E8E2DA] bg-white text-sm text-brown-dark placeholder-brown-light/60 outline-none focus:border-terracotta transition-colors'
              />
            </div>

            {/* Google Maps URL */}
            <div>
              <label className='text-xs font-semibold uppercase tracking-wide text-brown-light mb-1.5 block'>
                Google Maps URL
              </label>
              <input
                value={googleMapsUrl}
                onChange={(e) => setGoogleMapsUrl(e.target.value)}
                placeholder='https://maps.google.com/...'
                className='w-full px-4 py-3 rounded-xl border border-[#E8E2DA] bg-white text-sm text-brown-dark placeholder-brown-light/60 outline-none focus:border-terracotta transition-colors'
              />
            </div>

            {/* Country / City */}
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

            {/* Area */}
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

            {/* Price Range */}
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

            {/* Tags */}
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

            {/* Notes */}
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
