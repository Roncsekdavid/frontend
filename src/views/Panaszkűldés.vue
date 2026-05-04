<script setup>
import { ref } from 'vue';
import MainHeader from '../components/MainHeader.vue';
import Footer from '../components/Footer.vue';

const subject = ref('');
const message = ref('');
const category = ref('altalanos');
const isSubmitting = ref(false);
const showSuccessModal = ref(false);
const categories = [
    { value: 'altalanos', label: 'Általános kérdés' },
    { value: 'zalog', label: 'Zálogtárggyal kapcsolatos' },
    { value: 'penzugy', label: 'Kifizetés / Pénzügy' },
    { value: 'technikai', label: 'Technikai hiba' }
];

const submitComplaint = () => {
    isSubmitting.value = true;

    setTimeout(() => {
        isSubmitting.value = false;
        showSuccessModal.value = true;

        subject.value = '';
        message.value = '';
        category.value = 'altalanos';
    }, 1500);
};

const closeGreeting = () => {
    showSuccessModal.value = false;
};
</script>

<template>
    <div class="min-h-screen bg-gray-50 dark:bg-[#1A1614] flex flex-col relative transition-colors">
        <MainHeader />

        <main class="flex-grow flex items-center justify-center p-4 md:p-8">
            <section
                class="w-full max-w-2xl bg-white dark:bg-[#26211E] border-4 border-[#4A2E23] dark:border-[#E5B326] rounded-[40px] p-6 md:p-12 shadow-[12px_12px_0px_#4A2E23] dark:shadow-[12px_12px_0px_#E5B326] overflow-hidden transition-colors">

                <div class="text-center mb-8">
                    <div
                        class="inline-flex items-center justify-center w-16 h-16 bg-[#E5B326] rounded-full mb-4 border-2 border-[#4A2E23] dark:border-[#E5B326]">
                        <i class="bi bi-chat-left-dots-fill text-2xl text-[#4A2E23]"></i>
                    </div>
                    <h2 class="text-3xl font-black text-[#4A2E23] dark:text-[#E5B326] uppercase tracking-tight">Panaszbeküldés</h2>
                    <p class="text-[#4A2E23]/60 dark:text-[#D4C7B0]/70 font-bold text-sm mt-1">
                        Mindent megteszünk, hogy orvosoljuk a problémát!
                    </p>
                </div>

                <form @submit.prevent="submitComplaint" class="space-y-6">

                    <div class="space-y-2">
                        <label class="block font-black text-[#4A2E23] dark:text-[#FBF5E9] uppercase text-xs ml-1">Téma kategóriája</label>
                        <div class="relative">
                            <select v-model="category"
                                class="w-full border-2 border-gray-200 dark:border-[#E5B326]/30 rounded-2xl px-4 py-4 focus:border-[#E5B326] outline-none appearance-none bg-white dark:bg-[#1A1614] font-bold text-[#4A2E23] dark:text-[#FBF5E9] transition-colors">
                                <option v-for="cat in categories" :key="cat.value" :value="cat.value">
                                    {{ cat.label }}
                                </option>
                            </select>
                            <i class="bi bi-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-[#4A2E23] dark:text-[#D4C7B0] pointer-events-none"></i>
                        </div>
                    </div>

                    <div class="space-y-2">
                        <label class="block font-black text-[#4A2E23] dark:text-[#FBF5E9] uppercase text-xs ml-1">Rövid tárgy</label>
                        <input type="text" v-model="subject" required
                            placeholder="Pl.: Sérült csomag, Késő kifizetés..."
                            class="w-full border-2 border-gray-200 dark:border-[#E5B326]/30 rounded-2xl px-4 py-4 focus:border-[#E5B326] outline-none transition-all font-bold text-[#4A2E23] dark:text-[#FBF5E9] placeholder:text-gray-300 dark:placeholder:text-[#D4C7B0]/30 bg-white dark:bg-[#1A1614]" />
                    </div>

                    <div class="space-y-2">
                        <label class="block font-black text-[#4A2E23] dark:text-[#FBF5E9] uppercase text-xs ml-1">Részletes leírás</label>
                        <textarea v-model="message" required rows="5"
                            placeholder="Kérjük írja le pontosan mi történt..."
                            class="w-full border-2 border-gray-200 dark:border-[#E5B326]/30 rounded-[25px] px-4 py-4 focus:border-[#E5B326] outline-none transition-all font-bold text-[#4A2E23] dark:text-[#FBF5E9] placeholder:text-gray-300 dark:placeholder:text-[#D4C7B0]/30 resize-none bg-white dark:bg-[#1A1614]"></textarea>
                    </div>

                    <div
                        class="flex items-center gap-4 p-4 bg-gray-50 dark:bg-[#1A1614] rounded-2xl border-2 border-dashed border-gray-300 dark:border-[#E5B326]/30 hover:border-[#E5B326] dark:hover:border-[#E5B326] transition-colors cursor-pointer group">
                        <i class="bi bi-paperclip text-2xl text-gray-400 dark:text-[#D4C7B0]/50 group-hover:text-[#E5B326]"></i>
                        <span class="text-xs font-bold text-gray-400 dark:text-[#D4C7B0]/50 group-hover:text-[#4A2E23] dark:group-hover:text-[#FBF5E9]">
                            Kép vagy dokumentum csatolása (opcionális)
                        </span>
                    </div>

                    <button type="submit" :disabled="isSubmitting"
                        class="w-full bg-[#E5B326] hover:bg-[#d0a01e] disabled:opacity-50 text-[#4A2E23] font-black py-5 rounded-full transition-all shadow-[0px_6px_0px_#a9841c] active:shadow-none active:translate-y-1 uppercase tracking-widest text-lg">
                        <span v-if="!isSubmitting">Panasz benyújtása</span>
                        <span v-else class="flex items-center justify-center text-base">
                            <i class="bi bi-arrow-repeat animate-spin mr-2"></i> Küldés folyamatban...
                        </span>
                    </button>
                </form>
            </section>
        </main>

        <Footer />

        <div v-if="showSuccessModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div @click="closeGreeting"
                class="absolute inset-0 bg-[#4A2E23]/60 dark:bg-black/60 backdrop-blur-sm transition-opacity">
            </div>

            <div
                class="relative bg-white dark:bg-[#26211E] border-4 border-[#4A2E23] dark:border-[#E5B326] rounded-[40px] p-8 md:p-12 shadow-[12px_12px_0px_#4A2E23] dark:shadow-[12px_12px_0px_#E5B326] max-w-sm w-full text-center animate-popIn transition-colors">
                <div
                    class="w-20 h-20 bg-green-100 dark:bg-green-500/10 border-2 border-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <i class="bi bi-check-lg text-4xl text-green-600 dark:text-green-400"></i>
                </div>

                <h3 class="text-2xl font-black text-[#4A2E23] dark:text-[#E5B326] uppercase mb-2">Siker!</h3>
                <p class="text-gray-600 dark:text-[#D4C7B0] font-bold mb-8">
                    A panaszát rögzítettük. Mihamarabb felvesszük Önnel a kapcsolatot, és elnézést kérünk a
                    kellemetlenségért!
                </p>

                <button @click="closeGreeting"
                    class="w-full bg-[#4A2E23] dark:bg-[#E5B326] hover:bg-[#5d3a2d] dark:hover:bg-[#d0a01e] text-white dark:text-[#4A2E23] font-black py-4 rounded-full transition-all shadow-[0px_4px_0px_#2a1a14] dark:shadow-[0px_4px_0px_#a9841c] active:shadow-none active:translate-y-1 uppercase tracking-wider">
                    Rendben
                </button>
            </div>
        </div>
    </div>
</template>

<style scoped>
textarea {
    overflow-y: auto;
}

textarea::-webkit-scrollbar {
    width: 8px;
}

textarea::-webkit-scrollbar-track {
    background: transparent;
    margin: 10px 0;
}

textarea::-webkit-scrollbar-thumb {
    background: #4A2E23;
    border-radius: 10px;
    border: 2px solid white;
}

:global(.dark) textarea::-webkit-scrollbar-thumb {
    background: #E5B326;
    border-color: #26211E;
}

.dark .shadow-\[12px_12px_0px_\#4A2E23\] {
    box-shadow: 12px 12px 0px #E5B326;
}
</style>