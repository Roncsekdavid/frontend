import axios from 'axios'

const api = axios.create({
  baseURL: 'https://api.zacipaci.hu/api',
  withCredentials: true
})

export default api
