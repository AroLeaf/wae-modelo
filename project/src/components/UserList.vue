<template>
  <div>
    <h2>Gebruikerslijst</h2>
    <ul>
      <li v-for="user in users" :key="user.id">{{ user.name }}</li>
    </ul>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const users = ref([
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
])
</script>
