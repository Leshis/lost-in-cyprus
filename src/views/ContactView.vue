<template>
  <div class="contact-page">
    <div class="contact-card">
      <h1>Get in Touch</h1>
      <p class="subtitle">Have a secret spot to share? Or just want to say hello?</p>

      <form class="contact-form" @submit.prevent="handleSubmit">
        <div class="field">
          <label>Name</label>
          <input v-model="form.name" type="text" placeholder="Your name" required />
        </div>
        <div class="field">
          <label>Email</label>
          <input v-model="form.email" type="email" placeholder="your@email.com" required />
        </div>
        <div class="field">
          <label>Message</label>
          <textarea v-model="form.message" placeholder="Tell me something..." rows="5" required />
        </div>

        <button type="submit" :disabled="loading">
          {{ loading ? 'Sending...' : 'Send Message' }}
        </button>

        <p v-if="success" class="feedback success">Message sent! I'll get back to you soon.</p>
        <p v-if="error" class="feedback error">Something went wrong. Please try again.</p>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { supabase } from '@/supabase';

const form = ref({ name: '', email: '', message: '' });
const loading = ref(false);
const success = ref(false);
const error = ref(false);

const handleSubmit = async () => {
  loading.value = true;
  success.value = false;
  error.value = false;

  const { error: sbError } = await supabase
    .from('contact_messages')
    .insert([{ ...form.value }]);

  loading.value = false;

  if (sbError) {
    error.value = true;
  } else {
    success.value = true;
    form.value = { name: '', email: '', message: '' };
  }
};
</script>

<style scoped>
.contact-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1.5rem;
}

.contact-card {
  width: 100%;
  max-width: 520px;
}

h1 {
  font-size: 1.75rem;
  font-weight: 800;
  color: #1c2a32;
  margin-bottom: 0.5rem;
}

.subtitle {
  color: #6b7280;
  margin-bottom: 2rem;
}

.contact-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

label {
  font-size: 0.85rem;
  font-weight: 600;
  color: #374151;
}

input, textarea {
  padding: 12px 14px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  font-size: 0.95rem;
  outline: none;
  transition: border-color 0.2s;
  font-family: inherit;
}

input:focus, textarea:focus {
  border-color: #b57b52;
}

button {
  background: #b57b52;
  color: white;
  border: none;
  padding: 14px;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: opacity 0.2s;
}

button:disabled { opacity: 0.6; cursor: not-allowed; }

.feedback { text-align: center; font-size: 0.9rem; }
.success { color: #16a34a; }
.error { color: #dc2626; }
</style>