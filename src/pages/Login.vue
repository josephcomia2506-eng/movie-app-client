<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../stores/user';

const router = useRouter();
const user = useUserStore();

const form = reactive({
  email: '',
  password: ''
});

const error = ref('');
const loading = ref(false);

async function login() {
  error.value = '';
  loading.value = true;

  try {
    await user.login(form);
    router.push(user.isAdmin ? '/admin' : '/movies');
  } catch (err) {
    error.value =
      err.response?.data?.message ||
      err.message ||
      'Invalid email or password.';
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <section class="auth-card">
    <h1>Welcome Back</h1>
    <p>Sign in to explore the movie catalog.</p>

    <form @submit.prevent="login">
      <label>Email Address</label>
      <input
        v-model.trim="form.email"
        type="email"
        required
        placeholder="you@example.com"
      />

      <label>Password</label>
      <input
        v-model="form.password"
        type="password"
        required
        placeholder="Your password"
      />

      <button class="btn btn-primary" :disabled="loading">
        {{ loading ? 'Signing in...' : 'Login' }}
      </button>
    </form>

    <p v-if="error" class="error">{{ error }}</p>
    <p>New to MovieHub? <RouterLink to="/register">Register</RouterLink></p>
  </section>
</template>