<template>
  <form @submit.prevent="$emit('submit')" class="article-form" novalidate>

    <div class="field">
      <label for="article-title">Article Title</label>
      <input
        id="article-title"
        v-model="localForm.title"
        type="text"
        placeholder="e.g. Hidden Gems of the Akamas Peninsula"
        autocomplete="off"
        required
        aria-required="true"
      />
    </div>

    <div class="field">
      <label for="article-slug">URL Slug</label>
      <input
        id="article-slug"
        v-model="localForm.slug"
        type="text"
        placeholder="hidden-gems-akamas-peninsula"
        pattern="^[a-z0-9]+(?:-[a-z0-9]+)*$"
        required
        aria-required="true"
        aria-describedby="slug-hint"
      />
      <span id="slug-hint" class="hint">
        URL path — e.g. cyprusguide.com/articles/<strong>slug-name</strong>
      </span>
    </div>

    <div class="form-row">
      <div class="field">
        <label for="article-lat">Latitude</label>
        <input
          id="article-lat"
          v-model.number="localForm.lat"
          type="number"
          step="any"
          min="-90"
          max="90"
          placeholder="34.9823"
          required
          aria-required="true"
        />
      </div>
      <div class="field">
        <label for="article-long">Longitude</label>
        <input
          id="article-long"
          v-model.number="localForm.long"
          type="number"
          step="any"
          min="-180"
          max="180"
          placeholder="32.3382"
          required
          aria-required="true"
        />
      </div>
    </div>

    <div class="form-row">
      <div class="field">
        <label for="article-district">Cyprus District</label>
        <select
          id="article-district"
          v-model="localForm.district"
          required
          aria-required="true"
        >
          <option value="" disabled>Select a district</option>
          <option v-for="dist in districts" :key="dist" :value="dist">
            {{ dist }}
          </option>
        </select>
      </div>

      <div class="field">
        <label for="article-category">Travel Category</label>
        <select
          id="article-category"
          v-model="localForm.category"
          required
          aria-required="true"
        >
          <option value="" disabled>Select a category</option>
          <option v-for="cat in categories" :key="cat" :value="cat">
            {{ cat }}
          </option>
        </select>
      </div>
    </div>

    <div class="form-row">
      <div class="field">
        <label for="article-scheduled-from">Go Live Date <span class="optional">(Optional)</span></label>
        <input
          id="article-scheduled-from"
          type="datetime-local"
          v-model="localForm.scheduled_from"
          :max="localForm.scheduled_to || undefined"
        />
        <p class="hint">Leave blank for instant publish</p>
      </div>

      <div class="field">
        <label for="article-scheduled-to">Expiry Date <span class="optional">(Optional)</span></label>
        <input
          id="article-scheduled-to"
          type="datetime-local"
          v-model="localForm.scheduled_to"
          :min="localForm.scheduled_from || undefined"
        />
        <p class="hint">Leave blank to keep up forever</p>
      </div>
    </div>

    <div class="field">
      <label>Article Content</label>
      <RichTextEditor v-model="localForm.content" />
    </div>

    <div class="field">
      <label for="article-image">
        Featured Image
        <span class="optional" v-if="!requireImage">(Optional)</span>
        <span v-if="requireImage" class="required-star" aria-hidden="true">*</span>
      </label>
      <input
        id="article-image"
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        :required="requireImage"
        :aria-required="requireImage"
        @change="$emit('file-change', $event)"
      />
      <p class="hint">Accepted formats: JPEG, PNG, WebP, GIF</p>
    </div>

    <div class="actions">
      <button
        type="button"
        :disabled="uploading"
        class="btn btn--secondary"
        @click="$emit('save-draft')"
      >
        {{ uploading ? 'Saving…' : 'Save Draft' }}
      </button>

      <button
        type="submit"
        :disabled="uploading"
        class="btn btn--primary"
      >
        {{ submitButtonText }}
      </button>

      <button
        v-if="mode === 'edit'"
        type="button"
        class="btn btn--danger"
        :disabled="uploading"
        @click="$emit('unpublish')"
      >
        Unpublish
      </button>
    </div>

  </form>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import type { ArticleFormFields } from '../composables/useArticleForm'
import RichTextEditor from './RichTextEditor.vue'

// ─── Props ────────────────────────────────────────────────────────────────────

