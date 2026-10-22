<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '../api';
import { useUserStore } from '../stores/user';

const router = useRouter();
const user = useUserStore();

const movies = ref([]);
const loading = ref(false);
const error = ref('');
const search = ref('');

async function loadMovies() {
  loading.value = true;
  error.value = '';

  try {
    const response = await api.get('/movies/getMovies');
    const data = response.data;

    movies.value = Array.isArray(data)
      ? data
      : data.movies || data.data || [];
  } catch (err) {
    error.value =
      err.response?.data?.message ||
      'Unable to load movies. Please try again.';
  } finally {
    loading.value = false;
  }
}

function viewMovie(movie) {
  if (!user.isLoggedIn) {
    router.push('/login');
    return;
  }

  router.push(`/movies/${movie._id}`);
}

onMounted(loadMovies);
</script>

<template>
  <section>
    <div class="page-heading">
      <div>
        <h1>Explore Movies</h1>
        <p>Discover stories worth watching.</p>
      </div>

      <button
        v-if="user.isAdmin"
        class="btn btn-primary"
        @click="router.push('/addMovie')"
      >
        + Add Movie
      </button>
    </div>

    <input
      v-model="search"
      class="search-input"
      placeholder="Search by title, director, or genre..."
    />

    <p v-if="loading">Loading movies...</p>
    <p v-if="error" class="error">{{ error }}</p>

    <div v-if="!loading && !error && movies.length === 0" class="empty-state">
      No movies available yet.
    </div>

    <div class="movie-grid">
      <article
        v-for="movie in movies.filter((item) =>
          [item.title, item.director, item.genre]
            .some((value) =>
              String(value || '').toLowerCase()
                .includes(search.toLowerCase())
            )
        )"
        :key="movie._id"
        class="movie-card"
      >
        <div class="movie-poster">🎬</div>

        <div class="movie-content">
          <span class="genre-tag">{{ movie.genre || 'Uncategorized' }}</span>
          <h2>{{ movie.title }}</h2>
          <p class="muted">Directed by {{ movie.director }}</p>
          <p>{{ movie.description }}</p>
          <p><strong>Year:</strong> {{ movie.year }}</p>

          <button
            class="btn btn-primary full-width"
            @click="viewMovie(movie)"
          >
            View Movie
          </button>
        </div>
      </article>
    </div>
  </section>
</template>