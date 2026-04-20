import { defineStore } from 'pinia'
import { supabase } from '@/supabase'

export const useArticleStore = defineStore('articles', {
  state: () => ({
    items: [],
    loading: false
  }),

  // MOVE THIS HERE (Sibling to state and actions)
  getters: {
    getArticleById: (state) => {
      return (id) => state.items.find(item => item.id === parseInt(id))
    }
  },

  actions: {
    async fetchArticles() {
      if (this.items.length > 0) return 

      this.loading = true
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .order('created_at', { ascending: false })

      if (!error) {
        this.items = data
      }
      this.loading = false
    },

    // This is a regular action/method
    getArticleBySlug(slug) {
      return this.items.find(article => article.slug === slug)
    }
  }
})
