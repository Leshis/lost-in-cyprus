<template>
  <form @submit.prevent="$emit('submit')" class="article-form">
    <div class="field">
      <label for="article-title">Article Title</label>
      <input id="article-title" v-model="localForm.title" type="text"
        placeholder="e.g. Hidden Gems of the Akamas Peninsula" required />
    </div>

    <div class="field">
      <label for="article-slug">URL Slug</label>
      <input id="article-slug" v-model="localForm.slug" type="text" placeholder="hidden-gems-akamas-peninsula"
        required />
      <span class="hint">The unique URL path (e.g., cyprusguide.com/articles/slug-name)</span>
    </div>

    <div class="form-row">
      <div class="field">
        <label for="article-lat">Latitude</label>
        <input id="article-lat" v-model.number="localForm.lat" type="number" step="any"
          placeholder="34.9823 (e.g. Paphos)" required />
      </div>
      <div class="field">
        <label for="article-long">Longitude</label>
        <input id="article-long" v-model.number="localForm.long" type="number" step="any" placeholder="32.3382"
          required />
      </div>
    </div>

    <div class="form-row">
      <div class="field">
        <label for="article-district">Cyprus District</label>
        <select id="article-district" v-model="localForm.district" required>
          <option value="" disabled>Select a district</option>
          <option v-for="dist in districts" :key="dist" :value="dist">
            {{ dist }}
          </option>
        </select>
      </div>

      <div class="field">
        <label for="article-category">Travel Category</label>
        <select id="article-category" v-model="localForm.category" required>
          <option value="" disabled>Select a category</option>
          <option v-for="cat in categories" :key="cat" :value="cat">
            {{ cat }}
          </option>
        </select>
      </div>
    </div>

    <div class="form-row">
      <div class="field">
        <label>Go Live Date (Optional)</label>
        <input type="datetime-local" v-model="localForm.scheduled_from" />
        <p class="hint">Leave blank for instant publish</p>
      </div>

      <div class="field">
        <label>Expiry Date (Optional)</label>
        <input type="datetime-local" v-model="localForm.scheduled_to" />
        <p class="hint">Leave blank to keep up forever</p>
      </div>
    </div>

    <div class="field">
      <RichTextEditor v-model="localForm.content" />
    </div>

    <div class="field">
      <label for="article-image">
        Featured Image (Beaches, Tavernas, etc.)
        <span v-if="requireImage" class="required-star">*</span>
      </label>
      <input id="article-image" type="file" accept="image/*" :required="requireImage"
        @change="$emit('file-change', $event)" />
    </div>

    <div class="actions">
      <button type="submit" :disabled="uploading" class="submit-btn">
        {{ submitButtonText }}
      </button>

      <button 
        v-if="mode === 'edit'" 
        type="button" 
        @click="$emit('toggle-publish')" 
        :class="localForm.is_published ? 'unpublish-btn' : 'publish-toggle-btn'"
        :disabled="uploading"
      >
        {{ localForm.is_published ? 'Unpublish Article' : 'Publish Article' }}
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import type { ArticleFormFields } from '../composables/useArticleForm'
import RichTextEditor from './RichTextEditor.vue';

const props = defineProps<{
  form: ArticleFormFields & { is_published?: boolean } // Ensure your type has this property
  districts: string[]
  categories: string[]
  uploading: boolean
  requireImage: boolean
  mode: 'create' | 'edit'
}>()

const emit = defineEmits<{
  'update:form': [value: ArticleFormFields]
  'submit': []
  'toggle-publish': [] // Updated event name
  'file-change': [event: Event]
  'error': [message: string]
}>()

// Dynamic button text based on mode and status
const submitButtonText = computed(() => {
  if (props.uploading) return 'Saving changes...'
  return props.mode === 'edit' ? 'Update Article' : 'Publish to Cyprus Guide'
})

const localForm = computed({
  get: () => props.form,
  set: (val) => emit('update:form', val),
})

watch(
  () => localForm.value.title,
  (newTitle) => {
    // Only auto-generate slug if we are in 'create' mode
    if (newTitle && props.mode === 'create') {
      emit('update:form', {
        ...props.form,
        slug: newTitle
          .toLowerCase()
          .trim()
          .replace(/[^\w\s-]/g, '')
          .replace(/[\s_-]+/g, '-')
          .replace(/^-+|-+$/g, ''),
      })
    }
  }
)
</script>

<style scoped>
/* Previous styles remain unchanged */
.article-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

label {
  font-weight: 700;
  font-size: 0.8rem;
  text-transform: uppercase;
  color: #2c3e50;
  letter-spacing: 0.03em;
}

.required-star {
  color: #c62828;
  margin-left: 2px;
}

input,
select,
textarea {
  padding: 0.9rem;
  width: 100%;
  border: 2px solid #edf2f7;
  border-radius: 8px;
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  transition: all 0.2s ease-in-out;
  box-sizing: border-box;
}

input:focus,
select:focus,
textarea:focus {
  outline: none;
  border-color: #b57b52;
  background: #fff;
}

.hint {
  font-size: 0.75rem;
  color: #718096;
}

.submit-btn {
  background: #b57b52;
  color: white;
  border: none;
  padding: 1.2rem;
  border-radius: 8px;
  font-weight: 800;
  font-size: 1.1rem;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(181, 123, 82, 0.2);
  transition: transform 0.1s, background 0.2s;
}

.submit-btn:hover:not(:disabled) {
  background: #a06a45;
  transform: translateY(-1px);
}

.submit-btn:disabled {
  background: #cbd5e0;
  cursor: not-allowed;
}

.actions {
  display: flex;
  gap: 1rem;
}

.unpublish-btn {
  background: transparent;
  color: #c62828;
  border: 2px solid #c62828;
  padding: 1.2rem;
  border-radius: 8px;
  font-weight: 800;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background 0.2s;
}

.unpublish-btn:hover:not(:disabled) {
  background: #fff5f5;
}

.unpublish-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Added style for the Publish state of the toggle button */
.publish-toggle-btn {
  background: transparent;
  color: #2e7d32;
  border: 2px solid #2e7d32;
  padding: 1.2rem;
  border-radius: 8px;
  font-weight: 800;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background 0.2s;
}

.publish-toggle-btn:hover:not(:disabled) {
  background: #e8f5e9;
}

.publish-toggle-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media (max-width: 600px) {
  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>