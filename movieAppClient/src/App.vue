 <script setup>
import { useRouter } from 'vue-router';
import { useUserStore } from './stores/user';

const router = useRouter();
const user = useUserStore();

function logout() {
  user.logout();
  router.push('/login');
}
</script>

<template>
  <header class="navbar">
    <RouterLink to="/movies" class="brand">
      🎬 MovieHub
    </RouterLink>

    <nav>
      <RouterLink to="/movies">Movies</RouterLink>

      <RouterLink v-if="!user.isLoggedIn" to="/register">
        Register
      </RouterLink>

      <RouterLink v-if="!user.isLoggedIn" to="/login">
        Login
      </RouterLink>

      <RouterLink v-if="user.isAdmin" to="/admin">
        Admin Dashboard
      </RouterLink>

      <button
        v-if="user.isLoggedIn"
        class="btn btn-light"
        @click="logout"
      >
        Logout
      </button>
    </nav>
  </header>

  <main class="container">
    <RouterView />
  </main>
</template>