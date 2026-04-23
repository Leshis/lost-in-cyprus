<template>
  <form @submit.prevent="$emit('submit')" class="article-form">
    <div class="field">
      <label for="article-title">Article Title</label>
      <input 
        id="article-title"
        v-model="form.title" 
        type="text" 
        placeholder="e.g. Hidden Gems of the Akamas Peninsula"
        required 
      />
    </div>

    <div class="field">
      <label for="article-slug">URL Slug</label>
      <input 
        id="article-slug"
        v-model="form.slug" 
        type="text" 
        placeholder="hidden-gems-akamas-peninsula"
        required 
      />
      <span class="hint">The unique URL path (e.g., cyprusguide.com/articles/slug-name)</span>
    </div>

    <div class="form-row">
      <div class="field">
        <label for="article-lat">Latitude</label>
        <input 
          id="article-lat"
          v-model.number="form.lat" 
          type="number" 
          step="any" 
          placeholder="34.9823 (e.g. Paphos)" 
          required 
        />
      </div>
      <div class="field">
        <label for="article-long">Longitude</label>
        <input 
          id="article-long"
          v-model.number="form.long" 
          type="number" 
          step="any" 
          placeholder="32.3382" 
          required 
        />
      </div>
    </div>

    <div class="form-row">
      <div class="field">
        <label for="article-district">Cyprus District</label>
        <select id="article-district" v-model="form.district" required>
          <option value="" disabled>Select a district</option>
          <option v-for="dist in districts" :key="dist" :value="dist">
            {{ dist }}
          </option>
        </select>
      </div>

      <div class="field">
        <label for="article-category">Travel Category</label>
        <select id="article-category" v-model="form.category" required>
          <option value="" disabled>Select a category</option>
          <option v-for="cat in categories" :key="cat" :value="cat">
            {{ cat }}
          </option>
        </select>
      </div>
    </div>

    <div class="field">
      <label for="article-content">Article Content</label>
      <textarea 
        id="article-content" 
        v-model="form.content" 
        rows="10" 
        placeholder="Describe the atmosphere, the food, or how to get there..."
        required
      ></textarea>
    </div>

    <div class="field">
      <label for="article-image">Featured Image (Beaches, Tavernas, etc.)</label>
      <input 
        id="article-image" 
        type="file" 
        accept="image/*" 
        @change="$emit('file-change', $event)" 
      />
    </div>

    <button type="submit" :disabled="uploading" class="submit-btn">
      {{ uploading ? 'Uploading to Guide...' : 'Publish to Cyprus Guide' }}
    </button>
  </form>
</template>

<script setup lang="ts">
import { watch } from 'vue';

// Define the interface to match your Supabase Article schema
interface ArticleForm {
  title: string;
  slug: string;
  district: string;
  content: string;
  category: string;
  lat: number | null;
  long: number | null;
}

const props = defineProps<{
  form: ArticleForm;
  districts: string[]; // e.g. ['Nicosia', 'Limassol', 'Larnaca', 'Paphos', 'Famagusta', 'Kyrenia']
  categories: string[]; // e.g. ['Beaches', 'History', 'Dining', 'Nature']
  uploading: boolean;
}>();

const emit = defineEmits<{
  (e: 'submit'): void;
  (e: 'file-change', event: Event): void;
}>();

// Slug Watcher: Converts "Nissi Beach Party" to "nissi-beach-party"
watch(() => props.form.title, (newTitle) => {
  if (newTitle) {
    props.form.slug = newTitle
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') 
      .replace(/[\s_-]+/g, '-') 
      .replace(/^-+|-+$/g, ''); 
  }
});
</script>

<style scoped>
.article-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.05);
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
  color: #2c3e50; /* Deep blue/grey for a professional look */
  letter-spacing: 0.03em;
}

input, select, textarea {
  padding: 0.9rem;
  border: 2px solid #edf2f7;
  border-radius: 8px;
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  transition: all 0.2s ease-in-out;
}

input:focus, select:focus, textarea:focus {
  outline: none;
  border-color: #b57b52; /* Your primary brand color */
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

@media (max-width: 600px) {
  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>