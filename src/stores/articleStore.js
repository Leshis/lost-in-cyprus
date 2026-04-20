import { defineStore } from 'pinia'
import { supabase } from '@/supabase' // The connection file we just made

export const useArticleStore = defineStore('articles', {
  state: () => ({
    items: [],
    loading: false
  }),
  
  actions: {
    async fetchArticles() {
      if (this.items.length > 0) return // Don't fetch twice if we already have data
      
      this.loading = true
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .order('created_at', { ascending: false }) // Newest first
      
      if (!error) {
        this.items = data
      }
      this.loading = false
    },
    
    // This is for your "Read More" page
    getArticleBySlug(slug) {
      return this.items.find(article => article.slug === slug)
    }
  }
})
