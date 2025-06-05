<template>
  <div>
    <h1>Dashboard</h1>
    <button @click="logout">Uitloggen</button>
    <UserList />
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import UserList from '../components/UserList.vue'

const router = useRouter()

function logout() {
  localStorage.removeItem('loggedIn')
  router.push('/login')
}
</script>
