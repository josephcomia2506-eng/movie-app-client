import { createRouter, createWebHistory } from 'vue-router';
import { useUserStore } from '../stores/user';

import Register from '../pages/Register.vue';
import Login from '../pages/Login.vue';
import Movies from '../pages/Movies.vue';
import MovieDetails from '../pages/MovieDetails.vue';
import AdminDashboard from '../pages/AdminDashboard.vue';
import AddMovie from '../pages/AddMovie.vue';

const routes = [
  { path: '/', redirect: '/movies' },
  { path: '/register', component: Register },
  { path: '/login', component: Login },
  { path: '/movies', component: Movies },
  {
    path: '/movies/:id',
    component: MovieDetails,
    meta: { requiresAuth: true }
  },
  {
    path: '/admin',
    component: AdminDashboard,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/addMovie',
    component: AddMovie,
    meta: { requiresAuth: true, requiresAdmin: true }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to) => {
  const user = useUserStore();

  if (to.meta.requiresAuth && !user.isLoggedIn) {
    return '/login';
  }

  if (to.meta.requiresAdmin && !user.isAdmin) {
    return '/movies';
  }

  if (user.isLoggedIn && to.path === '/login') {
    return user.isAdmin ? '/admin' : '/movies';
  }
});

export default router;