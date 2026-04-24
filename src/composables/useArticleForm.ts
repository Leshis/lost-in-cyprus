import { ref, reactive } from 'vue'
import { supabase } from '@/supabase'
import { processContent, buildPostgisPoint } from '@/utils/articleHelpers'
import type { Article } from '@/composables/useAdminArticles'

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

  // Add 'undefined' to the allowed types here
  const formatForInput = (dateString: string | null | undefined) => {
    if (!dateString) return null
    return dateString.slice(0, 16)
  }

  const handleEdit = (article: Article) => {
    // Extract coordinates from the "POINT(long lat)" string if necessary
    let extractedLat = article.lat;
    let extractedLong = article.long;

    if (!extractedLat && article.location) {
      const coords = article.location.match(/-?\d+\.\d+/g);
      if (coords) {
        extractedLong = parseFloat(coords[0]);
        extractedLat = parseFloat(coords[1]);
      }
    }

    Object.assign(form, {
      ...article,
      lat: extractedLat ?? null,
      long: extractedLong ?? null,
      // Fix for the date format error
      scheduled_from: formatForInput(article.scheduled_from),
      scheduled_to: formatForInput(article.scheduled_to),
    });

    editingId.value = article.id;
  };

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
      const location = (form.lat !== null && form.long !== null)
        ? buildPostgisPoint(form.lat, form.long)
        : null

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

      const articlePayload: any = {
        title: form.title,
        slug: form.slug,
        district: form.district,
        content: processedContent,
        category: form.category,
        location,
        scheduled_from: form.scheduled_from || null,
        scheduled_to: form.scheduled_to || null,
      }

      if (imagePath) articlePayload.image_url = imagePath

      if (editingId.value) {
        const { error } = await supabase
          .from('articles')
          .update(articlePayload)
          .eq('id', editingId.value) // Correctly targets the row
        if (error) throw error
        statusMsg.value = 'Article updated successfully!'
      } else {
        if (!imagePath) throw new Error('Please select an image.')
        const { error } = await supabase
          .from('articles')
          .insert([articlePayload])
        if (error) throw error
        statusMsg.value = 'Article published successfully!'
      }

      // Refresh the table immediately
      await onSuccess()

      // Wait a moment so the user sees the "Success" message before the form clears
      setTimeout(() => {
        resetForm()
      }, 1500)

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