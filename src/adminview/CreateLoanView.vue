<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AdminHeader from '../admincomponents/AdminHeader.vue'
import AdminMenu from '../admincomponents/AdminMenu.vue'
import { scanState } from '../adminstate/scanState'
import api from '../services/api'

const router = useRouter()
const route = useRoute()
const state = scanState()

const loading = ref(true)
const loadError = ref(false)

const loanStartDate = ref(new Date().toISOString().slice(0, 10))
const note = ref('')

const loanAmount = ref(state.getSelectedOffer()?.getLoanAmount() || 0)
const interestRate = ref(state.getSelectedOffer()?.getInterestRate() || 0)
const durationMonths = ref(1)
const creating = ref(false)

const loanErrorMessage = ref('')
const loanSuccessMessage = ref('')

const loanEndDate = computed(() => {
    const date = new Date(loanStartDate.value)
    date.setMonth(date.getMonth() + Number(durationMonths.value))
    return date.toISOString().slice(0, 10)
})

async function createLoan() {
    if (creating.value) return

    const offer = state.getSelectedOffer()

    creating.value = true
    loanErrorMessage.value = ''
    loanSuccessMessage.value = ''

    try {
        const loanData = {
            offer_id: offer.getId(),
            principal_amount: loanAmount.value,
            interest_rate: interestRate.value,
            start_date: loanStartDate.value,
            due_date: loanEndDate.value,
            duration_months: durationMonths.value,
            note: note.value
        }

        await api.post('/loans', loanData)

        loanSuccessMessage.value = 'Kölcsön sikeresen létrehozva.'

        setTimeout(() => {
            router.push('/admin/loans')
        }, 800)
    } catch (error) {
        loanErrorMessage.value =
            error.response?.data?.error || 'A kölcsön létrehozása sikertelen.'

        console.error(error)
    } finally {
        creating.value = false
    }
}

function goBack() {
    router.back()
}


onMounted(async () => {
    try {
        const id = route.params.id
        await state.fetchOfferById(id)

        const offer = state.getSelectedOffer()

        if (offer.getStatus() !== 'ACCEPTED') {
            router.push('/admin')
            return
        }

        loanAmount.value = offer.getLoanAmount()
        interestRate.value = offer.getInterestRate()
    } catch (error) {
        console.error(error)
        loadError.value = true
    } finally {
        loading.value = false
    }
})
</script>

