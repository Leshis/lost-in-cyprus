<template>
  <div class="privacy-page">

    <!-- ─── Header ────────────────────────────────────────────────────────── -->
    <header class="privacy-header">
      <div class="header-inner">
        <span class="header-eyebrow">Legal</span>
        <h1 class="header-title">Privacy Policy</h1>
        <p class="header-meta">Last updated: <time>{{ lastUpdated }}</time></p>
      </div>
      <div class="header-decoration" aria-hidden="true">
        <span>🔒</span>
      </div>
    </header>

    <!-- ─── Content ───────────────────────────────────────────────────────── -->
    <div class="privacy-body">
      <aside class="toc">
        <p class="toc-label">Contents</p>
        <nav>
          <a v-for="section in sections" :key="section.id" :href="`#${section.id}`" class="toc-link">
            {{ section.title }}
          </a>
        </nav>
      </aside>

      <article class="privacy-content">

        <section class="intro-block">
          <p>
            This website ("Cyprus Secrets", "we", "us") is a content site about discovering
            hidden places and experiences in Cyprus. We do not run advertising, we do not
            sell data, and we do not create profiles of visitors. This policy explains what
            limited data is handled when you use the site and by which third-party services.
          </p>
        </section>

        <section :id="sections[0].id" class="policy-section">
          <h2>{{ sections[0].title }}</h2>
          <p>
            We do not directly collect, store, or process any personal data about visitors.
            We have no user accounts, no login system, no analytics platform, and no
            advertising network. The only personal information that may be transmitted is
            what you voluntarily submit via the contact form (your email address and message),
            which is handled entirely by EmailJS and never stored on our servers.
          </p>
        </section>

        <section :id="sections[1].id" class="policy-section">
          <h2>{{ sections[1].title }}</h2>
          <p>
            We use the following third-party services, each with their own privacy policies:
          </p>

          <div class="service-cards">
            <div class="service-card">
              <div class="service-card-header">
                <span class="service-icon">🗄️</span>
                <div>
                  <strong>Supabase</strong>
                  <span class="service-role">Content database &amp; image storage</span>
                </div>
              </div>
              <p>
                We use Supabase to host our own articles and images. We do not store any
                visitor data there. Supabase may log standard server access information
                (IP addresses, request timestamps) as part of normal database operations.
              </p>
              <a href="https://supabase.com/privacy" target="_blank" rel="noopener" class="service-link">
                Supabase Privacy Policy ↗
              </a>
            </div>

            <div class="service-card">
              <div class="service-card-header">
                <span class="service-icon">✉️</span>
                <div>
                  <strong>EmailJS</strong>
                  <span class="service-role">Contact form delivery</span>
                </div>
              </div>
              <p>
                When you submit our contact form, your email address and message are
                transmitted through EmailJS to deliver your enquiry to us. EmailJS acts
                as a data processor for this purpose. We do not retain copies of submitted
                messages beyond normal email.
              </p>
              <a href="https://www.emailjs.com/legal/privacy-policy/" target="_blank" rel="noopener" class="service-link">
                EmailJS Privacy Policy ↗
              </a>
            </div>

            <div class="service-card">
              <div class="service-card-header">
                <span class="service-icon">🛡️</span>
                <div>
                  <strong>Cloudflare Turnstile</strong>
                  <span class="service-role">Bot protection (contact form)</span>
                </div>
              </div>
              <p>
                Our contact form is protected by Cloudflare Turnstile, a privacy-friendly
                CAPTCHA alternative. Turnstile may process your IP address and browser
                characteristics to distinguish humans from bots. Unlike traditional CAPTCHAs,
                Turnstile is designed to avoid unnecessary data collection.
              </p>
              <a href="https://www.cloudflare.com/privacypolicy/" target="_blank" rel="noopener" class="service-link">
                Cloudflare Privacy Policy ↗
              </a>
            </div>

            <div class="service-card">
              <div class="service-card-header">
                <span class="service-icon">☁️</span>
                <div>
                  <strong>Netlify</strong>
                  <span class="service-role">Website hosting</span>
                </div>
              </div>
              <p>
                This site is hosted on Netlify. As with any web host, Netlify receives
                and may log standard access data including IP addresses and browser user
                agents when your browser requests pages from their servers.
              </p>
              <a href="https://www.netlify.com/privacy/" target="_blank" rel="noopener" class="service-link">
                Netlify Privacy Policy ↗
              </a>
            </div>
          </div>
        </section>

        <section :id="sections[2].id" class="policy-section">
          <h2>{{ sections[2].title }}</h2>
          <p>
            We do not use cookies. We do not use local storage or session storage to track
            visitors. The only browser storage used is strictly functional — for example,
            remembering a map district selection during your current visit. No tracking
            cookies, no advertising pixels, and no fingerprinting scripts are present on
            this site.
          </p>
        </section>

        <section :id="sections[3].id" class="policy-section">
          <h2>{{ sections[3].title }}</h2>
          <p>
            Some articles may contain affiliate links — primarily for booking experiences
            or accommodation in Cyprus. If you click such a link and make a purchase, we
            may earn a small commission at no extra cost to you. These links are clearly
            marked with a "Book Now" label. We do not share any personal data with affiliate
            partners; they only know that a referral came from our site.
          </p>
        </section>

        <section :id="sections[4].id" class="policy-section">
          <h2>{{ sections[4].title }}</h2>
          <p>
            We do not sell, rent, trade, or share personal data with any third parties for
            marketing or commercial purposes. Data transmitted through third-party services
            listed above is governed by their respective privacy policies.
          </p>
        </section>

        <section :id="sections[5].id" class="policy-section">
          <h2>{{ sections[5].title }}</h2>
          <p>
            Because we do not collect or store personal data ourselves, there is generally
            nothing for us to delete or provide. If you have submitted a contact form and
            wish to have your email address removed from our inbox, please contact us and
            we will do so promptly. For data held by third-party services (Supabase, EmailJS,
            Cloudflare, Netlify), please refer to their individual privacy policies linked
            above.
          </p>
        </section>

        <section :id="sections[6].id" class="policy-section">
          <h2>{{ sections[6].title }}</h2>
          <p>
            We may update this policy if we introduce new features or services that affect
            how data is handled. The date at the top of this page will always reflect the
            most recent revision. Continued use of the site after an update constitutes
            acceptance of the revised policy.
          </p>
        </section>

        <section :id="sections[7].id" class="policy-section">
          <h2>{{ sections[7].title }}</h2>
          <p>
            If you have any questions about this privacy policy, please use the contact
            form on our website. We'll respond as quickly as we can.
          </p>
        </section>

      </article>
    </div>

  </div>
