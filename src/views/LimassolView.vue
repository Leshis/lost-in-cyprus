<template>
  <div class="content-page">
    <nav class="breadcrumb">
      <router-link to="/">← Back to Home</router-link>
    </nav>
    
    <article class="article-container">
      <header>
        <h1>Limassol Castle</h1>
        <p class="subtitle">A Journey Through Medieval Cyprus</p>
      </header>

      <div class="main-image">
        <img src="https://images.unsplash.com/photo-1625737333502-0e3f169528bc?q=80&w=1000" alt="Limassol Castle" />
      </div>

      <div class="content">
        <p>
          Located near the old harbor in the heart of the historical center of Limassol, 
          the **Limassol Castle** is one of the island's most iconic landmarks.
        </p>
        
        <div class="info-box">
          <h3>Did you know?</h3>
          <p>Local legend says that Richard the Lionheart married Berengaria of Navarre here in 1191!</p>
        </div>

        <p>
          The castle we see today was built around 1590 under Ottoman rule, but it 
          incorporates parts of an earlier Byzantine fortress. Today, it houses the 
          Cyprus Medieval Museum, featuring armor, pottery, and tombstones.
        </p>
      </div>
    </article>
  </div>
</template>

<style scoped>
.content-page {
  max-width: 900px;
  margin: 0 auto;
  padding: 40px 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}
.breadcrumb a {
  text-decoration: none;
  color: #0088ff;
  font-weight: 500;
}
.article-container {
  margin-top: 20px;
}
h1 {
  font-size: 2.5rem;
  margin-bottom: 5px;
  color: #2c3e50;
}
.subtitle {
  color: #666;
  font-size: 1.2rem;
  margin-bottom: 30px;
}
.main-image img {
  width: 100%;
  height: 400px;
  object-fit: cover;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
}
.content {
  margin-top: 30px;
  font-size: 1.1rem;
  line-height: 1.8;
  color: #444;
}
.info-box {
  background: #f0f9ff;
  border-left: 5px solid #0088ff;
  padding: 20px;
  margin: 30px 0;
  border-radius: 0 10px 10px 0;
}
.info-box h3 {
  margin-top: 0;
  color: #0088ff;
}
</style>