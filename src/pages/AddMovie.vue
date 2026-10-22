<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '../api';

const router = useRouter();

const form = reactive({
  title: '',
  director: '',
  year: new Date().getFullYear(),
  description: '',
  genre: ''
});

const error = ref('');
const loading = ref(false);

async function addMovie() {
  error.value = '';
  loading.value = true;

  try {
    await api.post('/movies/addMovie', {
      title: form.title.trim(),
      director: form.director.trim(),
      year: Number(form.year),
      description: form.description.trim(),
      genre: form.genre.trim()
    });

    router.push('/admin');
  } catch (err) {
    error.value =
      err.response?.data?.message ||
      'Unable to add movie. Confirm that you are logged in as an admin.';
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <section class="form-card">
    <h1>Add New Movie</h1>
    <p>Enter the movie information below.</p>

    <form @submit.prevent="addMovie">
      <label>Movie Title</label>
      <input v-model.trim="form.title" required />

      <label>Director</label>
      <input v-model.trim="form.director" required />

      <label>Release Year</label>
      <input
        v-model.number="form.year"
        type="number"
        min="1888"
        max="2100"
        required
      />

      <label>Genre</label>
      <input v-model.trim="form.genre" required placeholder="e.g. Action" />

      <label>Description</label>
      <textarea
        v-model.trim="form.description"
        rows="4"
        required
      ></textarea>

      <button class="btn btn-primary" :disabled="loading">
        {{ loading ? 'Saving...' : 'Create Movie' }}
      </button>

      <button
        type="button"
        class="btn btn-light"
        @click="router.push('/admin')"
      >
        Cancel
      </button>
    </form>

    <p v-if="error" class="error">{{ error }}</p>
  </section>
</template>