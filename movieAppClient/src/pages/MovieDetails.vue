<script setup>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import api from '../api';

const route = useRoute();

const movie = ref(null);
const comments = ref([]);
const comment = ref('');
const loading = ref(false);
const error = ref('');
const message = ref('');

async function loadMovie() {
  loading.value = true;
  error.value = '';

  try {
    const id = route.params.id;
    const response = await api.get(`/movies/getMovie/${id}`);
    const data = response.data;

    movie.value = data.movie || data.data || data;

    const commentResponse = await api.get(`/movies/getComments/${id}`);
    const commentData = commentResponse.data;

    comments.value = Array.isArray(commentData)
      ? commentData
      : commentData.comments || commentData.data || [];
  } catch (err) {
    error.value =
      err.response?.data?.message ||
      'Unable to load movie details or comments.';
  } finally {
    loading.value = false;
  }
}

async function addComment() {
  error.value = '';
  message.value = '';

  if (!comment.value.trim()) {
    error.value = 'Please enter a comment.';
    return;
  }

  try {
    await api.post(`/movies/addComment/${route.params.id}`, {
      comment: comment.value.trim()
    });

    comment.value = '';
    message.value = 'Comment added successfully.';

    const response = await api.get(
      `/movies/getComments/${route.params.id}`
    );

    const data = response.data;
    comments.value = Array.isArray(data)
      ? data
      : data.comments || data.data || [];
  } catch (err) {
    error.value =
      err.response?.data?.message ||
      'Unable to add comment.';
  }
}

onMounted(loadMovie);
</script>

<template>
  <section>
    <p v-if="loading">Loading movie...</p>
    <p v-if="error" class="error">{{ error }}</p>

    <article v-if="movie" class="detail-card">
      <div class="detail-poster">🎥</div>

      <div class="detail-content">
        <span class="genre-tag">{{ movie.genre }}</span>
        <h1>{{ movie.title }}</h1>
        <p><strong>Director:</strong> {{ movie.director }}</p>
        <p><strong>Year:</strong> {{ movie.year }}</p>
        <p>{{ movie.description }}</p>
      </div>
    </article>

    <section v-if="movie" class="comments-section">
      <h2>Comments</h2>

      <form @submit.prevent="addComment" class="comment-form">
        <label for="comment">Share your thoughts</label>
        <textarea
          id="comment"
          v-model="comment"
          rows="3"
          maxlength="1000"
          required
          placeholder="What did you think about this movie?"
        ></textarea>

        <button class="btn btn-primary">Post Comment</button>
      </form>

      <p v-if="message" class="success">{{ message }}</p>
      <p v-if="error" class="error">{{ error }}</p>

      <div v-if="comments.length === 0" class="empty-state">
        No comments yet. Be the first to comment!
      </div>

      <article
        v-for="(item, index) in comments"
        :key="item._id || index"
        class="comment-card"
      >
        <p>{{ item.comment || item.text || item.message }}</p>
        <small class="muted">
          {{ item.user?.email || item.email || 'MovieHub user' }}
        </small>
      </article>
    </section>
  </section>
</template>