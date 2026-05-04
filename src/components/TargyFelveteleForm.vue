<script setup>
import { ref, computed } from 'vue'
import api from '../services/api'

const MAX_SIZE_MB = 5
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

const fileInput = ref(null)
const isDragging = ref(false)
const uploading = ref(false)
const files = ref([])

const name = ref('')
const estimatedValue = ref('')
const description = ref('')
const category = ref('')

const categories = [
  { value: 'Ékszer & Arany', label: 'Ékszer & Arany' },
  { value: 'Órák', label: 'Órák' },
  { value: 'Műtárgyak', label: 'Műtárgyak' },
  { value: 'Elektronika', label: 'Elektronika' },
  { value: 'Háztartási gépek', label: 'Háztartási gépek' },
  { value: 'Hétköznapi cikkek', label: 'Hétköznapi cikkek' },
  { value: 'Hangszerek', label: 'Hangszerek' },
  { value: 'Jármű', label: 'Jármű' },
  { value: 'Szerszámgépek', label: 'Szerszámgépek' },
  { value: 'Játékkonzolok', label: 'Játékkonzolok' },
  { value: 'Bútorok', label: 'Bútorok' },
  { value: 'Sporteszközök', label: 'Sporteszközök' },
]

const fieldErrors = ref({
  name: '',
  estimatedValue: '',
  description: '',
  category: '',
  images: '',
})
const submitted = ref(false)
const submitSuccess = ref(false)

const validFiles = computed(() =>
  files.value.filter(f => !f.error)
)

function triggerInput() {
  fileInput.value?.click()
}

function onFileChange(e) {
  addFiles(Array.from(e.target.files))
  e.target.value = ''
}

function onDrop(e) {
  isDragging.value = false
  addFiles(Array.from(e.dataTransfer.files))
}

function addFiles(newFiles) {
  for (const file of newFiles) {
    if (files.value.some(f => f.name === file.name && f.size === file.size)) continue

    const entry = {
      name: file.name,
      size: file.size,
      type: file.type,
      raw: file,
      preview: null,
      error: null,
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      entry.error = 'Nem támogatott formátum'
    } else if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      entry.error = `Túl nagy (max ${MAX_SIZE_MB}MB)`
    }

    files.value.push(entry)

    if (!entry.error) {
      const idx = files.value.length - 1
      const reader = new FileReader()
      reader.onload = (ev) => {
        files.value[idx] = { ...files.value[idx], preview: ev.target.result }
      }
      reader.readAsDataURL(file)
    }
  }
  if (submitted.value) validateFields()
}

function removeFile(index) {
  files.value.splice(index, 1)
  if (submitted.value) validateFields()
}

function formatSize(bytes) {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

function validateFields() {
  fieldErrors.value.name = name.value.trim() ? '' : 'Kérjük adja meg a tárgy megnevezését.'
  fieldErrors.value.estimatedValue = estimatedValue.value ? '' : 'Kérjük adja meg az igényelt összegét.'
  fieldErrors.value.description = description.value.trim() ? '' : 'Kérjük írjon leírást a tárgyról.'
  fieldErrors.value.category = category.value ? '' : 'Kérjük válasszon kategóriát.'
  fieldErrors.value.images = validFiles.value.length > 0 ? '' : 'Legalább egy képet csatolnia kell.'
}

function hasErrors() {
  return Object.values(fieldErrors.value).some(e => e !== '')
}

async function submitForm() {
  submitted.value = true
  submitSuccess.value = false
  validateFields()

  if (hasErrors()) return

  uploading.value = true

  try {
    const formData = new FormData()
    formData.append('name', name.value.trim())
    formData.append('estimated_value', estimatedValue.value)
    formData.append('description', description.value.trim())
    formData.append('category', category.value)

    for (const file of validFiles.value) {
      formData.append('files', file.raw)
    }

    const { data } = await api.post('/items', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })

    if (!data) {
      fieldErrors.value.name = 'Hiba történt a feltöltés során.'
      return
    }

    submitSuccess.value = true
    name.value = ''
    estimatedValue.value = ''
    description.value = ''
    category.value = ''
    files.value = []
    submitted.value = false
    fieldErrors.value = { name: '', estimatedValue: '', description: '', category: '', images: '' }

  } catch (err) {
    console.error('[ItemForm] Hiba:', err)
    fieldErrors.value.name = err.response?.data?.error || 'Nem sikerült kapcsolódni a szerverhez.'
  } finally {
    uploading.value = false
  }
}
</script>

