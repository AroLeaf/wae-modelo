<script setup>  
import { ref , reactive} from 'vue'
import NavBar from './components/NavBar.vue' 

const authenticated = ref(false);
const token = ref(localStorage.getItem('token'))

if (token) {
  authenticated.value = true;
}

function handleAuthentication() {
   token.value = localStorage.getItem('token');
  authenticated.value = true;
}

function handleLogout() {
  authenticated.value = false;
  token.value = null;
}
</script>

<template>
  <main>
    <NavBar :authenticated="authenticated" :token="token" @logout="handleLogout"/>
    <RouterView active-class="active" @authenticated="handleAuthentication"/>
  </main>
</template>