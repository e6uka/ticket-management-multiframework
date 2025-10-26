import { openDB, addUser, getUser } from './indexedDB';

const SESSION_KEY = 'ticketapp_session';

export const auth = {
  login: async (email, password) => {
    try {
      const db = await openDB();
      const user = await getUser(db, email);
      if (user && user.password === password) {
        const token = btoa(`${email}:${Date.now()}`);
        localStorage.setItem(SESSION_KEY, token);
        return { success: true, token };
      }
      return { success: false, error: 'Invalid email or password' };
    } catch (error) {
      return { success: false, error: 'An error occurred during login' };
    }
  },

  signup: async (email, password, name) => {
    if (!email || !password || !name) {
      return { success: false, error: 'All fields are required' };
    }
    try {
      const db = await openDB();
      const existingUser = await getUser(db, email);
      if (existingUser) {
        return { success: false, error: 'User already exists' };
      }
      await addUser(db, { email, password, name });
      const token = btoa(`${email}:${Date.now()}`);
      localStorage.setItem(SESSION_KEY, token);
      return { success: true, token };
    } catch (error) {
      return { success: false, error: 'An error occurred during signup' };
    }
  },

  logout: () => {
    localStorage.removeItem(SESSION_KEY);
  },

  isAuthenticated: () => {
    return !!localStorage.getItem(SESSION_KEY);
  },

  getToken: () => {
    return localStorage.getItem(SESSION_KEY);
  }
};
