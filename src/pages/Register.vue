<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../stores/user';

const router = useRouter();
const user = useUserStore();

const form = reactive({
  email: '',
  password: '',
  confirmPassword: ''
});

const error = ref('');
const success = ref('');
const loading = ref(false);

async function register() {
  error.value = '';
  success.value = '';

  if (form.password !== form.confirmPassword) {
    error.value = 'Passwords do not match.';
    return;
  }

  loading.value = true;

  try {
    await user.register({
      email: form.email,
      password: form.password
    });

    success.value = 'Registration successful! Please log in.';
    setTimeout(() => router.push('/login'), 1000);
  } catch (err) {
    error.value =
      err.response?.data?.message ||
      'Registration failed. Please try again.';
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <section class="auth-card">
    <h1>Create Account</h1>
    <p>Join MovieHub to explore movies and leave comments.</p>

    <form @submit.prevent="register">
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
        placeholder="Create a password"
      />

      <label>Confirm Password</label>
      <input
        v-model="form.confirmPassword"
        type="password"
        required
        placeholder="Confirm your password"
      />

      <button class="btn btn-primary" :disabled="loading">
        {{ loading ? 'Registering...' : 'Register' }}
      </button>
    </form>

    <p v-if="error" class="error">{{ error }}</p>
    <p v-if="success" class="success">{{ success }}</p>

    <p>Already registered? <RouterLink to="/login">Login</RouterLink></p>
  </section>
</template>