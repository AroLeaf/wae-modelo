<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const API_BASE = 'http://localhost:8080';

const loginName = ref('');
const loginPassword = ref('');
const loading = ref(false);
const error = ref('');

const emit = defineEmits(['authenticated']);

async function login() {
  error.value = '';
  loading.value = true;
  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: loginName.value, password: loginPassword.value }),
    });

    if (!res.ok) {
      error.value = await res.text();
      loading.value = false;
      return;
    }

    const jwtToken = await res.text();
    localStorage.setItem('token', jwtToken);
    emit('authenticated');
    router.push('/home');
  } catch (err) {
    error.value = 'Login mislukt. Probeer het opnieuw.';
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="max-w-md mx-auto mt-20 p-6 border rounded shadow">
    <h2 class="text-xl font-bold mb-4">Login</h2>

    <div class="mb-4">
      <label class="block mb-1">Gebruikersnaam</label>
      <input v-model="loginName" type="text" class="w-full border p-2 rounded" />
    </div>

    <div class="mb-4">
      <label class="block mb-1">Wachtwoord</label>
      <input v-model="loginPassword" type="password" class="w-full border p-2 rounded" />
    </div>

    <button
      @click="login"
      :disabled="loading"
      class="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
    >
      {{ loading ? 'Bezig met inloggen...' : 'Login' }}
    </button>

    <p v-if="error" class="mt-4 text-red-600">{{ error }}</p>
  </div>
</template>

<style scoped>
/* Optioneel: extra styling */
</style>
