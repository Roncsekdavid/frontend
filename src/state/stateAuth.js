import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '../services/api'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const isLoggedIn = computed(() => !!user.value)

  async function fetchUser() {
    try {
      const { data } = await api.get('/users/me')
      user.value = data
    } catch {
      user.value = null
    }
  }

  
  async function updateUser(userData) {
    try {
      const { data } = await api.patch('/users/me', userData)
      user.value = data
      return { success: true }
    } catch (error) {
      console.error("Hiba a frissítéskor:", error)
      return { success: false, error }
    }
  }

  async function logout() {
    try {
      await api.post("/auth/logout")
      user.value = null
    } catch (error) {
      console.log(error)
    }
  }

  const login = async (email, password) => {
  const response = await api.post('/auth/login', {
    email,
    password
  })

  return response.data
}

 const register = async (name, email, phone, password) => {
  const response = await api.post('/auth/register', {
    name,
    email,
    phone,
    password
  })

  return response.data
  }

  return { user, isLoggedIn, fetchUser, logout, login, register, updateUser }
})