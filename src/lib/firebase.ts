// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { isSupported } from "firebase/analytics";
import { getDatabase, ref, set, get, update, remove, push, onValue } from "firebase/database";
import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyChIVLIB3wjtFZE1wSM8LYGdxw6qzQ8kAQ",
  authDomain: "biharboardresultapp.firebaseapp.com",
  databaseURL: "https://biharboardresultapp-default-rtdb.firebaseio.com",
  projectId: "biharboardresultapp",
  storageBucket: "biharboardresultapp.firebasestorage.app",
  messagingSenderId: "494912474501",
  appId: "1:494912474501:web:5b83cb760307eabc7988ec",
  measurementId: "G-SFG73WCRNH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize analytics only on client side and if supported
let analytics: ReturnType<typeof getAnalytics> | null = null;
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

const database = getDatabase(app);
const auth = getAuth(app);

// Firebase service exports
export { app, analytics, database, auth };
export { ref, set, get, update, remove, push, onValue, signInAnonymously, onAuthStateChanged };

// Utility functions for common operations
export const firebaseUtils = {
  // Authentication
  async signInAnonymously() {
    try {
      const userCredential = await signInAnonymously(auth);
      return userCredential.user;
    } catch (error) {
      throw error;
    }
  },

  // Get current user
  getCurrentUser() {
    return auth.currentUser;
  },

  // Database operations
  async saveData(path: string, data: any) {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('No authenticated user');
      }
      
      const userPath = `users/${user.uid}/${path}`;
      const dbRef = ref(database, userPath);
      await set(dbRef, {
        ...data,
        timestamp: Date.now(),
        userId: user.uid
      });
      console.log(`Data saved to ${userPath}`);
      return true;
    } catch (error) {
      console.error('Error saving data:', error);
      throw error;
    }
  },

  async getData(path: string) {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('No authenticated user');
      }
      
      const userPath = `users/${user.uid}/${path}`;
      const dbRef = ref(database, userPath);
      const snapshot = await get(dbRef);
      
      if (snapshot.exists()) {
        return snapshot.val();
      }
      return null;
    } catch (error) {
      console.error('Error getting data:', error);
      throw error;
    }
  },

  async updateData(path: string, data: any) {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('No authenticated user');
      }
      
      const userPath = `users/${user.uid}/${path}`;
      const dbRef = ref(database, userPath);
      await update(dbRef, {
        ...data,
        timestamp: Date.now(),
        userId: user.uid
      });
      console.log(`Data updated at ${userPath}`);
      return true;
    } catch (error) {
      console.error('Error updating data:', error);
      throw error;
    }
  },

  async deleteData(path: string) {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('No authenticated user');
      }
      
      const userPath = `users/${user.uid}/${path}`;
      const dbRef = ref(database, userPath);
      await remove(dbRef);
      console.log(`Data deleted from ${userPath}`);
      return true;
    } catch (error) {
      console.error('Error deleting data:', error);
      throw error;
    }
  },

  // Push new data with auto-generated key
  async pushData(path: string, data: any) {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('No authenticated user');
      }
      
      const userPath = `users/${user.uid}/${path}`;
      const dbRef = ref(database, userPath);
      const newRef = push(dbRef);
      
      await set(newRef, {
        ...data,
        timestamp: Date.now(),
        userId: user.uid,
        id: newRef.key
      });
      console.log(`Data pushed to ${userPath}/${newRef.key}`);
      return newRef.key;
    } catch (error) {
      console.error('Error pushing data:', error);
      throw error;
    }
  },

  // Listen for real-time updates
  listenToData(path: string, callback: (data: any) => void) {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('No authenticated user');
      }
      
      const userPath = `users/${user.uid}/${path}`;
      const dbRef = ref(database, userPath);
      
      const unsubscribe = onValue(dbRef, (snapshot) => {
        if (snapshot.exists()) {
          callback(snapshot.val());
        } else {
          callback(null);
        }
      });
      
      return unsubscribe;
    } catch (error) {
      console.error('Error setting up listener:', error);
      throw error;
    }
  }
};

// Initialize authentication state listener
export const initializeAuth = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log('User is authenticated:', user.uid);
        resolve(user);
      } else {
        try {
          const userCredential = await signInAnonymously(auth);
          console.log('Anonymous user signed in:', userCredential.user.uid);
          resolve(userCredential.user);
        } catch (error) {
          console.error('Error signing in anonymously:', error);
          reject(error);
        }
      }
      unsubscribe();
    });
  });
};

export default app;
