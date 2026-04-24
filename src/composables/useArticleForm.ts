import { ref, reactive } from 'vue'
import { supabase } from '@/supabase'
import { processContent, buildPostgisPoint } from '@/utils/articleHelpers'
import type { Article } from './useAdminArticles'

export interface ArticleFormFields {
  title: string
  slug: string
  district: string
  content: string
  category: string
  lat: number | null
  long: number | null
  scheduled_from: string | null // was missing — never saved to DB
  scheduled_to: string | null   // was missing — never saved to DB
}

const EMPTY_FORM: ArticleFormFields = {
  title: '',
  slug: '',
  district: '',
  content: '',
  category: '',
  lat: null,
  long: null,
  scheduled_from: null, // was missing
  scheduled_to: null,   // was missing
}

export function useArticleForm(onSuccess: () => Promise<void>) {
  const form = reactive<ArticleFormFields>({ ...EMPTY_FORM })
  const uploading = ref(false)
  const statusMsg = ref('')
  const isError = ref(false)
  const selectedFile = ref<File | null>(null)
  const editingId = ref<string | null>(null)

  const resetForm = () => {
    Object.assign(form, EMPTY_FORM)
    selectedFile.value = null
    editingId.value = null
    statusMsg.value = ''
    isError.value = false
  }

  const handleEdit = (article: Article) => {
    Object.assign(form, {
      title: article.title,
      slug: article.slug,
      district: article.district,
      content: article.content,
      category: article.category,
      lat: article.lat ?? null,
      long: article.long ?? null,
      scheduled_from: article.scheduled_from ?? null, // carry through on edit
      scheduled_to: article.scheduled_to ?? null,
    })
    editingId.value = article.id
    selectedFile.value = null
    statusMsg.value = ''
  }

  const handleFileChange = (event: Event) => {
    const target = event.target as HTMLInputElement
    if (target.files?.length) {
      selectedFile.value = target.files[0]
    }
  }

  const handleFormError = (message: string) => {
    isError.value = true
    statusMsg.value = message
  }

  const uploadArticle = async () => {
    try {
      uploading.value = true
      statusMsg.value = 'Saving...'
      isError.value = false

      const processedContent = processContent(form.content)
      const location = buildPostgisPoint(form.lat, form.long)

      let imagePath: string | undefined

      if (selectedFile.value) {
        const ext = selectedFile.value.name.split('.').pop()
        const fileName = `${crypto.randomUUID()}.${ext}`
        const { error: uploadError } = await supabase.storage
          .from('articles')
          .upload(fileName, selectedFile.value)
        if (uploadError) throw uploadError
        imagePath = fileName
      }

      // Shared fields used in both insert and update
      const scheduleFields = {
        scheduled_from: form.scheduled_from || null,
        scheduled_to: form.scheduled_to || null,
      }

      if (editingId.value) {
        const { error } = await supabase
          .from('articles')
          .update({
            title: form.title,
            slug: form.slug,
            district: form.district,
            content: processedContent,
            category: form.category,
            location,
            ...scheduleFields, // was missing
            ...(imagePath && { image_url: imagePath }),
          })
          .eq('id', editingId.value)

        if (error) throw error
        statusMsg.value = 'Article updated successfully!'
      } else {
        if (!imagePath) throw new Error('Please select an image.')

        const { error } = await supabase
          .from('articles')
          .insert([{
            title: form.title,
            slug: form.slug,
            district: form.district,
            content: processedContent,
            category: form.category,
            location,
            image_url: imagePath,
            ...scheduleFields, // was missing
          }])

        if (error) throw error
        statusMsg.value = 'Article published successfully!'
      }

      resetForm()
      await onSuccess()
    } catch (err) {
      isError.value = true
      statusMsg.value = err instanceof Error ? err.message : 'An unexpected error occurred.'
    } finally {
      uploading.value = false
    }
  }

  return {
    form, uploading, statusMsg, isError,
    editingId, selectedFile,
    resetForm, handleEdit, handleFileChange,
    handleFormError, uploadArticle,
  }
}