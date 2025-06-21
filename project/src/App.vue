<script setup>  
import { ref } from 'vue'
import NavBar from './components/NavBar.vue' 

const authenticated = ref(false);

if (localStorage.getItem('token')) {
  authenticated.value = true;
}

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