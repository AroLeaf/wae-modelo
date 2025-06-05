<template>
  <form @submit.prevent="login">
    <h2>Login</h2>
    <input v-model="username" placeholder="Gebruikersnaam" />
    <input v-model="password" type="password" placeholder="Wachtwoord" />
    <button type="submit">Inloggen</button>
  </form>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const username = ref('')
const password = ref('')
const router = useRouter()

function login() {
  // Simpele login check
  if (username.value === 'admin' && password.value === 'admin') {
    localStorage.setItem('loggedIn', 'true')
    router.push('/dashboard')
  } else {
    alert('Foutieve gegevens')
  }
}
</script>