const props = defineProps<{
  form: ArticleFormFields
  districts: string[]
  categories: string[]
  uploading: boolean
  requireImage: boolean
  mode: 'create' | 'edit'
}>()

// ─── Emits ────────────────────────────────────────────────────────────────────

const emit = defineEmits<{
  'update:form': [value: ArticleFormFields]
  'submit': []
  'unpublish': []
  'file-change': [event: Event]
  'error': [message: string]
  'save-draft': []
}>()

// ─── Computed ─────────────────────────────────────────────────────────────────

const submitButtonText = computed((): string => {
  if (props.uploading) return props.mode === 'edit' ? 'Updating…' : 'Publishing…'
  return props.mode === 'edit' ? 'Update Article' : 'Publish to Cyprus Guide'
})

const localForm = computed<ArticleFormFields>({
  get: () => props.form,
  set: (val) => emit('update:form', val),
})

// ─── Watchers ─────────────────────────────────────────────────────────────────

watch(
  () => localForm.value.title,
  (newTitle) => {
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
/* ─── Base / Mobile-first ──────────────────────────────────────────────────── */

.article-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

/* ─── Labels ──────────────────────────────────────────────────────────────── */

label {
  font-weight: 700;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #2c3e50;
}

.required-star {
  color: #c62828;
  margin-left: 2px;
}

.optional {
  font-weight: 400;
  text-transform: none;
  letter-spacing: 0;
  color: #718096;
  font-size: 0.75rem;
  margin-left: 4px;
}

/* ─── Inputs ──────────────────────────────────────────────────────────────── */

input:not([type='file']),
select {
  padding: 0.75rem 0.875rem;
  width: 100%;
  border: 2px solid #edf2f7;
  border-radius: 8px;
  font-family: inherit;
  font-size: 1rem;
  color: #1a202c;
  background: #fff;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
  box-sizing: border-box;
  -webkit-appearance: none;
  appearance: none;
}

input:not([type='file']):focus,
select:focus {
  outline: none;
  border-color: #b57b52;
  box-shadow: 0 0 0 3px rgba(181, 123, 82, 0.15);
}

input:not([type='file']):invalid:not(:placeholder-shown),
select:invalid:not(:focus) {
  border-color: #e53e3e;
}

input[type='file'] {
  font-family: inherit;
  font-size: 0.9rem;
  color: #4a5568;
  cursor: pointer;
}

select {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%23718096' d='M1 1l5 5 5-5'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.875rem center;
  padding-right: 2.5rem;
}

.hint {
  font-size: 0.75rem;
  color: #718096;
  margin: 0;
  line-height: 1.4;
}

/* ─── Form row ────────────────────────────────────────────────────────────── */

.form-row {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

@media (min-width: 540px) {
  .form-row {
    flex-direction: row;
    gap: 1.5rem;
  }

  .form-row .field {
    flex: 1;
    min-width: 0;
  }
}

/* ─── Actions ─────────────────────────────────────────────────────────────── */

.actions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding-top: 0.5rem;
}

@media (min-width: 480px) {
  .actions {
    flex-direction: row;
    flex-wrap: wrap;
  }
}

/* ─── Buttons ─────────────────────────────────────────────────────────────── */

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.875rem 1.5rem;
  border-radius: 8px;
  font-family: inherit;
  font-weight: 800;
  font-size: 1rem;
  cursor: pointer;
  border: 2px solid transparent;
  transition: background-color 0.15s ease, transform 0.1s ease, opacity 0.15s ease;
  white-space: nowrap;
  min-height: 48px;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none !important;
}

.btn--primary {
  background: #b57b52;
  color: #fff;
  box-shadow: 0 2px 6px rgba(181, 123, 82, 0.25);
  flex: 1;
}

.btn--primary:hover:not(:disabled) {
  background: #a06a45;
  transform: translateY(-1px);
}

.btn--primary:active:not(:disabled) {
  transform: translateY(0);
}

.btn--secondary {
  background: #fff;
  color: #4a5568;
  border-color: #cbd5e0;
}

.btn--secondary:hover:not(:disabled) {
  background: #f7fafc;
  border-color: #a0aec0;
}

.btn--danger {
  background: transparent;
  color: #c62828;
  border-color: #c62828;
}

.btn--danger:hover:not(:disabled) {
  background: #fff5f5;
}
</style>