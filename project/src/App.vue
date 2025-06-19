<script setup>  
import { ref } from 'vue'
import NavBar from './components/NavBar.vue' 

const authenticated = ref(false);

function handleAuthentication() {
  authenticated.value = true;
}

function handleLogout() {
  authenticated.value = false;
}
</script>

<template>
  <main>
    <NavBar :authenticated="authenticated" @logout="handleLogout"/>
    <RouterView active-class="active" @authenticated="handleAuthentication" />
  </main>
</template>

<style scoped>
  .router-link-active {
    text-decoration: underline;
    text-decoration-thickness: auto;
    text-decoration-thickness: 0.1rem;
    text-underline-offset: 0.3rem;
  }
</style>