<template>
  <div class="flex flex-col md:flex-row justify-between gap-4 md:gap-6 mb-5">
    <div class="w-full">
      <label for="item-name" class="block text-sm font-bold text-[#4A2E23] dark:text-[#FBF5E9] mb-2">Tárgy pontos megnevezése</label>
      <div
        class="flex items-center rounded-xl bg-white dark:bg-[#26211E] border-2 px-3 outline-none transition-all focus-within:border-[#E5B326]"
        :class="fieldErrors.name ? 'border-red-400' : 'border-gray-200 dark:border-[#E5B326]/30'">
        <input v-model="name" type="text" id="item-name"
          class="block w-full py-3 text-base placeholder:text-gray-400 dark:placeholder:text-[#D4C7B0]/40 focus:outline-none bg-transparent text-[#4A2E23] dark:text-[#FBF5E9]"
          placeholder="Pl: Apple Iphone 15 Pro 128GB" />
      </div>
      <p v-if="fieldErrors.name" class="mt-1 ml-1 text-xs text-red-500 font-semibold flex items-center gap-1">
        <i class="bi bi-exclamation-circle-fill"></i> {{ fieldErrors.name }}
      </p>
    </div>

    <div class="w-full">
      <label for="price" class="block text-sm font-bold text-[#4A2E23] dark:text-[#FBF5E9] mb-2">Igényelt összeg</label>
      <div
        class="flex items-center rounded-xl bg-white dark:bg-[#26211E] border-2 px-3 outline-none transition-all focus-within:border-[#E5B326]"
        :class="fieldErrors.estimatedValue ? 'border-red-400' : 'border-gray-200 dark:border-[#E5B326]/30'">
        <input v-model="estimatedValue" type="number" id="price"
          class="block w-full py-3 text-base placeholder:text-gray-400 dark:placeholder:text-[#D4C7B0]/40 focus:outline-none bg-transparent text-[#4A2E23] dark:text-[#FBF5E9]"
          placeholder="100 000" />
        <span class="text-gray-400 dark:text-[#D4C7B0]/60 font-bold ml-2 uppercase text-sm shrink-0">HUF</span>
      </div>
      <p v-if="fieldErrors.estimatedValue" class="mt-1 ml-1 text-xs text-red-500 font-semibold flex items-center gap-1">
        <i class="bi bi-exclamation-circle-fill"></i> {{ fieldErrors.estimatedValue }}
      </p>
    </div>
  </div>

  <div class="mb-5">
    <label for="about" class="block text-sm font-bold text-[#4A2E23] dark:text-[#FBF5E9] mb-2">Részletes leírás a tárgyról</label>
    <textarea v-model="description" id="about" rows="4"
      class="block w-full rounded-xl bg-white dark:bg-[#26211E] border-2 px-4 py-3 text-base text-[#4A2E23] dark:text-[#FBF5E9] outline-none transition-all focus:border-[#E5B326] placeholder:text-gray-400 dark:placeholder:text-[#D4C7B0]/40"
      :class="fieldErrors.description ? 'border-red-400' : 'border-gray-200 dark:border-[#E5B326]/30'"
      placeholder="Kérem írjon egy részletes leírást a tárgyról, állapotáról, tartozékairól..."></textarea>
    <p v-if="fieldErrors.description" class="mt-1 ml-1 text-xs text-red-500 font-semibold flex items-center gap-1">
      <i class="bi bi-exclamation-circle-fill"></i> {{ fieldErrors.description }}
    </p>
  </div>

  <div class="mb-6">
    <label for="category" class="block text-sm font-bold text-[#4A2E23] dark:text-[#FBF5E9] mb-2">Tárgy kategóriája</label>
    <div class="relative">
      <select v-model="category" id="category"
        class="w-full appearance-none rounded-xl bg-white dark:bg-[#26211E] border-2 px-4 py-3 text-base font-semibold outline-none transition-all focus:border-[#E5B326] cursor-pointer"
        :class="[
          fieldErrors.category ? 'border-red-400' : 'border-gray-200 dark:border-[#E5B326]/30',
          category ? 'text-[#4A2E23] dark:text-[#FBF5E9]' : 'text-gray-400 dark:text-[#D4C7B0]/40'
        ]">
        <option value="" disabled>Válasszon kategóriát...</option>
        <option v-for="cat in categories" :key="cat.value" :value="cat.value"
          class="text-[#4A2E23] dark:text-[#FBF5E9] dark:bg-[#26211E]">
          {{ cat.label }}
        </option>
      </select>
      <i class="bi bi-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-[#4A2E23]/50 dark:text-[#D4C7B0]/50 pointer-events-none"></i>
    </div>
    <p v-if="fieldErrors.category" class="mt-1 ml-1 text-xs text-red-500 font-semibold flex items-center gap-1">
      <i class="bi bi-exclamation-circle-fill"></i> {{ fieldErrors.category }}
    </p>
  </div>

  <div class="mb-6 p-6 md:p-10 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-300"
    :class="isDragging
      ? 'border-[#E5B326] bg-[#E5B326]/10 scale-[1.01]'
      : fieldErrors.images
        ? 'border-red-400 bg-white dark:bg-[#26211E]'
        : 'border-gray-300 dark:border-[#E5B326]/30 bg-white dark:bg-[#26211E] hover:border-[#E5B326]'"
    @click="triggerInput" @dragover.prevent="isDragging = true" @dragleave.prevent="isDragging = false"
    @drop.prevent="onDrop">
    <div class="text-center">
      <i class="bi bi-camera-fill text-5xl md:text-6xl mb-3 block transition-transform"
        :class="isDragging ? 'text-yellow-500 scale-110' : 'text-[#E5B326]'"></i>
      <p class="text-[#4A2E23] dark:text-[#D4C7B0] font-medium">
        <span class="text-[#E5B326] font-bold underline decoration-2 underline-offset-4">Tallózás</span>
        vagy húzza ide a képeket
      </p>
      <p class="text-xs text-gray-400 dark:text-[#D4C7B0]/50 mt-2 italic">Támogatott: JPG, PNG, WEBP (Egyenként max 5MB)</p>
    </div>
    <input ref="fileInput" type="file" accept=".jpg,.jpeg,.png,.webp" multiple class="hidden" @change="onFileChange" />
  </div>
  <p v-if="fieldErrors.images" class="-mt-4 mb-4 ml-1 text-xs text-red-500 font-semibold flex items-center gap-1">
    <i class="bi bi-exclamation-circle-fill"></i> {{ fieldErrors.images }}
  </p>

  <transition-group name="file-list" tag="ul" class="space-y-3 mb-8">
    <li v-for="(file, index) in files" :key="file.name + index"
      class="flex items-center gap-3 p-3 bg-white dark:bg-[#26211E] border-2 border-gray-100 dark:border-[#E5B326]/20 rounded-xl shadow-sm transition-colors">
      <img v-if="file.preview" :src="file.preview"
        class="w-12 h-12 object-cover rounded-lg border border-gray-100 dark:border-[#E5B326]/20" alt="preview" />
      <div v-else class="w-12 h-12 flex items-center justify-center bg-yellow-50 dark:bg-[#1A1614] rounded-lg text-[#E5B326]">
        <i class="bi bi-image text-2xl"></i>
      </div>

      <div class="flex-1 min-w-0">
        <p class="text-sm font-bold text-[#4A2E23] dark:text-[#FBF5E9] truncate">{{ file.name }}</p>
        <p class="text-xs text-gray-400 dark:text-[#D4C7B0]/60">{{ formatSize(file.size) }}</p>
        <p v-if="file.error" class="text-xs text-red-500 dark:text-red-400 font-bold mt-0.5">{{ file.error }}</p>
      </div>

      <button @click.stop="removeFile(index)"
        class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-red-50 dark:hover:bg-red-500/10 text-gray-300 dark:text-[#D4C7B0]/40 hover:text-red-500 dark:hover:text-red-400 transition-all">
        <i class="bi bi-trash3-fill"></i>
      </button>
    </li>
  </transition-group>

  <div v-if="submitSuccess"
    class="mb-6 p-4 bg-green-50 dark:bg-green-500/10 border-l-4 border-green-500 rounded-r-lg text-sm text-green-700 dark:text-green-400 animate__animated animate__fadeIn">
    <div class="flex items-center">
      <i class="bi bi-check-circle-fill mr-2 text-lg"></i>
      <span>Az ajánlatát rögzítettük! Szakértőink hamarosan jelentkeznek.</span>
    </div>
  </div>

  <div class="text-center">
    <button @click="submitForm" :disabled="uploading"
      class="w-full md:w-auto bg-[#E5B326] hover:bg-[#d0a01e] disabled:opacity-50 text-[#4A2E23] font-bold text-lg py-4 px-10 rounded-2xl shadow-[0px_4px_0px_#b88a1b] active:shadow-none active:translate-y-[2px] transition-all flex items-center justify-center mx-auto">
      <template v-if="uploading">
        <i class="bi bi-arrow-repeat animate-spin mr-3 text-xl"></i> Feldolgozás...
      </template>
      <template v-else>
        <i class="bi bi-send-fill mr-2"></i> Ajánlat elküldése
      </template>
    </button>
  </div>
</template>

<style scoped>
.file-list-enter-active,
.file-list-leave-active {
  transition: all 0.25s ease;
}

.file-list-enter-from {
  opacity: 0;
  transform: translateY(-8px);
}

.file-list-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.animate-spin {
  display: inline-block;
  animation: spin 0.8s linear infinite;
}
</style>