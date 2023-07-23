import { defineStore } from 'pinia'
import { useApiStore } from '@/stores/api'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {

  const userDetails = ref({})

  function storeDetails(payload) {
    const attributes = payload.data.attributes
    userDetails.value = {
      user_id: payload.data.id,
      public_name: attributes['public-name'],
      first_name: attributes['first-name'],
      last_name: attributes['last-name'],
      email: attributes['email']
    }
    console.log(userDetails.value)
  }

  return { userDetails, storeDetails }
})