import client from './client'

export interface Tag {
  id: string
  name: string
  category: string
}

export interface Review {
  id: string
  restaurant_id: string
  rating: number
  review_text: string | null
  visited_at: string | null
  created_at: string
  updated_at: string
}

export interface Restaurant {
  id: string
  user_id: string
  status: 'saved' | 'tried'
  is_favorite: boolean
  name: string
  country: string
  city: string
  area: string | null
  website_url: string | null
  google_maps_url: string | null
  google_place_id: string | null
  price_range: number | null
  notes: string | null
  tags: Tag[]
  review: Review | null
  created_at: string
  updated_at: string
}

export interface RestaurantFilters {
  status?: string
  country?: string
  city?: string
  price_range?: number
  tag_ids?: string[]
  q?: string
  is_favorite?: boolean
}

export interface CreateRestaurantData {
  name: string
  country: string
  city: string
  area?: string
  website_url?: string
  google_maps_url?: string
  google_place_id?: string
  price_range?: number
  notes?: string
  tag_ids?: string[]
}

export interface MarkTriedData {
  rating: number
  review_text?: string
  visited_at?: string
}

export const restaurantsApi = {
  list: async (filters: RestaurantFilters = {}): Promise<Restaurant[]> => {
    const { tag_ids, ...rest } = filters
    const params = new URLSearchParams()
    Object.entries(rest).forEach(([k, v]) => {
      if (v !== undefined && v !== '') params.append(k, String(v))
    })
    if (tag_ids && tag_ids.length > 0) {
      tag_ids.forEach((id) => params.append('tag_ids', id))
    }
    const res = await client.get(`/restaurants?${params.toString()}`)
    return res.data
  },
  get: async (id: string): Promise<Restaurant> => {
    const res = await client.get(`/restaurants/${id}`)
    return res.data
  },
  create: async (data: CreateRestaurantData): Promise<Restaurant> => {
    const res = await client.post('/restaurants', data)
    return res.data
  },
  update: async (
    id: string,
    data: Partial<CreateRestaurantData>
  ): Promise<Restaurant> => {
    const res = await client.patch(`/restaurants/${id}`, data)
    return res.data
  },
  delete: async (id: string): Promise<void> => {
    await client.delete(`/restaurants/${id}`)
  },
  markTried: async (id: string, data: MarkTriedData): Promise<Restaurant> => {
    const res = await client.post(`/restaurants/${id}/mark-tried`, data)
    return res.data
  },
  markSaved: async (id: string): Promise<Restaurant> => {
    const res = await client.post(`/restaurants/${id}/mark-saved`)
    return res.data
  },
  toggleFavorite: async (id: string): Promise<Restaurant> => {
    const res = await client.post(`/restaurants/${id}/toggle-favorite`)
    return res.data
  }
}
