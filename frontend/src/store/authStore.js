// src/store/authStore.js
import { create } from "zustand";

const useAuthStore = create((set) => ({
  isAuthenticated: localStorage.getItem("isAuthenticated") === "true",
  login: (email, password) => {
    // Simulate login
    localStorage.setItem("isAuthenticated", "true");
    set({ isAuthenticated: true });
  },
  signup: (email, password) => {
    // Simulate signup
    localStorage.setItem("isAuthenticated", "true");
    set({ isAuthenticated: true });
  },
  logout: () => {
    localStorage.removeItem("isAuthenticated");
    set({ isAuthenticated: false });
  },
}));

export default useAuthStore;
