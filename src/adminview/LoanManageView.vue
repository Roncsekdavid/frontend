<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AdminHeader from '../admincomponents/AdminHeader.vue'
import AdminMenu from '../admincomponents/AdminMenu.vue'
import { adminState } from '../adminstate/state'
import api from '../services/api'

const route = useRoute()
const router = useRouter()
const store = adminState()

const loan = ref(null)
const payments = ref([])
const isLoading = ref(true)

const toast = ref({ show: false, message: '', type: 'success' })

const activeModal = ref(null)
const defaultReason = ref('')
const isProcessing = ref(false)

const paymentAmount = ref('')
const paymentType = ref('REPAYMENT')
const paymentDate = ref(new Date().toISOString().split('T')[0])

const paymentTypes = [
    { value: 'REPAYMENT', label: 'Törlesztés' },
    { value: 'PENALTY', label: 'Büntetőkamat' },
    { value: 'EXTENSION_FEE', label: 'Hosszabbítási díj' },
    { value: 'FULL_PAYMENT', label: 'Teljes kifizetés' }
]

onMounted(async () => {
    await loadPageData()
})

async function loadPageData() {
    isLoading.value = true

    try {
        const loanId = route.params.id

        await store.getLoansFromApi()
        loan.value = store.getLoans().find(l => l.getId() == loanId)

        if (loan.value) {
            await fetchPayments()
        }
    } catch (error) {
        showToast('Nem sikerült betölteni a hitel adatait.', 'error')
    } finally {
        isLoading.value = false
    }
}

async function fetchPayments() {
    try {
        const { data } = await api.get(`/payments/loan/${loan.value.getId()}`)
        payments.value = data
    } catch (error) {
        payments.value = []
        console.error('[fetchPayments] Hiba:', error)
    }
}

function formatPrice(value) {
    return Number(value || 0).toLocaleString('hu-HU') + ' Ft'
}

function formatDate(date) {
    if (!date) return '—'
    return new Date(date).toLocaleDateString('hu-HU')
}

const principalAmount = computed(() => {
    return Number(loan.value?.getPrincipalAmount?.() || 0)
})

const interestRate = computed(() => {
    return Number(loan.value?.getInterestRate?.() || 0)
})

const penaltyInterestRate = computed(() => {
    if (typeof loan.value?.getPenaltyInterestRate === 'function') {
        return Number(loan.value.getPenaltyInterestRate() || 0)
    }

    return Number(loan.value?.penalty_interest_rate || 0)
})

const interestAmount = computed(() => {
    return Math.round(principalAmount.value * (interestRate.value / 100))
})

const penaltyAmount = computed(() => {
    return Math.round(principalAmount.value * (penaltyInterestRate.value / 100))
})

const totalDue = computed(() => {
    return principalAmount.value + interestAmount.value + penaltyAmount.value
})

const paidAmount = computed(() => {
    return payments.value.reduce((sum, payment) => {
        return sum + Number(payment.amount || 0)
    }, 0)
})

const remainingAmount = computed(() => {
    return Math.max(totalDue.value - paidAmount.value, 0)
})

const isFullyPaid = computed(() => {
    return remainingAmount.value <= 0
})

const statusColorClass = computed(() => {
    const status = loan.value?.getStatus()
    if (['OVERDUE', 'EXTENDED'].includes(status)) return 'text-yellow-500'
    if (status === 'ACTIVE') return 'text-blue-500'
    if (status === 'DEFAULTED') return 'text-red-500'
    if (['PAID', 'CLOSED'].includes(status)) return 'text-emerald-500'
    return 'text-gray-500'
})

const isLoanClosed = computed(() => {
    return ['CLOSED', 'DEFAULTED'].includes(loan.value?.getStatus())
})

const canExtend = computed(() => {
    return ['ACTIVE', 'OVERDUE', 'EXTENDED'].includes(loan.value?.getStatus())
})

const canDefault = computed(() => {
    return ['OVERDUE', 'EXTENDED'].includes(loan.value?.getStatus())
})

const canRegisterPayment = computed(() => {
    return ['ACTIVE', 'EXTENDED', 'OVERDUE'].includes(loan.value?.getStatus())
})

