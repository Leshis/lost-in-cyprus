<template>
  <div class="login-container">
    <div class="login-card">
      <h2 class="brand-title">Lost In Cyprus</h2>
      <p class="subtitle">Secure Entry Gateway</p>

      <form @submit.prevent="handleLogin" class="login-form">
        <div class="input-group">
          <label for="email">Email</label>
          <input 
            type="email" 
            id="email" 
            v-model="email" 
            placeholder="curator@lostincyprus.com" 
            required 
          />
        </div>

        <div class="input-group">
          <label for="password">Password</label>
          <input 
            type="password" 
            id="password" 
            v-model="password" 
            placeholder="••••••••" 
            required 
          />
        </div>

        <button type="submit" :disabled="loading" class="login-btn">
          {{ loading ? 'Verifying...' : 'Access Vault' }}
        </button>

        <p v-if="errorMsg" class="error-text">{{ errorMsg }}</p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { supabase } from '../supabase'; // Adjust path to your supabase.js
import { useRouter } from 'vue-router';

const router = useRouter();
const email = ref('');
const password = ref('');
const loading = ref(false);
const errorMsg = ref('');

const handleLogin = async () => {
  try {
    loading.ref = true;
    errorMsg.value = '';
    
    const { error } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    });

    if (error) throw error;

    // Success! Send them to the obscure admin route
    router.push('/gate');
  } catch (error) {
    errorMsg.value = error.message;
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  background-color: #fdfcf8; /* Your Off-white */
}

.login-card {
  background: white;
  padding: 2.5rem;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(28, 42, 50, 0.05);
  width: 100%;
  max-width: 400px;
  text-align: center;
  border: 1px solid #eee;
}

.brand-title {
  color: #b57b52; /* Your Gold/Tan */
  font-family: 'Serif', Georgia, serif;
  margin-bottom: 0.5rem;
}

.subtitle {
  color: #1c2a32; /* Your Slate */
  font-size: 0.9rem;
  opacity: 0.7;
  margin-bottom: 2rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  text-align: left;
}

.input-group label {
  display: block;
  font-size: 0.85rem;
  color: #1c2a32;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.input-group input {
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  background-color: #fafafa;
  transition: border-color 0.3s;
}

.input-group input:focus {
  outline: none;
  border-color: #b57b52;
}

.login-btn {
  background-color: #1c2a32;
  color: white;
  padding: 1rem;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s;
}

.login-btn:hover {
  background-color: #b57b52;
}

.login-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.error-text {
  color: #d9534f;
  font-size: 0.85rem;
  margin-top: 1rem;
  text-align: center;
}
</style>