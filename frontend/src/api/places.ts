import client from './client'

export interface PlaceSuggestion {
  place_id: string
  description: string
  main_text: string
  secondary_text: string
}

export interface PlaceDetails {
  place_id: string
  name: string
  website_url: string | null
  google_maps_url: string | null
  country: string | null
  city: string | null
  area: string | null
  price_range: number | null
}

export const placesApi = {
  search: async (q: string): Promise<PlaceSuggestion[]> => {
    const res = await client.get(`/places/search`, { params: { q } })
    return res.data
  },
  getDetails: async (placeId: string): Promise<PlaceDetails> => {
    const res = await client.get(`/places/details/${placeId}`)
    return res.data
  }
}