const canFullPay = computed(() => {
    return canRegisterPayment.value && remainingAmount.value > 0
})

const showToast = (message, type = 'success') => {
    toast.value = { show: true, message, type }
    setTimeout(() => {
        toast.value.show = false
    }, 3000)
}

function openPaymentModal() {
    if (!canRegisterPayment.value) {
        showToast('Ebben az állapotban nem rögzíthető befizetés.', 'error')
        return
    }

    paymentAmount.value = remainingAmount.value > 0 ? remainingAmount.value : ''
    paymentType.value = remainingAmount.value > 0 ? 'FULL_PAYMENT' : 'REPAYMENT'
    paymentDate.value = new Date().toISOString().split('T')[0]
    activeModal.value = 'payment'
}

async function confirmPayment() {
    if (!paymentAmount.value || Number(paymentAmount.value) <= 0) {
        showToast('Adj meg érvényes befizetési összeget!', 'error')
        return
    }

    if (!paymentDate.value) {
        showToast('A fizetés dátuma kötelező!', 'error')
        return
    }

    isProcessing.value = true

    try {
        const { data } = await api.post('/payments', {
            loan_id: loan.value.getId(),
            amount: Number(paymentAmount.value),
            payment_type: paymentType.value,
            payment_date: paymentDate.value
        })

        await fetchPayments()

        activeModal.value = null

        if (data.loan_closed) {
            showToast('A hitel teljesen ki lett fizetve és lezárásra került.')
            setTimeout(() => router.push('/admin/loans'), 1500)
        } else {
            showToast('Befizetés sikeresen rögzítve.')
            await loadPageData()
        }

    } catch (error) {
        const errorMsg = error.response?.data?.error || 'Hiba történt a befizetés rögzítésekor!'
        showToast(errorMsg, 'error')
    } finally {
        isProcessing.value = false
    }
}

async function confirmExtend() {
    isProcessing.value = true

    try {
        const currentDueDate = new Date(loan.value.getDueDate())
        currentDueDate.setDate(currentDueDate.getDate() + 30)

        const newDueDate = currentDueDate.toISOString().split('T')[0]

        await api.patch(`/loans/${loan.value.getId()}/extend`, {
            new_due_date: newDueDate,
            penalty_interest_rate: 5,
            note: loan.value.getNote?.() || null
        })

        showToast('Hitel sikeresen meghosszabbítva!')
        activeModal.value = null
        await loadPageData()
    } catch (error) {
        const errorMsg = error.response?.data?.error || 'Hiba történt a hosszabbítás során!'
        showToast(errorMsg, 'error')
    } finally {
        isProcessing.value = false
    }
}

async function confirmPaidClose() {
    if (!canFullPay.value) {
        showToast('Ez a hitel már nem fizethető vagy nincs hátralék.', 'error')
        activeModal.value = null
        return
    }

    isProcessing.value = true

    try {
        const { data } = await api.post('/payments', {
            loan_id: loan.value.getId(),
            amount: remainingAmount.value,
            payment_type: 'FULL_PAYMENT',
            payment_date: new Date().toISOString().split('T')[0]
        })

        if (data.loan_closed) {
            showToast('A teljes kifizetés rögzítve, a hitel lezárva.')
        } else {
            showToast('A teljes kifizetés rögzítve.')
        }

        activeModal.value = null
        setTimeout(() => router.push('/admin/loans'), 1500)

    } catch (error) {
        const errorMsg = error.response?.data?.error || 'Hiba történt a kifizetés rögzítésekor!'
        showToast(errorMsg, 'error')
    } finally {
        isProcessing.value = false
    }
}

async function confirmDefaultClose() {
    if (!defaultReason.value.trim()) {
        showToast('A bedőlés indoklása kötelező!', 'error')
        return
    }

    isProcessing.value = true

    try {
        await api.patch(`/loans/${loan.value.getId()}/default`, {
            reason: defaultReason.value.trim()
        })

        showToast('A hitelt bedőltnek nyilvánítottuk.')
        activeModal.value = null
        setTimeout(() => router.push('/admin/loans'), 1500)
    } catch (error) {
        const errorMsg = error.response?.data?.error || 'Hiba történt a mentés során!'
        showToast(errorMsg, 'error')
    } finally {
        isProcessing.value = false
    }
}
</script>

