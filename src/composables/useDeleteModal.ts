import { ref } from 'vue'
import { supabase } from '@/supabase'
import type { Article } from '@/types/article'

export function useDeleteModal(articles: import('vue').Ref<Article[]>) {
  const isModalOpen = ref(false)
  const articleToDelete = ref<Article | null>(null)
  const deleteError = ref<string | null>(null) // was missing — failures were silent

  const openDeleteModal = (id: string) => {
    articleToDelete.value = articles.value.find(a => a.id === id) ?? null
    deleteError.value = null
    isModalOpen.value = true
  }

  const closeModal = () => {
    isModalOpen.value = false
    articleToDelete.value = null
    deleteError.value = null
  }

  const executeDelete = async () => {
    if (!articleToDelete.value) return

    const { id } = articleToDelete.value
    const { error } = await supabase.from('articles').delete().eq('id', id)

    if (error) {
      console.error('Delete failed:', error.message)
      deleteError.value = 'Failed to delete article. Please try again.' // surface to UI
      return // don't close modal — let user see the error
    }

    articles.value = articles.value.filter(a => a.id !== id)
    closeModal()
  }

  return { isModalOpen, articleToDelete, deleteError, openDeleteModal, closeModal, executeDelete }
}