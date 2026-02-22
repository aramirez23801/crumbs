import client from './client'
import type { Tag } from './restaurants'

export interface ConfigOptions {
  options: Record<string, Tag[]>
}

export const tagsApi = {
  list: async (): Promise<Tag[]> => {
    const res = await client.get('/tags')
    return res.data
  },

  getConfig: async (): Promise<ConfigOptions> => {
    const res = await client.get('/config/options')
    return res.data
  },
}
