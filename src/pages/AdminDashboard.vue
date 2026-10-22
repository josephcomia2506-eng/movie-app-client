<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '../api';

const router = useRouter();

const movies = ref([]);
const loading = ref(false);
const error = ref('');
const message = ref('');

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
      'Unable to load the movie catalog.';
  } finally {
    loading.value = false;
  }
}

async function editMovie(movie) {
  const title = prompt('Movie title:', movie.title);
  if (title === null) return;

  const director = prompt('Director:', movie.director);
  if (director === null) return;

  const yearInput = prompt('Release year:', movie.year);
  if (yearInput === null) return;

  const year = Number(yearInput);

  if (!title.trim() || !director.trim() || !Number.isInteger(year)) {
    error.value = 'Enter a valid title, director, and release year.';
    return;
  }

  try {
    await api.patch(`/movies/updateMovie/${movie._id}`, {
      title: title.trim(),
      director: director.trim(),
      year,
      description: movie.description || '',
      genre: movie.genre || ''
    });

    message.value = 'Movie updated successfully.';
    await loadMovies();
  } catch (err) {
    error.value =
      err.response?.data?.message ||
      'Unable to update movie.';
  }
}

async function deleteMovie(movie) {
  if (!confirm(`Delete "${movie.title}"?`)) return;

  try {
    await api.delete(`/movies/deleteMovie/${movie._id}`);
    message.value = 'Movie deleted successfully.';
    await loadMovies();
  } catch (err) {
    error.value =
      err.response?.data?.message ||
      'Unable to delete movie.';
  }
}

onMounted(loadMovies);
</script>

<template>
  <section>
    <div class="page-heading">
      <div>
        <h1>Admin Dashboard</h1>
        <p>Manage the MovieHub catalog.</p>
      </div>

      <button
        class="btn btn-primary"
        @click="router.push('/addMovie')"
      >
        + Add Movie
      </button>
    </div>

    <p v-if="error" class="error">{{ error }}</p>
    <p v-if="message" class="success">{{ message }}</p>
    <p v-if="loading">Loading movies...</p>

    <div class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Director</th>
            <th>Year</th>
            <th>Genre</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="movie in movies" :key="movie._id">
            <td>{{ movie.title }}</td>
            <td>{{ movie.director }}</td>
            <td>{{ movie.year }}</td>
            <td>{{ movie.genre }}</td>
            <td>
              <div class="table-actions">
                <button
                  class="btn btn-light"
                  @click="editMovie(movie)"
                >
                  Edit
                </button>

                <button
                  class="btn btn-danger"
                  @click="deleteMovie(movie)"
                >
                  Delete
                </button>
              </div>
            </td>
          </tr>

          <tr v-if="!loading && movies.length === 0">
            <td colspan="5">No movies found.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>