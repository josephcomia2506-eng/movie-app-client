import { defineStore } from 'pinia';
import api from '../api';

function decodeToken(token) {
  try {
    const payload = token.split('.')[1];
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(base64));
  } catch {
    return {};
  }
}

export const useUserStore = defineStore('user', {
  state: () => ({
    token: localStorage.getItem('token') || '',
    user: null
  }),

  getters: {
    isLoggedIn: (state) => Boolean(state.token),

    isAdmin: (state) => {
      const payload = decodeToken(state.token);

      return Boolean(
        state.user?.isAdmin ??
        state.user?.role === 'admin' ??
        state.user?.isAdmin === true ??
        payload.isAdmin ??
        payload.role === 'admin'
      );
    }
  },

  actions: {
    async register(credentials) {
      const response = await api.post('/users/register', credentials);
      return response.data;
    },

    async login(credentials) {
      const response = await api.post('/users/login', credentials);
      const data = response.data;

      const token = data.access || data.token;

      if (!token) {
        throw new Error(
          'No token found. Check the login API response.'
        );
      }

      this.token = token;
      localStorage.setItem('token', token);

      this.user = data.user || data;

      return data;
    },

    logout() {
      this.token = '';
      this.user = null;
      localStorage.removeItem('token');
    }
  }
});