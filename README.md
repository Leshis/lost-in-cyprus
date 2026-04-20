# 🇨🇾 Lost in Cyprus
**A curated geographical discovery engine for hidden gems across the island.**

Built with passion and refined through a "mobile-first" development journey, *Lost in Cyprus* bridges the gap between high-end cartography and dynamic content delivery.

---

## 🚀 The Vision
Lost in Cyprus is designed for the modern explorer. It features an interactive SVG-based map of the island, allowing users to filter secret locations, hiking trails, and historical landmarks by district with a single tap.

### Key Features
* **Interactive Cartography:** Custom-built SVG map of Cyprus with reactive district filtering.
* **Live Cloud Database:** Real-time content delivery powered by **Supabase**.
* **State-Driven UI:** Seamless synchronization between the map and article views using **Pinia**.
* **Blazing Fast:** Optimized for instant response times on both mobile and desktop browsers.

---

## 🛠️ Tech Stack
* **Frontend:** [Vue.js 3](https://vuejs.org/) (Composition API)
* **Build Tool:** [Vite](https://vitejs.dev/)
* **State Management:** [Pinia](https://pinia.vuejs.org/)
* **Backend-as-a-Service:** [Supabase](https://supabase.com/) (PostgreSQL)
* **Styling:** Scoped CSS with Mobile-First Media Queries

---

## 🏗️ Project Structure
```text
src/
├── assets/          # Global styles and static assets
├── components/      # UI Components (CyprusMap.vue, etc.)
├── stores/          # Pinia Stores (articleStore.js, mapStore.js)
├── supabase/        # Supabase client configuration
├── views/           # Page views (HomeView.vue, ArticleView.vue)
└── App.vue          # Root component

📱 Development Note
This project holds a unique "Badge of Honor": the core infrastructure, Supabase integration, and complex SVG logic were primarily developed and debugged in a mobile environment. This constraint birthed a focus on clean, efficient code and true responsiveness.

🗺️ Future Roadmap
[ ] User Auth: Allow users to "Save" their favorite hidden gems.

[ ] Admin Dashboard: A dedicated interface for contributors to add locations.

[ ] Advanced Mapping: Integration of GPS coordinates for direct navigation.

✍️ Author
Leshis
Exploring the island, one line of code at a time.