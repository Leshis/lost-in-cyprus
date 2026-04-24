import { defineStore } from 'pinia'
import { supabase } from '@/supabase' // Adjust based on your setup

// 1. Define the shape of your Article
export interface Article {
  id: number
  title: string
  slug: string
  district: string
  content: string
  category: string
  image_url: string | null
  created_at: string
  lat?: number
  long?: number
}

// 2. Define the Store State type
interface ArticleState {
  items: Article[]
  loading: boolean
}

export const useArticleStore = defineStore('articles', {
  state: (): ArticleState => ({
    items: [],
    loading: false
  }),

  getters: {
    getArticleById: (state) => {
      return (id: string | number) => {
        const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
        return state.items.find(item => item.id === numericId);
      }
    },

    getArticleBySlug: (state) => {
      return (slug: string) => state.items.find(item => item.slug === slug)
    }
  },

  actions: {
    // Remove the "if (this.items.length > 0) return" to allow manual refreshes
    async fetchArticles(force = false) {
      if (this.items.length > 0 && !force) return

      this.loading = true
      try {
        const { data, error } = await supabase
          .from('article_details')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) throw error
        this.items = (data || []) as Article[]
      } catch (error) {
        console.error('Error fetching articles:', error)
      } finally {
        this.loading = false
      }
    },

    async fetchArticleBySlug(slug: string) {
      this.loading = true
      try {
        const { data, error } = await supabase
          .from('article_details')
          .select('*')
          .eq('slug', slug)
          .maybeSingle() // Fixes PGRST116 error

        if (error) throw error

        if (data) {
          const typedData = data as Article
          const index = this.items.findIndex(item => item.slug === slug)
          if (index !== -1) {
            this.items[index] = typedData
          } else {
            this.items.push(typedData)
          }
        }
      } catch (error) {
        console.error('Error fetching by slug:', error)
      } finally {
        this.loading = false
      }
    }
  }
})