<template>
    <div class="grid grid-cols-6 min-h-screen">
        <AdminMenu />

        <div class="w-full bg-[#F7F8F0] col-span-6 md:col-span-4 lg:col-span-5 p-6">
            <AdminHeader />

            <div class="max-w-5xl mx-auto mt-8">

                <div class="mb-8">
                    <h2 class="text-3xl font-extrabold text-[#051826] tracking-tight">
                        Kölcsön létrehozása
                    </h2>
                    <p class="text-[#051826]/50 font-medium mt-1">
                        Ellenőrizd az ajánlat adatait, majd hozd létre a kölcsönt
                    </p>
                </div>

                <div v-if="loading"
                    class="bg-white border-2 border-[#051826] rounded-3xl p-6 shadow-[6px_6px_0px_#051826]">
                    <p class="font-bold text-[#051826]">Ajánlat betöltése...</p>
                </div>

                <div v-else-if="state.getSelectedOffer()" class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div class="bg-white border-2 border-[#051826] rounded-3xl p-6 shadow-[6px_6px_0px_#051826]">

                        <div class="flex items-center gap-3 mb-5">
                            <div class="w-10 h-10 bg-[#051826] rounded-xl flex items-center justify-center">
                                <i class="bi bi-file-earmark-text text-white text-xl"></i>
                            </div>
                            <span class="font-bold text-[#051826] text-lg">Ajánlat adatai</span>
                        </div>

                        <div class="mb-5">
                            <div v-if="state.getSelectedOffer().getItem().getItemImages()?.length">

                                <img :src="state.getSelectedOffer().getItem().getPrimaryImage()"
                                    class="w-full h-56 object-cover rounded-2xl border-2 border-[#051826] mb-3" />

                                <div class="flex gap-2 overflow-x-auto">
                                    <img v-for="img in state.getSelectedOffer().getItem().getItemImages()" :key="img.id"
                                        :src="img.url"
                                        class="w-16 h-16 object-cover rounded-xl border-2 border-[#051826]/30" />
                                </div>

                            </div>

                            <div v-else
                                class="h-56 flex items-center justify-center bg-[#F7F8F0] rounded-2xl border-2 border-dashed border-[#051826]/30">
                                <span class="text-[#051826]/40 font-bold">Nincs kép</span>
                            </div>
                        </div>

                        <div class="space-y-3">
                            <div class="bg-[#F7F8F0] rounded-xl p-4">
                                <p class="text-xs font-bold text-[#051826]/40 uppercase mb-1">Tárgy neve</p>
                                <p class="font-bold text-[#051826]">
                                    {{ state.getSelectedOffer().getItem().getName() }}
                                </p>
                            </div>

                            <div class="bg-[#F7F8F0] rounded-xl p-4">
                                <p class="text-xs font-bold text-[#051826]/40 uppercase mb-1">Offer kód</p>
                                <p class="font-mono font-bold text-[#051826]">
                                    {{ state.getSelectedOffer().getOfferCode() }}
                                </p>
                            </div>

                            <div class="grid grid-cols-2 gap-3">
                                <div class="bg-[#F7F8F0] rounded-xl p-4">
                                    <p class="text-xs font-bold text-[#051826]/40 uppercase mb-1">Összeg</p>
                                    <p class="font-bold text-[#051826]">
                                        {{ state.getSelectedOffer().getLoanAmount() }} Ft
                                    </p>
                                </div>

                                <div class="bg-[#F7F8F0] rounded-xl p-4">
                                    <p class="text-xs font-bold text-[#051826]/40 uppercase mb-1">Kamat</p>
                                    <p class="font-bold text-[#051826]">
                                        {{ state.getSelectedOffer().getInterestRate() }}%
                                    </p>
                                </div>
                            </div>

                            <div class="bg-[#F7F8F0] rounded-xl p-4">
                                <p class="text-xs font-bold text-[#051826]/40 uppercase mb-1">Státusz</p>
                                <span
                                    class="inline-block bg-yellow-100 text-yellow-800 font-bold text-xs px-3 py-1 rounded-full">
                                    {{ state.getSelectedOffer().getStatus() }}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div class="bg-white border-2 border-[#051826] rounded-3xl p-6 shadow-[6px_6px_0px_#051826]">
                        <div class="flex items-center gap-3 mb-5">
                            <div class="w-10 h-10 bg-[#051826] rounded-xl flex items-center justify-center">
                                <i class="bi bi-cash-coin text-white text-xl"></i>
                            </div>
                            <span class="font-bold text-[#051826] text-lg">Kölcsön adatai</span>
                        </div>

                        <div class="space-y-4">
                            <div v-if="loanErrorMessage"
                                class="bg-red-50 border-2 border-red-400 rounded-xl p-4 text-red-700 font-bold">
                                {{ loanErrorMessage }}
                            </div>

                            <div v-if="loanSuccessMessage"
                                class="bg-green-50 border-2 border-green-500 rounded-xl p-4 text-green-700 font-bold">
                                {{ loanSuccessMessage }}
                            </div>
                            <div>
                                <label class="text-sm font-bold text-[#051826]">Kezdés dátuma</label>
                                <input v-model="loanStartDate" type="date"
                                    class="w-full mt-1 border-2 border-[#051826] rounded-xl px-4 py-3 font-bold text-[#051826]" />
                            </div>

                            <div>
                                <label class="text-sm font-bold text-[#051826]">Futamidő</label>
                                <select v-model="durationMonths"
                                    class="w-full mt-1 border-2 border-[#051826] rounded-xl px-4 py-3 font-bold text-[#051826] bg-white">
                                    <option :value="1">1 hónap</option>
                                    <option :value="2">2 hónap</option>
                                    <option :value="3">3 hónap</option>
                                    <option :value="6">6 hónap</option>
                                    <option :value="12">12 hónap</option>
                                </select>
                            </div>

                            <div>
                                <label class="text-sm font-bold text-[#051826]">Lejárat dátuma</label>
                                <input :value="loanEndDate" type="date" disabled
                                    class="w-full mt-1 border-2 border-[#051826]/30 rounded-xl px-4 py-3 font-bold text-[#051826]/60 bg-[#F7F8F0]" />
                            </div>

                            <div>
                                <label class="text-sm font-bold text-[#051826]">Kölcsönösszeg</label>
                                <input v-model="loanAmount" type="number" min="0"
                                    class="w-full mt-1 border-2 border-[#051826] rounded-xl px-4 py-3 font-bold text-[#051826]" />
                            </div>

                            <div>
                                <label class="text-sm font-bold text-[#051826]">Kamat (%)</label>
                                <input v-model="interestRate" type="number" min="0" step="0.1"
                                    class="w-full mt-1 border-2 border-[#051826] rounded-xl px-4 py-3 font-bold text-[#051826]" />
                            </div>

                            <div>
                                <label class="text-sm font-bold text-[#051826]">Megjegyzés</label>
                                <textarea v-model="note" rows="4"
                                    placeholder="Pl. helyszíni megállapodás alapján módosított összeg/kamat..."
                                    class="w-full mt-1 border-2 border-[#051826] rounded-xl px-4 py-3"></textarea>
                            </div>

                            <div class="flex gap-3 pt-3">
                                <button @click="goBack"
                                    class="border-2 border-[#051826] text-[#051826] hover:bg-[#051826] hover:text-white font-bold px-6 py-3 rounded-xl">
                                    Vissza
                                </button>

                                <button @click="createLoan" :disabled="creating"
                                    class="bg-[#051826] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold px-6 py-3 rounded-xl flex-1">
                                    {{ creating ? 'Létrehozás...' : 'Kölcsön létrehozása' }}
                                </button>
                            </div>
                        </div>
                    </div>

                </div>


                <div v-else class="bg-white border-2 border-red-400 rounded-3xl p-6 shadow-[6px_6px_0px_#ef4444]">
                    <p class="font-extrabold text-red-700">
                        Nincs kiválasztott ajánlat. Először olvass be egy offer kódot.
                    </p>
                </div>

            </div>
        </div>
    </div>
</template>
<style scoped></style>