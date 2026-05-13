<script setup>
import { onMounted, ref, watch, computed } from 'vue';
import { useAuthStore } from '../state/stateAuth';
import { useDarkModeStore } from '../state/stateDarkMode';
import { useCurrencyStore, CURRENCIES } from '../state/stateCurrency';
import { useFavoritesStore } from '../state/stateFavorites';

const auth = useAuthStore();
const darkModeStore = useDarkModeStore();
const currencyStore = useCurrencyStore();
const favoritesStore = useFavoritesStore();

const isSaving = ref(false);
const error = ref('');
const showSuccessModal = ref(false);

const name = ref('');
const email = ref('');
const phone = ref('');

const originalName = ref('');
const originalPhone = ref('');
const originalCategories = ref([]);

const nameDirty = computed(() => name.value !== originalName.value);
const phoneDirty = computed(() => phone.value !== originalPhone.value);
const categoriesDirty = computed(() => {
    const current = categories.value.filter(c => c.selected).map(c => c.name).sort().join(',');
    const original = [...originalCategories.value].sort().join(',');
    return current !== original;
});

const currency = computed({
    get: () => currencyStore.selectedCode,
    set: (val) => currencyStore.setCurrency(val),
});

const categories = ref([
    { name: 'Ékszer & Arany', icon: 'bi-gem', selected: false },
    { name: 'Órák', icon: 'bi-watch', selected: false },
    { name: 'Műtárgyak', icon: 'bi-palette-fill', selected: false },
    { name: 'Elektronika', icon: 'bi-cpu-fill', selected: false },
    { name: 'Háztartási gépek', icon: 'bi-house-gear-fill', selected: false },
    { name: 'Hétköznapi cikkek', icon: 'bi-box-seam-fill', selected: false },
    { name: 'Hangszerek', icon: 'bi-music-note-beamed', selected: false },
    { name: 'Jármű', icon: 'bi-car-front-fill', selected: false },
    { name: 'Szerszámgépek', icon: 'bi-tools', selected: false },
    { name: 'Játékkonzolok', icon: 'bi-controller', selected: false },
    { name: 'Bútorok', icon: 'bi-lamp-fill', selected: false },
    { name: 'Sporteszközök', icon: 'bi-bicycle', selected: false }
]);

watch(phone, (newValue) => {
    let x = newValue.replace(/\D/g, '').match(/(\d{0,2})(\d{0,2})(\d{0,3})(\d{0,4})/);
    if (!x[1]) {
        phone.value = '';
    } else {
        phone.value = !x[2] ? '+' + x[1] : '+' + x[1] + ' ' + x[2] + (x[3] ? ' ' + x[3] : '') + (x[4] ? ' ' + x[4] : '');
    }
});

const validateForm = () => {
    const nameRegex = /^[a-zA-Z\u00C0-\u017F\s]+$/;
    if (!nameRegex.test(name.value) || name.value.trim().split(' ').length < 2) {
        error.value = 'Kérjük adjon meg érvényes nevet! (Vezetéknév Keresztnév)';
        return false;
    }
    const cleanPhone = phone.value.replace(/\s/g, '');
    if (cleanPhone.length < 12) {
        error.value = 'A telefonszám túl rövid!';
        return false;
    }
    return true;
};

const handleSave = async () => {
    error.value = '';
    if (!validateForm()) return;

    isSaving.value = true;

    const payload = {
        name: name.value,
        phone: phone.value,
        currency: currencyStore.selectedCode,
        favorites: categories.value.filter(c => c.selected).map(c => c.name)
    };

    const result = await auth.updateUser(payload);
    isSaving.value = false;

    if (result.success) {
        favoritesStore.setFavorites(categories.value.filter(c => c.selected).map(c => c.name));
        originalName.value = name.value;
        originalPhone.value = phone.value;
        originalCategories.value = categories.value.filter(c => c.selected).map(c => c.name);
        showSuccessModal.value = true;
    } else {
        error.value = 'Hiba történt a mentés során.';
    }
};

onMounted(async () => {
    await auth.fetchUser();

    if (auth.user) {
        name.value = auth.user.getName();
        email.value = auth.user.getEmail();
        phone.value = auth.user.getPhone();

        originalName.value = auth.user.getName();
        originalPhone.value = auth.user.getPhone();

        if (auth.user.currency && auth.user.currency !== currencyStore.selectedCode) {
            await currencyStore.setCurrency(auth.user.currency);
        }

        const favorites = favoritesStore.favoriteCategories;
        if (favorites.length > 0) {
            categories.value.forEach(cat => {
                cat.selected = favorites.includes(cat.name);
            });
            originalCategories.value = [...favorites];
        }
    }
});
</script>

