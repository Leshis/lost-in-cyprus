<template>
  <div id="app-container">
    <nav class="navbar">
      <router-link to="/" class="nav-logo">🇨🇾 Cyprus Guide</router-link>
      <div class="nav-links">
        <router-link to="/">Home</router-link>
        <router-link to="/about">About Me</router-link>
      </div>
    </nav>

    <router-view />

    <footer>
      <p>&copy; 2026 Cyprus Travel Guide</p>
    </footer>
  </div>
</template>

<style>
/* Global styles for the whole site */
body {
  margin: 0;
  padding: 0;
}

#app-container {
  font-family: 'Segoe UI', sans-serif;
  color: #333;
  margin: 0;
  padding: 0;
}
.navbar {
  display: flex;
  justify-content: space-between;
  padding: 20px 50px;
  background: white;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}
.nav-logo {
  font-weight: bold;
  font-size: 1.5rem;
  text-decoration: none;
  color: #0088ff;
}
.nav-links a {
  margin-left: 20px;
  text-decoration: none;
  color: #666;
}
.nav-links a.router-link-active {
  color: #0088ff;
  font-weight: bold;
}
footer {
  text-align: center;
  padding: 40px;
  background: #f9f9f9;
  margin-top: 50px;
}
</style>