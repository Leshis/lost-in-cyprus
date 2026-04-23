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
      return (slug: string): Article | undefined =>
        state.items.find(article => article.slug === slug)
    }
  },

  actions: {
    async fetchArticles() {
      if (this.items.length > 0) return

      this.loading = true
      try {
        const { data, error } = await supabase
          .from('article_details')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) throw error
        if (data) {
          this.items = data as Article[]
        }
      } catch (error) {
        console.error('Error fetching articles:', error)
      } finally {
        this.loading = false
      }
    },

    async fetchArticleById(id: string | number) {
      this.loading = true;
      const numericId = typeof id === 'string' ? parseInt(id, 10) : id;

      try {
        const { data, error } = await supabase
          .from('article_details')
          .select('*')
          .eq('id', numericId)
          .single();

        if (error) throw error;

        if (data) {
          const typedData = data as Article;

          // Look for the index of the existing item
          const index = this.items.findIndex(item => item.id === numericId);

          if (index !== -1) {
            // If it exists, replace it (updates the data without duplicating)
            this.items[index] = typedData;
          } else {
            // If it's new, add it
            this.items.push(typedData);
          }
        }
      } catch (error) {
        console.error('Error fetching single article:', error);
      } finally {
        this.loading = false;
      }
    }
  }
})