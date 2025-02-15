<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useLoadingStore } from '@/stores/loading'
import { useAuthStore } from '@/stores/auth'
import { useApiStore } from '@/stores/api'
import { useUserStore } from '@/stores/user'
import StandardButton from '@/components/Shared/StandardButton.vue'

// form fields
const email = ref('')
const password = ref('')

// error handling
const showError = ref(false)

// stores
const loadingStore = useLoadingStore()
const authStore = useAuthStore()
const apiStore = useApiStore()
const userStore = useUserStore()

// router
const router = useRouter()

async function submitLogin() {
  loadingStore.show = true

  const payload = {
    email: email.value,
    password: password.value
  }

  await authStore
    .login(payload, 'auth/login')
    .then(async (res) => {
      localStorage.setItem('token', Object(res).access_token)
      showError.value = false
      loadingStore.show = false
      router.push({
        name: 'stationSelector'
      })
    })
    .catch((err) => {
      loadingStore.show = false
      console.log(err)
      showError.value = true
    })
  
  var userId = null
  await apiStore
    .get(true, 'users/user-details/get-user-id')
    .then(async (res) => {
      userId = res.user_id
    })

  await apiStore
    .get(true, `users/${userId}`)
    .then(async (res) => {
      userStore.storeDetails(res)
      console.log(res.data.attributes)
    })
}
</script>

<template>
  <div class="flex flex-1 flex-col justify-center my-auto">
    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <h2 class="text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
        Sign in to your account
      </h2>
      <form class="space-y-6 mt-10" @submit.prevent="submitLogin">
        <div>
          <label for="email" class="block text-sm font-medium leading-6 text-gray-900"
            >Email address</label
          >
          <div class="mt-2">
            <input
              id="email"
              v-model="email"
              name="email"
              type="email"
              autocomplete="email"
              required="true"
              class="block pl-2 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-blue-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <div>
          <label for="password" class="block text-sm font-medium leading-6 text-gray-900"
            >Password</label
          >
          <div class="mt-2">
            <input
              id="password"
              v-model="password"
              name="password"
              type="password"
              autocomplete="current-password"
              required="true"
              class="block pl-2 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-blue-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <div>
          <StandardButton
            type="submit"
            text="Login"
            class="w-full mt-6 justify-center bg-blue-600 text-white hover:bg-blue-500"
          />
        </div>

        <div v-if="showError">
          <p class="text-sm text-red-500">Wrong credentials or account does not exist</p>
        </div>
      </form>

      <p class="mt-10 text-center text-sm text-gray-500">
        <span class="font-semibold">Forgot password?</span>
        {{ ' ' }}
        <a href="https://eventyay.com/reset-password" class="font-semibold leading-6 text-blue-500"
          >Click here to reset password</a
        >
      </p>
    </div>
  </div>
</template>
