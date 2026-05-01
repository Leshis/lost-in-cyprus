import { defineStore } from 'pinia'
import { supabase } from '@/supabase'
import { supabaseAdmin } from '@/supabaseAdmin'
import type { Article } from '@/types/article'

interface ArticleState {
  items: Article[]
  loading: boolean
  error: string | null
}

export const useArticleStore = defineStore('articles', {
  state: (): ArticleState => ({
    items: [],
    loading: false,
    error: null,
  }),

  getters: {
    getArticleById: (state) => {
      return (id: string | number): Article | undefined => {
        const numericId = typeof id === 'string' ? parseInt(id, 10) : id
        return state.items.find((item) => item.id === numericId)
      }
    },

    getArticleBySlug: (state) => {
      return (slug: string): Article | undefined =>
        state.items.find((item) => item.slug === slug)
    },

    publishedArticles: (state): Article[] => {
      const now = new Date()
      return state.items.filter((a) => {
        if (!a.is_published) return false
        if (a.scheduled_to && new Date(a.scheduled_to) < now) return false
        if (a.scheduled_from && new Date(a.scheduled_from) > now) return false
        return true
      })
    },
  },

  actions: {
    async fetchArticles(force = false): Promise<void> {
      if (this.items.length > 0 && !force) return

      this.loading = true
      this.error = null
      try {
        const { data, error } = await supabase
          .from('articles')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) throw error
        this.items = (data ?? []) as Article[]
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch articles'
        this.error = message
        console.error('fetchArticles:', message)
      } finally {
        this.loading = false
      }
    },

    async fetchArticleBySlug(slug: string): Promise<void> {
      this.loading = true
      this.error = null
      try {
        const { data, error } = await supabase
          .from('article_details')
          .select('*')
          .eq('slug', slug)
          .maybeSingle()

        if (error) throw error

        if (data) {
          const typed = data as Article
          const index = this.items.findIndex((item) => item.slug === slug)
          if (index !== -1) {
            this.items[index] = typed
          } else {
            this.items.push(typed)
          }
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch article'
        this.error = message
        console.error('fetchArticleBySlug:', message)
      } finally {
        this.loading = false
      }
    },

    async fetchArticleBySlugAdmin(slug: string): Promise<void> {
      this.loading = true
      this.error = null
      try {
        const { data, error } = await supabaseAdmin
          .from('articles')
          .select('*')
          .eq('slug', slug)
          .maybeSingle()

        if (error) throw error
        if (data) {
          const typed = data as Article
          const index = this.items.findIndex((item) => item.slug === slug)
          if (index !== -1) {
            this.items[index] = typed
          } else {
            this.items.push(typed)
          }
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch article (admin)'
        this.error = message
        console.error('fetchArticleBySlugAdmin:', message)
      } finally {
        this.loading = false
      }
    },
  },
})