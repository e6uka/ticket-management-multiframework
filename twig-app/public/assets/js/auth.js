const DB_NAME = "userDB";
const STORE_NAME = "users";

const openDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "email" });
      }
    };

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };

    request.onerror = (event) => {
      reject(event.target.error);
    };
  });
};

const addUser = (db, user) => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.add(user);

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
};

const getUser = (db, email) => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], "readonly");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(email);

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
};

const SESSION_KEY = 'ticketapp_session';

const auth = {
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
    window.location.href = '/login';
  },

  isAuthenticated: () => {
    return !!localStorage.getItem(SESSION_KEY);
  },

  getToken: () => {
    return localStorage.getItem(SESSION_KEY);
  }
};