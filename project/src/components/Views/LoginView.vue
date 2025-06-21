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
  <div class="loginwrapper">
    
    <div class="formwrapper">
      <h2>Log in</h2>
      <p v-if="error" class="error"> <strong>{{ error }}</strong></p>
      <form>
        <input v-model="loginName" type="text" placeholder="username"/>
        <input v-model="loginPassword" type="password" placeholder="password" />
        <button @click="login" :disabled="loading">
          {{ loading ? 'logging in...' : 'Login' }}
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped>
  input[type="text"], input[type="password"] {
  padding: 6px;
  margin: 4px 0;
}

.loginwrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 60vh;
  flex-direction: column-reverse;
}

h2 {
  text-align: center;
}

.formwrapper {
  display: flex;
  flex-direction: column;
}

.error {
  text-align: center;
  color: red;
}

@media (max-width: 1000px) {
  .formwrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
  }
}
</style>
