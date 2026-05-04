import { defineStore } from 'pinia'
import { ref } from 'vue'

export const CURRENCIES = [
  { code: 'HUF', label: 'Magyar Forint',   symbol: 'Ft',  flag: '🇭🇺', countryCode: 'hu' },
  { code: 'EUR', label: 'Euró',            symbol: '€',   flag: '🇪🇺', countryCode: 'eu' },
  { code: 'USD', label: 'Amerikai dollár', symbol: '$',   flag: '🇺🇸', countryCode: 'us' },
  { code: 'GBP', label: 'Brit font',       symbol: '£',   flag: '🇬🇧', countryCode: 'gb' },
  { code: 'CHF', label: 'Svájci frank',    symbol: '₣',   flag: '🇨🇭', countryCode: 'ch' },
  { code: 'JPY', label: 'Japán jen',       symbol: '¥',   flag: '🇯🇵', countryCode: 'jp' },
  { code: 'CAD', label: 'Kanadai dollár',  symbol: 'CA$', flag: '🇨🇦', countryCode: 'ca' },
  { code: 'AUD', label: 'Ausztrál dollár', symbol: 'A$',  flag: '🇦🇺', countryCode: 'au' },
  { code: 'PLN', label: 'Lengyel zloty',   symbol: 'zł',  flag: '🇵🇱', countryCode: 'pl' },
  { code: 'CZK', label: 'Cseh korona',     symbol: 'Kč',  flag: '🇨🇿', countryCode: 'cz' },
  { code: 'RON', label: 'Román lej',       symbol: 'lei', flag: '🇷🇴', countryCode: 'ro' },
  { code: 'UAH', label: 'Ukrán hrivnya',   symbol: '₴',   flag: '🇺🇦', countryCode: 'ua' },
  { code: 'RUB', label: 'Orosz rubel',     symbol: '₽',   flag: '🇷🇺', countryCode: 'ru' },
  { code: 'CNY', label: 'Kínai jüan',      symbol: '¥',   flag: '🇨🇳', countryCode: 'cn' },
  { code: 'SEK', label: 'Svéd korona',     symbol: 'kr',  flag: '🇸🇪', countryCode: 'se' },
  { code: 'NOK', label: 'Norvég korona',   symbol: 'kr',  flag: '🇳🇴', countryCode: 'no' },
  { code: 'DKK', label: 'Dán korona',      symbol: 'kr',  flag: '🇩🇰', countryCode: 'dk' },
]

export const useCurrencyStore = defineStore('currency', () => {
  const selectedCode = ref('HUF')
  const exchangeRate = ref(null)
  const ratesCache   = ref(null)
  const loading      = ref(false)

  async function fetchRates() {
    if (ratesCache.value) return ratesCache.value
    loading.value = true
    try {
      const res  = await fetch('https://api.exchangerate-api.com/v4/latest/HUF')
      const data = await res.json()
      ratesCache.value = data.rates
      return data.rates
    } catch (e) {
      console.error('Árfolyam lekérés sikertelen:', e)
      return null
    } finally {
      loading.value = false
    }
  }

  async function setCurrency(code) {
    selectedCode.value = code

    if (code === 'HUF') {
      exchangeRate.value = null
      return
    }

    const rates = await fetchRates()
    if (!rates) return
    const rate = rates[code]
    exchangeRate.value = rate ? (1 / rate).toFixed(2) : null
  }

  return { selectedCode, exchangeRate, loading, setCurrency }
})