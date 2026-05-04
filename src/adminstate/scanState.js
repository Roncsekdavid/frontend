import { ref, markRaw } from 'vue'
import api from '../services/api'
import { defineStore } from 'pinia'
import Offer from '../classes/Offer'
import Items from '../classes/Items'

export const scanState = defineStore('scanState', () => {
    const selectedOffer = ref(null)

    async function fetchOffer(offer_code) {
        const offerResponse = await api.get(`/offers/code/${offer_code}`)
        const data = offerResponse.data

        const itemResponse = await api.get(`/items/admin/${data.item_id}`)
        const itemData = itemResponse.data


        const item = markRaw(new Items(
            itemData.id,
            itemData.description,
            itemData.estimated_value,
            itemData.user_id,
            itemData.status,
            itemData.name,
            itemData.upload_date,
            itemData.category,
            itemData.item_images
        ))

        selectedOffer.value = markRaw(new Offer(
            data.id,
            data.item_id,
            data.loan_amount,
            data.interest_rate,
            data.offer_code,
            data.status,
            data.created_at,
            data.expires_at,
            item
        ))

        console.log('offer data:', data)
        console.log('item_id:', data.item_id)
        return selectedOffer.value
    }

    async function fetchOfferById(id) {
        const { data } = await api.get(`/offers/admin/${id}`)

        const itemRes = await api.get(`/items/admin/${data.item_id}`)
        const itemData = itemRes.data

        const item = markRaw(new Items(itemData.id,
            itemData.description,
            itemData.estimated_value,
            itemData.user_id,
            itemData.status,
            itemData.name,
            itemData.upload_date,
            itemData.category,
            itemData.item_images))

        selectedOffer.value = markRaw(new Offer(data.id,
            data.item_id,
            data.loan_amount,
            data.interest_rate,
            data.offer_code,
            data.status,
            data.created_at,
            data.expires_at, item))

        return selectedOffer.value
    }

    function getSelectedOffer() {
        return selectedOffer.value
    }

    return { getSelectedOffer, fetchOffer, fetchOfferById }
})