<template>
    <div class="grid grid-cols-6 min-h-screen relative">
        <AdminMenu />

        <div class="w-full bg-[#F7F8F0] col-span-6 md:col-span-4 lg:col-span-5 p-6 relative">
            <AdminHeader />

            <div v-if="!isLoading && loan" class="max-w-5xl mx-auto mt-8 p-4">

                <div class="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
                    <div>
                        <button @click="router.back()"
                            class="text-sm font-black text-[#051826]/40 uppercase tracking-widest hover:text-[#051826] transition-all flex items-center gap-2 mb-2">
                            <i class="bi bi-arrow-left"></i> Vissza a listához
                        </button>
                        <h2 class="text-4xl font-black text-[#051826]">Hitelkezelés</h2>
                    </div>

                    <div
                        class="flex items-center gap-3 bg-white border-4 border-[#051826] p-4 rounded-2xl shadow-[4px_4px_0px_#051826]">
                        <span class="font-black text-[#051826]/50 uppercase text-xs">Státusz:</span>
                        <span :class="['font-black uppercase', statusColorClass]">
                            {{ loan.getStatus() }}
                        </span>
                    </div>
                </div>

                <div
                    class="bg-white border-4 border-[#051826] rounded-[2.5rem] p-8 shadow-[10px_10px_0px_#051826] mb-10">
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div>
                            <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Hitelösszeg
                            </p>
                            <p class="text-3xl font-black text-[#051826]">{{ formatPrice(principalAmount) }}</p>
                        </div>
                        <div>
                            <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Futamidő</p>
                            <p class="text-3xl font-black text-[#051826]">{{ loan.getDurationMonths() }} hónap</p>
                        </div>
                        <div>
                            <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Kamatláb</p>
                            <p class="text-3xl font-black text-blue-500">{{ interestRate }}%</p>
                        </div>
                        <div>
                            <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Lejárat
                                dátuma</p>
                            <p class="text-3xl font-black text-red-500">{{ loan.getDueDate() }}</p>
                        </div>
                    </div>

                    <hr class="my-8 border-2 border-gray-100">

                    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                        <div class="bg-gray-50 border-2 border-gray-100 rounded-2xl p-4">
                            <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Teljes
                                fizetendő</p>
                            <p class="text-xl font-black text-[#051826]">{{ formatPrice(totalDue) }}</p>
                        </div>

                        <div class="bg-gray-50 border-2 border-gray-100 rounded-2xl p-4">
                            <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Eddig fizetve
                            </p>
                            <p class="text-xl font-black text-emerald-600">{{ formatPrice(paidAmount) }}</p>
                        </div>

                        <div class="bg-gray-50 border-2 border-gray-100 rounded-2xl p-4">
                            <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Hátralék</p>
                            <p class="text-xl font-black text-red-500">{{ formatPrice(remainingAmount) }}</p>
                        </div>

                        <div class="bg-gray-50 border-2 border-gray-100 rounded-2xl p-4">
                            <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Büntetőkamat
                            </p>
                            <p class="text-xl font-black text-yellow-500">{{ penaltyInterestRate }}%</p>
                        </div>
                    </div>

                    <div>
                        <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Megjegyzés a
                            hitelhez</p>
                        <p class="font-bold text-[#051826] italic text-lg">
                            {{ loan.getNote() || 'Nincs rögzített megjegyzés.' }}
                        </p>
                    </div>
                </div>

                <div class="bg-white border-4 border-[#051826] rounded-[2rem] p-8 shadow-[8px_8px_0px_#051826] mb-10">
                    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                        <div>
                            <h3 class="text-2xl font-black text-[#051826]">Befizetések</h3>
                            <p class="text-sm font-bold text-gray-400">A hitelhez rögzített fizetések listája.</p>
                        </div>

                        <button @click="openPaymentModal" :disabled="!canRegisterPayment" :class="[
                            'font-black px-6 py-3 rounded-xl border-4 border-[#051826] uppercase tracking-widest text-xs transition-all',
                            canRegisterPayment
                                ? 'bg-[#E5B326] hover:bg-[#d0a01e] text-[#051826] shadow-[4px_4px_0px_#051826] active:translate-y-1 active:shadow-none'
                                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        ]">
                            Befizetés rögzítése
                        </button>
                    </div>

                    <div v-if="payments.length" class="space-y-3">
                        <div v-for="payment in payments" :key="payment.id"
                            class="grid grid-cols-1 md:grid-cols-4 gap-3 bg-gray-50 border-2 border-gray-100 rounded-2xl p-4">
                            <div>
                                <p class="text-[10px] font-black text-gray-400 uppercase">Összeg</p>
                                <p class="font-black text-[#051826]">{{ formatPrice(payment.amount) }}</p>
                            </div>

                            <div>
                                <p class="text-[10px] font-black text-gray-400 uppercase">Típus</p>
                                <p class="font-black text-[#051826]">{{ payment.payment_type }}</p>
                            </div>

                            <div>
                                <p class="text-[10px] font-black text-gray-400 uppercase">Dátum</p>
                                <p class="font-black text-[#051826]">{{ formatDate(payment.payment_date) }}</p>
                            </div>

                            <div>
                                <p class="text-[10px] font-black text-gray-400 uppercase">Azonosító</p>
                                <p class="font-black text-[#051826]">#{{ payment.id }}</p>
                            </div>
                        </div>
                    </div>

                    <div v-else class="bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center">
                        <i class="bi bi-credit-card text-4xl text-gray-300"></i>
                        <p class="font-black text-gray-400 uppercase text-sm mt-3">Még nincs rögzített befizetés</p>
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-8">

                    <div
                        class="bg-white border-4 border-[#051826] rounded-[2rem] p-8 shadow-[8px_8px_0px_#051826] flex flex-col">
                        <div
                            class="w-14 h-14 bg-blue-100 border-2 border-[#051826] rounded-2xl flex items-center justify-center mb-6">
                            <i class="bi bi-calendar2-week text-2xl text-blue-600"></i>
                        </div>
                        <h4 class="text-xl font-black mb-2">Hosszabbítás</h4>
                        <p class="text-gray-500 text-sm font-medium mb-8 flex-grow">
                            Az ügyfél kérésére a futamidő 30 nappal kitolható.
                        </p>
                        <button @click="canExtend ? activeModal = 'extend' : null" :disabled="!canExtend" :class="[
                            'w-full font-black py-4 rounded-xl border-4 border-[#051826] transition-all uppercase tracking-widest text-xs',
                            canExtend
                                ? 'bg-blue-500 hover:bg-blue-600 text-white shadow-[4px_4px_0px_#051826] active:translate-y-1 active:shadow-none'
                                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        ]">
                            Hosszabbítás (30 nap)
                        </button>
                    </div>

                    <div
                        class="bg-white border-4 border-[#051826] rounded-[2rem] p-8 shadow-[8px_8px_0px_#051826] flex flex-col">
                        <div
                            class="w-14 h-14 bg-emerald-100 border-2 border-[#051826] rounded-2xl flex items-center justify-center mb-6">
                            <i class="bi bi-check2-circle text-2xl text-emerald-600"></i>
                        </div>
                        <h4 class="text-xl font-black mb-2">Teljes kifizetés</h4>
                        <p class="text-gray-500 text-sm font-medium mb-8 flex-grow">
                            A fennmaradó tartozás egy összegben kerül rögzítésre, majd a hitel lezárul.
                        </p>
                        <button @click="canFullPay ? activeModal = 'paid' : null" :disabled="!canFullPay" :class="[
                            'w-full font-black py-4 rounded-xl border-4 border-[#051826] transition-all uppercase tracking-widest text-xs',
                            canFullPay
                                ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-[4px_4px_0px_#051826] active:translate-y-1 active:shadow-none'
                                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        ]">
                            Teljes kifizetés rögzítése
                        </button>
                    </div>

                    <div
                        class="bg-white border-4 border-[#051826] rounded-[2rem] p-8 shadow-[8px_8px_0px_#051826] flex flex-col">
                        <div
                            :class="['w-14 h-14 border-2 border-[#051826] rounded-2xl flex items-center justify-center mb-6', canDefault ? 'bg-red-100' : 'bg-gray-100 opacity-50']">
                            <i
                                :class="['bi bi-shield-exclamation text-2xl', canDefault ? 'text-red-600' : 'text-gray-500']"></i>
                        </div>
                        <h4 class="text-xl font-black mb-2">Hitelszegés</h4>
                        <p class="text-gray-500 text-sm font-medium mb-4 flex-grow">
                            Az ügyfél nem fizetett. A tárgyat értékesítésre kell bocsátani.
                        </p>

                        <div class="mt-auto">
                            <p v-if="!canDefault"
                                class="text-[10px] text-red-500 font-bold uppercase tracking-widest mb-2 text-center bg-red-50 py-1 rounded">
                                Csak lejárt/hosszabbított hitelnél!
                            </p>
                            <button @click="canDefault ? activeModal = 'default' : null" :disabled="!canDefault"
                                :class="['w-full font-black py-4 rounded-xl border-4 border-[#051826] uppercase tracking-widest text-xs transition-all',
                                    canDefault ? 'bg-red-500 hover:bg-red-600 text-white shadow-[4px_4px_0px_#051826] active:translate-y-1 active:shadow-none' : 'bg-gray-200 text-gray-400 cursor-not-allowed']">
                                Nem fizetett / Bukott
                            </button>
                        </div>
                    </div>

                </div>
            </div>

            <div v-else class="flex flex-col items-center justify-center h-[70vh]">
                <div class="w-16 h-16 border-8 border-gray-200 border-t-[#051826] rounded-full animate-spin mb-4"></div>
                <p class="font-black text-[#051826] uppercase tracking-tighter">Adatok betöltése...</p>
            </div>
        </div>

        <div v-if="activeModal"
            class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#051826]/40 backdrop-blur-sm">
            <div
                class="bg-white border-4 border-[#051826] rounded-[2rem] p-8 max-w-md w-full shadow-[12px_12px_0px_#051826] animate-popIn">

                <template v-if="activeModal === 'payment'">
                    <h3 class="text-2xl font-black text-[#051826] mb-4">Befizetés rögzítése</h3>

                    <div class="mb-4">
                        <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                            Befizetett összeg
                        </label>
                        <input v-model="paymentAmount" type="number" min="1"
                            class="w-full border-4 border-[#051826] rounded-xl p-3 font-black focus:outline-none focus:border-[#E5B326]" />
                    </div>

                    <div class="mb-4">
                        <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                            Fizetés típusa
                        </label>
                        <select v-model="paymentType"
                            class="w-full border-4 border-[#051826] rounded-xl p-3 font-black focus:outline-none focus:border-[#E5B326]">
                            <option v-for="type in paymentTypes" :key="type.value" :value="type.value">
                                {{ type.label }}
                            </option>
                        </select>
                    </div>

                    <div class="mb-6">
                        <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                            Fizetés dátuma
                        </label>
                        <input v-model="paymentDate" type="date"
                            class="w-full border-4 border-[#051826] rounded-xl p-3 font-black focus:outline-none focus:border-[#E5B326]" />
                    </div>

                    <div class="bg-gray-50 rounded-xl p-4 border-2 border-gray-100 mb-6">
                        <p class="text-xs font-black text-gray-400 uppercase">Hátralék</p>
                        <p class="text-2xl font-black text-red-500">{{ formatPrice(remainingAmount) }}</p>
                    </div>

                    <div class="flex gap-4">
                        <button @click="activeModal = null"
                            class="flex-1 bg-gray-200 hover:bg-gray-300 font-black py-3 border-4 border-[#051826] rounded-xl transition-all">
                            Mégse
                        </button>
                        <button @click="confirmPayment" :disabled="isProcessing"
                            class="flex-1 bg-[#E5B326] hover:bg-[#d0a01e] text-[#051826] font-black py-3 border-4 border-[#051826] rounded-xl shadow-[4px_4px_0px_#051826] transition-all">
                            Mentés
                        </button>
                    </div>
                </template>

                <template v-if="activeModal === 'extend'">
                    <h3 class="text-2xl font-black text-[#051826] mb-4">Hosszabbítás megerősítése</h3>
                    <p class="text-gray-600 font-medium mb-8">
                        Biztosan meghosszabbítod a hitelt 30 nappal?
                    </p>
                    <div class="flex gap-4">
                        <button @click="activeModal = null"
                            class="flex-1 bg-gray-200 hover:bg-gray-300 font-black py-3 border-4 border-[#051826] rounded-xl transition-all">
                            Mégse
                        </button>
                        <button @click="confirmExtend" :disabled="isProcessing"
                            class="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-black py-3 border-4 border-[#051826] rounded-xl shadow-[4px_4px_0px_#051826] transition-all">
                            Megerősítés
                        </button>
                    </div>
                </template>

                <template v-if="activeModal === 'paid'">
                    <h3 class="text-2xl font-black text-emerald-600 mb-4">Kifizetés rögzítése</h3>
                    <p class="text-gray-600 font-medium mb-8">
                        Biztosan rögzíted a teljes visszafizetést? Hátralék: <strong>{{ formatPrice(remainingAmount)
                            }}</strong>
                    </p>
                    <div class="flex gap-4">
                        <button @click="activeModal = null"
                            class="flex-1 bg-gray-200 hover:bg-gray-300 font-black py-3 border-4 border-[#051826] rounded-xl transition-all">
                            Mégse
                        </button>
                        <button @click="confirmPaidClose" :disabled="isProcessing"
                            class="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-black py-3 border-4 border-[#051826] rounded-xl shadow-[4px_4px_0px_#051826] transition-all">
                            Igen, kifizetve
                        </button>
                    </div>
                </template>

                <template v-if="activeModal === 'default'">
                    <h3 class="text-2xl font-black text-red-600 mb-2">Birtokbavétel rögzítése</h3>
                    <p class="text-gray-600 font-bold mb-6 text-sm">
                        FIGYELEM: Ez a hitel bukottnak lesz nyilvánítva. A zálogtárgy értékesítésre kerül!
                    </p>

                    <div class="mb-6">
                        <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                            Bedőlés oka <span class="text-red-500">*</span>
                        </label>
                        <textarea v-model="defaultReason" rows="3" placeholder="Pl: Nem jelent meg, nem érhető el..."
                            class="w-full border-4 border-[#051826] rounded-xl p-3 font-medium focus:outline-none focus:border-red-500 resize-none"></textarea>
                    </div>

                    <div class="flex gap-4">
                        <button @click="activeModal = null"
                            class="flex-1 bg-gray-200 hover:bg-gray-300 font-black py-3 border-4 border-[#051826] rounded-xl transition-all">
                            Mégse
                        </button>
                        <button @click="confirmDefaultClose" :disabled="isProcessing"
                            class="flex-1 bg-red-500 hover:bg-red-600 text-white font-black py-3 border-4 border-[#051826] rounded-xl shadow-[4px_4px_0px_#051826] transition-all">
                            Bedöntés
                        </button>
                    </div>
                </template>
            </div>
        </div>

        <div v-if="toast.show" :class="['fixed bottom-8 right-8 z-50 border-4 border-[#051826] rounded-xl p-4 shadow-[6px_6px_0px_#051826] flex items-center gap-3 animate-slideIn',
            toast.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700']">
            <i :class="toast.type === 'error' ? 'bi bi-exclamation-triangle-fill' : 'bi bi-check-circle-fill'"></i>
            <span class="font-black tracking-wide">{{ toast.message }}</span>
        </div>

    </div>
</template>

<style scoped>
.max-w-5xl {
    animation: slideUp 0.5s ease-out;
}

.animate-popIn {
    animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
}

.animate-slideIn {
    animation: slideIn 0.4s ease-out forwards;
}

@keyframes slideUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes popIn {
    from {
        opacity: 0;
        transform: scale(0.9);
    }

    to {
        opacity: 1;
        transform: scale(1);
    }
}

@keyframes slideIn {
    from {
        opacity: 0;
        transform: translateX(100%);
    }

    to {
        opacity: 1;
        transform: translateX(0);
    }
}
</style>