<template>
    <div
        class="bg-white dark:bg-[#26211E] border-2 border-[#4A2E23] dark:border-[#E5B326] rounded-[30px] md:rounded-[40px] p-6 md:p-10 shadow-[8px_8px_0px_#4A2E23] dark:shadow-[8px_8px_0px_#E5B326] transition-colors">

        <h2 class="text-2xl md:text-3xl font-black text-[#4A2E23] dark:text-[#E5B326] uppercase mb-8 flex items-center">
            <i class="bi bi-person-gear mr-3 md:mr-4 text-[#E5B326]"></i> Profilbeállítások
        </h2>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">

            <div class="space-y-5 md:space-y-6">

                <div class="space-y-2">
                    <label
                        class="block font-bold text-[#4A2E23] dark:text-[#FBF5E9] ml-1 text-sm md:text-base flex items-center gap-2">
                        Teljes név
                        <span v-if="nameDirty"
                            class="text-[10px] font-black text-[#4A2E23] bg-[#E5B326] px-2 py-0.5 rounded-full uppercase tracking-wide">Mentés
                            szükséges</span>
                    </label>
                    <input type="text" v-model="name"
                        class="w-full border-2 border-gray-200 dark:border-[#E5B326]/30 rounded-2xl px-4 py-3 focus:border-[#E5B326] outline-none transition-all font-semibold bg-white dark:bg-[#1A1614] text-[#4A2E23] dark:text-[#FBF5E9]" />
                </div>

                <div class="space-y-2 relative">
                    <label class="block font-bold text-[#4A2E23] dark:text-[#FBF5E9] ml-1 text-sm md:text-base">Email
                        cím (nem módosítható)</label>
                    <div class="relative">
                        <input type="email" v-model="email" readonly
                            class="w-full border-2 border-gray-100 dark:border-[#E5B326]/10 bg-gray-50 dark:bg-[#1A1614]/60 text-gray-400 dark:text-[#D4C7B0]/50 rounded-2xl px-4 py-3 cursor-not-allowed font-semibold outline-none" />
                        <i
                            class="bi bi-lock-fill absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-[#D4C7B0]/40"></i>
                    </div>
                </div>

                <div class="space-y-2">
                    <label
                        class="block font-bold text-[#4A2E23] dark:text-[#FBF5E9] ml-1 text-sm md:text-base flex items-center gap-2">
                        Telefonszám
                        <span v-if="phoneDirty"
                            class="text-[10px] font-black text-[#4A2E23] bg-[#E5B326] px-2 py-0.5 rounded-full uppercase tracking-wide">Mentés
                            szükséges</span>
                    </label>
                    <input type="text" v-model="phone"
                        class="w-full border-2 rounded-2xl px-4 py-3 focus:border-[#E5B326] outline-none transition-all font-semibold bg-white dark:bg-[#1A1614] text-[#4A2E23] dark:text-[#FBF5E9]"
                        :class="phone && phone.replace(/\s/g, '').length < 12 ? 'border-red-400 dark:border-red-500' : 'border-gray-200 dark:border-[#E5B326]/30'" />
                    <p v-if="phone && phone.replace(/\s/g, '').length < 12"
                        class="text-xs font-bold text-red-500 ml-1 flex items-center gap-1">
                        <i class="bi bi-exclamation-circle-fill"></i>
                        A telefonszám túl rövid!
                    </p>
                </div>

                <div class="space-y-2">
                    <label
                        class="block font-bold text-[#4A2E23] dark:text-[#FBF5E9] ml-1 text-sm md:text-base">Valuta</label>
                    <div class="relative">
                        <select v-model="currency"
                            class="w-full border-2 border-gray-200 dark:border-[#E5B326]/30 rounded-2xl px-4 py-3 focus:border-[#E5B326] outline-none appearance-none bg-white dark:bg-[#1A1614] text-[#4A2E23] dark:text-[#FBF5E9] font-semibold transition-colors">
                            <option v-for="cur in CURRENCIES" :key="cur.code" :value="cur.code">
                                {{ cur.code }} - {{ cur.label }}
                            </option>
                        </select>
                        <i
                            class="bi bi-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-[#D4C7B0]/60 pointer-events-none"></i>
                    </div>
                </div>

                <div
                    class="flex items-center justify-between p-5 bg-gray-50 dark:bg-[#1A1614] rounded-2xl border-2 border-[#4A2E23]/10 dark:border-[#E5B326]/20 transition-colors">
                    <div class="flex items-center gap-3">
                        <i class="bi text-xl"
                            :class="darkModeStore.isDark ? 'bi-moon-stars-fill text-[#E5B326]' : 'bi-sun-fill text-[#E5B326]'"></i>
                        <span class="font-bold text-[#4A2E23] dark:text-[#FBF5E9]">
                            {{ darkModeStore.isDark ? 'Sötét mód' : 'Világos mód' }}
                        </span>
                    </div>
                    <button @click="darkModeStore.toggle()"
                        class="w-14 h-7 rounded-full transition-all relative border-2 border-[#4A2E23] dark:border-[#E5B326]"
                        :class="darkModeStore.isDark ? 'bg-[#4A2E23]' : 'bg-gray-200'">
                        <div class="absolute top-0.5 transition-all duration-300 w-5 h-5 rounded-full bg-white shadow-md"
                            :style="{ left: darkModeStore.isDark ? '1.65rem' : '0.15rem' }"></div>
                    </button>
                </div>
            </div>

            <div class="space-y-4">
                <label
                    class="block font-bold text-[#4A2E23] dark:text-[#FBF5E9] ml-1 text-sm md:text-base flex items-center gap-2">
                    Kedvenc kategóriák
                    <span v-if="categoriesDirty"
                        class="text-[10px] font-black text-[#4A2E23] bg-[#E5B326] px-2 py-0.5 rounded-full uppercase tracking-wide">Mentés
                        szükséges</span>
                </label>
                <div
                    class="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-2 p-3 bg-gray-50 dark:bg-[#1A1614] rounded-[25px] border-2 border-[#4A2E23]/10 dark:border-[#E5B326]/20 transition-colors">
                    <div v-for="cat in categories" :key="cat.name" @click="cat.selected = !cat.selected"
                        class="flex flex-col items-center justify-center p-2 rounded-xl border-2 transition-all cursor-pointer text-center group"
                        :class="cat.selected
                            ? 'border-[#E5B326] bg-[#E5B326]/10'
                            : 'bg-white dark:bg-[#26211E] border-gray-100 dark:border-[#E5B326]/10 hover:border-[#E5B326]/50'">
                        <i
                            :class="['bi', cat.icon, 'text-xl mb-1 transition-transform group-hover:scale-110', cat.selected ? 'text-[#E5B326]' : 'text-gray-400 dark:text-[#D4C7B0]/50']"></i>
                        <span
                            class="text-[11px] md:text-[12px] font-black leading-tight text-[#4A2E23] dark:text-[#FBF5E9] uppercase">
                            {{ cat.name }}
                        </span>
                        <input type="checkbox" v-model="cat.selected" class="hidden" />
                    </div>
                </div>
            </div>
        </div>

        <div v-if="error"
            class="mt-5 bg-red-50 dark:bg-red-500/10 border-2 border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 p-3 rounded-2xl text-xs font-bold text-center animate-shake">
            {{ error }}
        </div>

        <div class="mt-10 md:mt-12 flex justify-center">
            <button @click="handleSave" :disabled="isSaving"
                class="w-full md:w-auto bg-[#E5B326] hover:bg-[#d0a01e] disabled:opacity-50 text-[#4A2E23] font-black px-16 py-4 rounded-full transition-all shadow-[0px_4px_0px_#a9841c] active:shadow-none active:translate-y-1 uppercase tracking-wider">
                <span v-if="!isSaving">Beállítások mentése</span>
                <span v-else><i class="bi bi-arrow-repeat animate-spin mr-2"></i> Mentés...</span>
            </button>
        </div>
    </div>

    <Transition name="modal">
        <div v-if="showSuccessModal" class="fixed inset-0 z-50 flex items-center justify-center p-4"
            @click.self="showSuccessModal = false">
            <div class="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
            <div
                class="relative bg-white dark:bg-[#26211E] border-2 border-[#4A2E23] dark:border-[#E5B326] rounded-[40px] p-10 shadow-[8px_8px_0px_#4A2E23] dark:shadow-[8px_8px_0px_#E5B326] max-w-sm w-full text-center space-y-6 transition-colors">
                <div class="relative inline-block">
                    <div class="bg-[#E5B326] w-24 h-24 rounded-full flex items-center justify-center mx-auto shadow-lg">
                        <i class="bi bi-person-check-fill text-white text-5xl"></i>
                    </div>
                    <div
                        class="absolute -top-1 -right-1 bg-green-500 w-8 h-8 rounded-full border-4 border-white dark:border-[#26211E] flex items-center justify-center">
                        <i class="bi bi-check text-white font-bold"></i>
                    </div>
                </div>
                <div class="space-y-2">
                    <h3 class="text-2xl font-black text-[#4A2E23] dark:text-[#E5B326] uppercase">Mentve!</h3>
                    <p class="text-[#4A2E23]/70 dark:text-[#D4C7B0] font-medium">
                        A profiladataid sikeresen frissítve lettek.
                    </p>
                </div>
                <button @click="showSuccessModal = false"
                    class="w-full bg-[#E5B326] hover:bg-[#d0a01e] text-[#4A2E23] font-black py-4 rounded-full transition-all shadow-[0px_4px_0px_#a9841c] active:shadow-none active:translate-y-1 uppercase tracking-wider">
                    Rendben
                </button>
            </div>
        </div>
    </Transition>
</template>

<style scoped>
.animate-shake {
    animation: shake 0.5s cubic-bezier(.36, .07, .19, .97) both;
}

@keyframes shake {

    10%,
    90% {
        transform: translate3d(-1px, 0, 0);
    }

    20%,
    80% {
        transform: translate3d(2px, 0, 0);
    }

    30%,
    50%,
    70% {
        transform: translate3d(-4px, 0, 0);
    }

    40%,
    60% {
        transform: translate3d(4px, 0, 0);
    }
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

.animate-spin {
    display: inline-block;
    animation: spin 0.8s linear infinite;
}
</style>