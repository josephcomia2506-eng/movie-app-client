import { defineStore } from 'pinia';
import api from '../api';

function decodeToken(token) {
  try {
    const payload = token.split('.')[1];
    const base64 = payload
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    return JSON.parse(atob(base64));
  } catch {
    return {};
  }
}

export const useUserStore = defineStore('user', {
  state: () => ({
    token: localStorage.getItem('token') || '',
    email: localStorage.getItem('email') || '',
    user: null
  }),

  getters: {
    isLoggedIn: (state) => Boolean(state.token),

    isAdmin: (state) => {
      const payload = decodeToken(state.token);

      return (
        state.email?.toLowerCase() === 'admin@mail.com' ||
        state.user?.isAdmin === true ||
        state.user?.role?.toLowerCase() === 'admin' ||
        payload.isAdmin === true ||
        payload.role?.toLowerCase() === 'admin'
      );
    }
  },

  actions: {
    async register(credentials) {
      const response = await api.post(
        '/users/register',
        credentials
      );

      return response.data;
    },

    async login(credentials) {
      const response = await api.post(
        '/users/login',
        credentials
      );

      const data = response.data;
      const token = data.access || data.token;

      if (!token) {
        throw new Error(
          'No token found. Check the login API response.'
        );
      }

      this.token = token;
      this.email = credentials.email.trim().toLowerCase();
      this.user = data.user || data;

      localStorage.setItem('token', token);
      localStorage.setItem('email', this.email);

      return data;
    },

    logout() {
      this.token = '';
      this.email = '';
      this.user = null;

      localStorage.removeItem('token');
      localStorage.removeItem('email');
    }
  }
});