</template>

<script setup lang="ts">
const lastUpdated = new Date().toLocaleDateString('en-GB', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})

const sections = [
  { id: 'what-we-collect',    title: '1. What We Collect' },
  { id: 'third-party',        title: '2. Third-Party Services' },
  { id: 'cookies',            title: '3. Cookies & Tracking' },
  { id: 'affiliate',          title: '4. Affiliate Links' },
  { id: 'data-sharing',       title: '5. Data Sharing' },
  { id: 'your-rights',        title: '6. Your Rights' },
  { id: 'policy-changes',     title: '7. Policy Changes' },
  { id: 'contact',            title: '8. Contact' },
]
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@300;400;500&display=swap');

.privacy-page {
  font-family: 'DM Sans', sans-serif;
  background-color: #f8f6f0;
  color: #1c2a32;
  min-height: 100svh;
}

/* ─── Header ────────────────────────────────────────────────────────────── */
.privacy-header {
  background-color: #1c2a32;
  padding: 64px 24px 56px;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
}

.privacy-header::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse at 80% 50%, rgba(198, 159, 75, 0.12) 0%, transparent 60%),
    radial-gradient(ellipse at 20% 80%, rgba(198, 159, 75, 0.06) 0%, transparent 50%);
}

.header-inner {
  position: relative;
  z-index: 1;
}

