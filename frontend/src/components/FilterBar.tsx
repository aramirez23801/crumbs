import { useState } from 'react'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import type { Tag } from '../api/restaurants'

interface FilterBarProps {
  tags: Tag[]
  onFiltersChange: (filters: {
    q: string
    tag_ids: string[]
    price_range?: number
    city?: string
  }) => void
}

export default function FilterBar({ tags, onFiltersChange }: FilterBarProps) {
  const [q, setQ] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [selectedPrice, setSelectedPrice] = useState<number | undefined>()
  const [city, setCity] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  const notify = (
    newQ: string,
    newTags: string[],
    newPrice?: number,
    newCity?: string
  ) => {
    onFiltersChange({
      q: newQ,
      tag_ids: newTags,
      price_range: newPrice,
      city: newCity
    })
  }

  const toggleTag = (id: string) => {
    const updated = selectedTags.includes(id)
      ? selectedTags.filter((t) => t !== id)
      : [...selectedTags, id]
    setSelectedTags(updated)
    notify(q, updated, selectedPrice, city)
  }

  const togglePrice = (range: number) => {
    const updated = selectedPrice === range ? undefined : range
    setSelectedPrice(updated)
    notify(q, selectedTags, updated, city)
  }

  const clearAll = () => {
    setQ('')
    setSelectedTags([])
    setSelectedPrice(undefined)
    setCity('')
    onFiltersChange({ q: '', tag_ids: [] })
  }

  const hasActiveFilters =
    selectedTags.length > 0 || !!selectedPrice || !!q || !!city

  return (
    <div className='mb-4'>
      <div className='flex gap-2 mb-3'>
        <div className='flex-1 flex items-center gap-2 bg-white border border-[#E8E2DA] rounded-full px-4 py-2.5 shadow-sm'>
          <Search size={15} className='text-brown-light flex-shrink-0' />
          <input
            value={q}
            onChange={(e) => {
              setQ(e.target.value)
              notify(e.target.value, selectedTags, selectedPrice, city)
            }}
            placeholder='Search by name, city, country...'
            className='flex-1 bg-transparent text-sm text-brown-dark placeholder-brown-light/60 outline-none'
          />
          {q && (
            <button
              onClick={() => {
                setQ('')
                notify('', selectedTags, selectedPrice, city)
              }}
            >
              <X size={13} className='text-brown-light' />
            </button>
          )}
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className='w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-terracotta text-white'
        >
          <SlidersHorizontal size={16} />
        </button>
      </div>

      {hasActiveFilters && (
        <div className='flex gap-2 overflow-x-auto no-scrollbar pb-1'>
          {selectedTags.map((id) => {
            const tag = tags.find((t) => t.id === id)
            if (!tag) return null
            return (
              <button
                key={id}
                onClick={() => toggleTag(id)}
                className='px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border bg-brown-dark text-white border-brown-dark flex items-center gap-1'
              >
                {tag.name} <X size={10} />
              </button>
            )
          })}
          {selectedPrice && (
            <button
              onClick={() => togglePrice(selectedPrice)}
              className='px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border bg-brown-dark text-white border-brown-dark flex items-center gap-1'
            >
              {'€'.repeat(selectedPrice)} <X size={10} />
            </button>
          )}
          {city && (
            <button
              onClick={() => {
                setCity('')
                notify(q, selectedTags, selectedPrice, '')
              }}
              className='px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border bg-brown-dark text-white border-brown-dark flex items-center gap-1'
            >
              📍 {city} <X size={10} />
            </button>
          )}
          <button
            onClick={clearAll}
            className='px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border border-[#E8E2DA] bg-white text-brown-light flex items-center gap-1'
          >
            <X size={10} /> Clear all
          </button>
        </div>
      )}

      {showFilters && (
        <div className='mt-3 bg-white rounded-2xl border border-[#E8E2DA] p-4'>
          <p className='text-xs font-semibold uppercase tracking-wide text-brown-light mb-3'>
            Price Range
          </p>
          <div className='flex gap-2 mb-4'>
            {[1, 2, 3, 4].map((range) => (
              <button
                key={range}
                onClick={() => togglePrice(range)}
                className={`flex-1 py-2 rounded-xl text-sm font-semibold border transition-all ${
                  selectedPrice === range
                    ? 'bg-terracotta text-white border-terracotta'
                    : 'bg-white text-brown-mid border-[#E8E2DA]'
                }`}
              >
                {'€'.repeat(range)}
              </button>
            ))}
          </div>
          <p className='text-xs font-semibold uppercase tracking-wide text-brown-light mb-3'>
            All Tags
          </p>
          <div className='flex flex-wrap gap-2 mb-4'>
            {tags.map((tag) => (
              <button
                key={tag.id}
                onClick={() => toggleTag(tag.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                  selectedTags.includes(tag.id)
                    ? 'bg-brown-dark text-white border-brown-dark'
                    : 'bg-cream text-brown-mid border-[#E8E2DA]'
                }`}
              >
                {tag.name}
              </button>
            ))}
          </div>
          <p className='text-xs font-semibold uppercase tracking-wide text-brown-light mb-3'>
            City
          </p>
          <input
            value={city}
            onChange={(e) => {
              setCity(e.target.value)
              notify(q, selectedTags, selectedPrice, e.target.value)
            }}
            placeholder='e.g. Madrid, Rome...'
            className='w-full px-4 py-2.5 rounded-xl border border-[#E8E2DA] bg-cream text-sm text-brown-dark placeholder-brown-light/60 outline-none focus:border-terracotta transition-colors'
          />
        </div>
      )}
    </div>
  )
}
