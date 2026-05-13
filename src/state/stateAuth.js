import { defineStore } from 'pinia'
import { ref, computed, markRaw } from 'vue'
import api from '../services/api'
import { useFavoritesStore } from './stateFavorites'
import User from '../classes/User'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)

  // Reaktív mezők külön – ezeket a Vue tudja követni
  const userName = ref(null)
  const userAvatarUrl = ref(null)
  const userAvatarPath = ref(null)

  const isLoggedIn = computed(() => !!user.value)

  function syncReactiveFields(userInstance) {
    userName.value = userInstance.getName()
    userAvatarUrl.value = userInstance.getAvatarUrl()
    userAvatarPath.value = userInstance.getAvatarPath()
  }

  async function fetchUser() {
    try {
      const { data } = await api.get('/users/me')
      const instance = User.fromApi(data)
      user.value = markRaw(instance)
      syncReactiveFields(instance)

      const favoritesStore = useFavoritesStore()
      if (data.favorites) {
        favoritesStore.setFavorites(data.favorites)
      }
    } catch {
      user.value = null
      userName.value = null
      userAvatarUrl.value = null
      userAvatarPath.value = null
    }
  }

  async function updateUser(userData) {
    try {
      const { data } = await api.patch('/users/me', userData)
      const instance = User.fromApi(data)
      user.value = markRaw(instance)
      syncReactiveFields(instance)
      return { success: true }
    } catch (error) {
      console.error("Hiba a frissítéskor:", error)
      return { success: false, error }
    }
  }

  async function uploadAvatar(file) {
    try {
      const formData = new FormData()
      formData.append('avatar', file)

      const { data } = await api.post('/users/me/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      const instance = User.fromApi(data)
      user.value = markRaw(instance)
      syncReactiveFields(instance)

      return { success: true }
    } catch (error) {
      console.error('[uploadAvatar] Hiba:', error)
      return { success: false, error }
    }
  }

  async function logout() {
    try {
      await api.post("/auth/logout")
      user.value = null
      userName.value = null
      userAvatarUrl.value = null
      userAvatarPath.value = null
    } catch (error) {
      console.log(error)
    }
  }

  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password })
    return response.data
  }

  const register = async (name, email, phone, password) => {
    const response = await api.post('/auth/register', { name, email, phone, password })
    return response.data
  }

  return {
    user,
    userName,
    userAvatarUrl,
    userAvatarPath,
    isLoggedIn,
    fetchUser,
    logout,
    login,
    register,
    updateUser,
    uploadAvatar
  }
})