.header-eyebrow {
  display: block;
  font-size: 0.7rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #c69f4b;
  margin-bottom: 12px;
}

.header-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 600;
  color: #ffffff;
  margin: 0 0 16px;
  line-height: 1;
}

.header-meta {
  font-size: 0.8rem;
  color: rgba(255,255,255,0.45);
  margin: 0;
}

.header-decoration {
  font-size: 5rem;
  opacity: 0.08;
  position: relative;
  z-index: 1;
  line-height: 1;
  align-self: center;
}

/* ─── Body layout ───────────────────────────────────────────────────────── */
.privacy-body {
  max-width: 1100px;
  margin: 0 auto;
  padding: 48px 24px 80px;
  display: grid;
  grid-template-columns: 1fr;
  gap: 48px;
}

/* ─── Table of contents ─────────────────────────────────────────────────── */
.toc {
  background: #ffffff;
  border: 1px solid #e4dfd5;
  border-left: 3px solid #c69f4b;
  border-radius: 10px;
  padding: 24px 28px;
  align-self: start;
}

.toc-label {
  font-size: 0.65rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #6b7b84;
  margin: 0 0 16px;
  font-weight: 500;
}

.toc nav {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.toc-link {
  font-size: 0.875rem;
  color: #6b7b84;
  text-decoration: none;
  padding: 6px 0;
  border-bottom: 1px solid #e4dfd5;
  transition: color 0.2s;
}

.toc-link:last-child { border-bottom: none; }
.toc-link:hover { color: #c69f4b; }

/* ─── Content ───────────────────────────────────────────────────────────── */
.privacy-content {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.intro-block {
  background: #1c2a32;
  color: rgba(255,255,255,0.85);
  border-radius: 12px;
  padding: 28px 32px;
  font-size: 1rem;
  line-height: 1.7;
}

.intro-block p { margin: 0; }

.policy-section {
  padding-bottom: 40px;
  border-bottom: 1px solid #e4dfd5;
}

.policy-section:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.policy-section h2 {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.6rem;
  font-weight: 600;
  color: #1c2a32;
  margin: 0 0 16px;
  scroll-margin-top: 24px;
}

.policy-section p {
  font-size: 0.95rem;
  line-height: 1.8;
  color: #3d4f58;
  margin: 0 0 16px;
}

.policy-section p:last-child { margin-bottom: 0; }

/* ─── Service cards ─────────────────────────────────────────────────────── */
.service-cards {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  margin-top: 20px;
}

.service-card {
  background: #ffffff;
  border: 1px solid #e4dfd5;
  border-radius: 10px;
  padding: 20px 24px;
  transition: box-shadow 0.2s, border-color 0.2s;
}

.service-card:hover {
  border-color: #c69f4b;
  box-shadow: 0 4px 16px rgba(198, 159, 75, 0.1);
}

.service-card-header {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 12px;
}

.service-icon { font-size: 1.5rem; flex-shrink: 0; }

.service-card-header strong {
  display: block;
  font-size: 1rem;
  color: #1c2a32;
  font-weight: 500;
}

.service-role {
  display: block;
  font-size: 0.75rem;
  color: #6b7b84;
  margin-top: 1px;
}

.service-card p {
  font-size: 0.875rem;
  line-height: 1.7;
  color: #3d4f58;
  margin: 0 0 12px;
}

.service-link {
  font-size: 0.8rem;
  color: #c69f4b;
  text-decoration: none;
  font-weight: 500;
  letter-spacing: 0.01em;
  transition: opacity 0.2s;
}

.service-link:hover { opacity: 0.7; }

/* ─── Desktop ───────────────────────────────────────────────────────────── */
@media (min-width: 900px) {
  .privacy-header {
    padding: 80px 60px 64px;
  }

  .privacy-body {
    grid-template-columns: 220px 1fr;
    gap: 60px;
    padding: 60px 60px 100px;
    align-items: start;
  }

  .toc {
    position: sticky;
    top: 80px;
  }

  .service-cards {
    grid-template-columns: 1fr 1fr;
  }
}
</style>