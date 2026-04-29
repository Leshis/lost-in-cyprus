<template>
  <footer class="site-footer">
    <div class="footer-content">
      <div class="footer-brand">
        <h2 class="logo-text">Lost in <span>Cyprus</span></h2>
        <p class="tagline">Uncovering the island's best-kept secrets, one spot at a time.</p>
      </div>

      <div class="footer-socials">
        <a href="https://instagram.com/lostincyprus" target="_blank" class="social-link" aria-label="Instagram">
          <i class="social-icon insta"></i>
          <span>Instagram</span>
        </a>
        <a href="https://tiktok.com/@lostincyprus" target="_blank" class="social-link" aria-label="TikTok">
          <i class="social-icon tiktok"></i>
          <span>TikTok</span>
        </a>
      </div>

      <nav class="footer-nav">
        <div class="nav-group">
          <h4>Platform</h4>
          <router-link to="/about">About the Project</router-link>
          <router-link to="/contact">Get in Touch</router-link>
          <router-link to="/map">Discovery Map</router-link>
        </div>
        <div class="nav-group">
          <h4>Legal</h4>
          <router-link to="/privacy">Privacy Policy</router-link>
          <router-link to="/terms">Terms of Service</router-link>
        </div>
      </nav>

      <div class="footer-newsletter">
        <h4>Don't miss a secret</h4>
        <div class="input-group">
          <input type="email" placeholder="Your email..." />
          <button type="button">Join</button>
        </div>
      </div>

      <div class="footer-bottom">
        <p>&copy; {{ currentYear }} Lost in Cyprus.</p>
        <p class="tech-stack">Built with Vue & Vite ⚡️</p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const currentYear = computed(() => new Date().getFullYear());
</script>

<style scoped>
.site-footer {
  background: #1a202c; /* Deep charcoal for high contrast */
  color: #edf2f7;
  padding: 3rem 1.5rem 1.5rem;
  font-family: 'Inter', sans-serif;
}

.footer-content {
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
}

.logo-text { font-size: 1.5rem; font-weight: 900; letter-spacing: -0.02em; }
.logo-text span { color: #b57b52; }
.tagline { color: #a0aec0; font-size: 0.9rem; margin-top: 0.5rem; max-width: 300px; }

/* Socials: Mobile First */
.footer-socials {
  display: flex;
  gap: 1rem;
}

.social-link {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: #2d3748;
  padding: 0.75rem;
  border-radius: 12px;
  text-decoration: none;
  color: white;
  font-weight: 700;
  font-size: 0.9rem;
  transition: transform 0.2s;
}

.social-link:active { transform: scale(0.95); }

/* Navigation */
.footer-nav {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.nav-group h4 {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #718096;
  margin-bottom: 1rem;
}

.nav-group a {
  display: block;
  color: #cbd5e0;
  text-decoration: none;
  font-size: 0.95rem;
  margin-bottom: 0.75rem;
}

/* Newsletter */
.footer-newsletter h4 { font-size: 0.9rem; margin-bottom: 0.75rem; }
.input-group { display: flex; gap: 8px; }
.input-group input {
  flex: 1;
  background: #2d3748;
  border: none;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  color: white;
}
.input-group button {
  background: #b57b52;
  border: none;
  color: white;
  padding: 0 1.25rem;
  border-radius: 8px;
  font-weight: 700;
}

/* Bottom Bar */
.footer-bottom {
  border-top: 1px solid #2d3748;
  padding-top: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.75rem;
  color: #718096;
}

.tech-stack { font-style: italic; }

/* Tablet/Desktop Tweaks */
@media (min-width: 600px) {
  .footer-content { flex-direction: row; flex-wrap: wrap; justify-content: space-between; }
  .footer-brand, .footer-newsletter { flex: 1 1 100%; }
  .footer-socials, .footer-nav { flex: 1; }
}
</style>
