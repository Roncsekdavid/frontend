<script setup>
import { computed } from 'vue'

const props = defineProps({
    loading: { type: Boolean, default: false },
    itemTitle: String,
    itemImage: String,
    itemName: String,
    itemDate: String,
    itemDesc: String,
    itemPrice: [String, Number],
    itemCategory: String,
    to: { type: [String, Object], default: null }
})

const loadImage = computed(() => {
    if (!props.itemImage) return ''

    return props.itemImage.startsWith('http')
        ? props.itemImage
        : new URL(props.itemImage, import.meta.url).href
})

const shortDesc = computed(() => {
    if (!props.itemDesc) return ''

    const maxLength = 115

    return props.itemDesc.length > maxLength
        ? props.itemDesc.slice(0, maxLength) + '...'
        : props.itemDesc
})

const formattedPrice = computed(() => {
    if (props.itemPrice === null || props.itemPrice === undefined || props.itemPrice === '') {
        return 'Nincs ár'
    }

    const price = Number(props.itemPrice)

    if (Number.isNaN(price)) {
        return props.itemPrice
    }

    return `${price.toLocaleString('hu-HU')} Ft.`
})
</script>

<template>
    <div
        class="bg-white rounded-3xl transition-all duration-200 p-6 border-2 border-[#051826] shadow-[6px_6px_0px_#051826] h-[520px] flex flex-col overflow-hidden"
        :class="{ 'animate-pulse cursor-wait': loading, 'cursor-pointer hover:scale-[1.01]': !loading }"
    >
        <div v-if="loading" class="h-full flex flex-col">
            <div class="h-7 bg-gray-200 rounded-md w-3/4 mb-3"></div>
            <div class="w-full h-48 bg-gray-200 rounded-xl mb-4"></div>
            <div class="h-6 bg-gray-200 rounded-md w-1/2 mb-2"></div>

            <div class="space-y-2 border-b border-gray-100 pb-3">
                <div class="h-3 bg-gray-100 rounded w-full"></div>
                <div class="h-3 bg-gray-100 rounded w-2/3"></div>
            </div>

            <div class="h-8 bg-gray-200 rounded-md w-1/3 mt-auto"></div>
        </div>

        <template v-else>
            <component
                :is="to ? 'router-link' : 'div'"
                :to="to"
                class="h-full flex flex-col min-w-0"
            >
                <h2
                    class="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2 h-[32px] overflow-hidden shrink-0"
                    :title="itemTitle || 'Nincs megnevezés'"
                >
                    <i v-if="!itemTitle" class="bi bi-tag text-blue-500 shrink-0"></i>

                    <span class="block min-w-0 overflow-hidden whitespace-nowrap text-ellipsis">
                        {{ itemTitle || 'Nincs megnevezés' }}
                    </span>
                </h2>

                <div class="relative group shrink-0">
                    <img
                        v-if="itemImage"
                        :src="loadImage"
                        :alt="itemTitle || 'Tárgy képe'"
                        class="w-full h-48 object-cover rounded-xl shadow-sm transition-opacity duration-300"
                        @error="(e) => e.target.src = 'https://placehold.co/600x400?text=Nincs+kép'"
                    />

                    <div
                        v-else
                        class="w-full h-48 bg-slate-100 rounded-xl flex items-center justify-center"
                    >
                        <i class="bi bi-image text-4xl text-slate-300"></i>
                    </div>
                </div>

                <p
                    class="text-lg font-semibold text-gray-900 mt-4 h-[32px] overflow-hidden whitespace-nowrap text-ellipsis shrink-0"
                    :title="itemName || 'Nincs név'"
                >
                    {{ itemName || 'Nincs név' }}
                </p>

                <p
                    class="text-sm text-gray-600 mt-1 border-b border-gray-200 pb-3 leading-relaxed h-[86px] overflow-hidden shrink-0"
                >
                    <span v-if="itemDesc">{{ shortDesc }}</span>
                    <span v-else class="italic text-gray-400">Nincs leírás megadva</span>

                    <br />

                    <span class="text-xs font-mono text-blue-600/70">
                        <i class="bi bi-calendar3 mr-1"></i>{{ itemDate || 'Nincs dátum' }}
                    </span>
                </p>

                <p
                    class="text-2xl font-bold text-blue-900 mt-auto flex items-center gap-1 min-w-0 overflow-hidden whitespace-nowrap text-ellipsis"
                    :title="formattedPrice"
                >
                    <i class="bi bi-currency-exchange text-xl text-blue-500 shrink-0"></i>

                    <span class="min-w-0 overflow-hidden whitespace-nowrap text-ellipsis">
                        {{ formattedPrice }}
                    </span>
                </p>
            </component>
        </template>
    </div>
</template>

<style scoped>
.animate-pulse {
    animation: pulse 1.8s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
    0%, 100% {
        opacity: 1;
    }

    50% {
        opacity: .7;
    }
}
</style>