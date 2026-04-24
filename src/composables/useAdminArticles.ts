import { ref, onMounted } from 'vue'
import { supabase } from '@/supabase'
import { processEnum } from '@/utils/articleHelpers'

export interface Article {
  id: string
  title: string
  slug: string
  district: string
  content: string
  category: string
  location: string
  image_url: string
  created_at: string
  lat?: number
  long?: number
  scheduled_from?: string | null // was missing from type
  scheduled_to?: string | null   // was missing from type
}

export function useAdminArticles() {
  const articles = ref<Article[]>([])
  const categories = ref<string[]>([])
  const districts = ref<string[]>([])

  const fetchArticles = async () => {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Failed to fetch articles:', error.message)
      return
    }
    articles.value = (data as unknown as Article[]) ?? []
  }

  const fetchEnums = async () => {
    const { data: catData, error: catError } = await supabase.rpc('get_enum_values', {
      type_name: 'category_type',
    })
    if (catError) {
      console.error('Failed to fetch categories:', catError.message) // was silently ignored
    } else if (catData) {
      categories.value = processEnum(catData, ['hiking', 'food', 'culture', 'wine'])
    }

    const { data: distData, error: distError } = await supabase.rpc('get_enum_values', {
      type_name: 'district',
    })
    if (distError) {
      console.error('Failed to fetch districts:', distError.message) // was silently ignored
    } else if (distData) {
      districts.value = processEnum(distData, [
        'limassol', 'paphos', 'nicosia', 'larnaca', 'kyrenia', 'famagusta',
      ])
    }
  }

  onMounted(() => {
    fetchArticles()
    fetchEnums()
  })

  return { articles, categories, districts, fetchArticles }
}