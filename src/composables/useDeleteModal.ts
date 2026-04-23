import { ref } from 'vue'
import { supabase } from '@/supabase'
import type { Article } from './useAdminArticles'

export function useDeleteModal(articles: import('vue').Ref<Article[]>) {
  const isModalOpen = ref(false)
  const articleToDelete = ref<Article | null>(null)

  const openDeleteModal = (id: string) => {
    articleToDelete.value = articles.value.find(a => a.id === id) ?? null
    isModalOpen.value = true
  }

  const closeModal = () => {
    isModalOpen.value = false
    articleToDelete.value = null
  }

  const executeDelete = async () => {
    if (!articleToDelete.value) return

    const { id } = articleToDelete.value
    const { error } = await supabase.from('articles').delete().eq('id', id)

    if (error) {
      console.error('Delete failed:', error.message)
    } else {
      articles.value = articles.value.filter(a => a.id !== id)
    }

    closeModal()
  }

  return { isModalOpen, articleToDelete, openDeleteModal, closeModal, executeDelete }
}