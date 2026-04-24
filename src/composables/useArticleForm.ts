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
}

const EMPTY_FORM: ArticleFormFields = {
  title: '',
  slug: '',
  district: '',
  content: '',
  category: '',
  lat: null,
  long: null,
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

  const uploadArticle = async () => {
  try {
    uploading.value = true
    statusMsg.value = 'Saving...'
    isError.value = false

    const processedContent = processContent(form.content)
    const location = buildPostgisPoint(form.lat, form.long)

    // Helper: HTML date inputs return "" when empty. 
    // We need NULL for the Postgres 'timestamptz' columns.
    const formatDate = (date: string | null | undefined) => 
      (date && date.trim() !== '') ? date : null

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

    // Create a base payload to keep the code DRY (Don't Repeat Yourself)
    const payload = {
      title: form.title,
      slug: form.slug,
      district: form.district,
      content: processedContent,
      category: form.category,
      location,
      scheduled_from: formatDate(form.scheduled_from),
      scheduled_to: formatDate(form.scheduled_to),
      is_published: form.is_published, // Ensure this boolean is sent
    }

    if (editingId.value) {
      const { error } = await supabase
        .from('articles')
        .update({
          ...payload,
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
          ...payload,
          image_url: imagePath,
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