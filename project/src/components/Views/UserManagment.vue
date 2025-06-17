<script setup>
import { useRouter } from 'vue-router';
import { reactive, ref, onMounted } from 'vue';
const API_BASE = 'http://localhost:8080';

const router = useRouter();
const users = reactive([]);
const editMode = reactive([]);
const newUser = reactive({ name: '', password: '', admin: false });
const loginName = ref('');
const loginPassword = ref('');
const token = ref('');
const currentUser = reactive({ name: '', admin: false });

const loading = ref(false);
const error = ref('');
const message = ref('');
const ready = ref(false);  

function getHeadersWithBody(withBody = true) {
  const headers = {
    Authorization: token.value,
  };
  if (withBody) headers['Content-Type'] = 'application/json';
  return headers;
}

function getHeadersWithoutBody(withBody =false){
  const headers = {
    Authorization: token.value,
  };
  if (withBody) headers['Content-Type'] = 'application/json';
  return headers;
}

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

    token.value = jwtToken;
    localStorage.setItem('token', jwtToken);

    const payload = JSON.parse(atob(jwtToken.split('.')[1]));
    currentUser.name = payload.name;
    currentUser.admin = payload.admin;

    await fetchUsers();
  } catch (err) {
    error.value = 'Login failed';
  }
  loading.value = false;
}

function logout() {
  token.value = '';
  localStorage.removeItem('token');
  users.length = 0;
  currentUser.name = '';
  currentUser.admin = false;
  message.value = '';
  error.value = '';
  router.push('/');
}

// haal gebruikerslijst op
async function fetchUsers() {
  error.value = '';
  loading.value = true;
  try {
    const res = await fetch(`${API_BASE}/users`, { headers: getHeadersWithBody() });

    if (!res.ok) {
      error.value = await res.text();
      loading.value = false;
      return;
    }
    const data = await res.json();
    users.splice(0, users.length, ...data);
    editMode.splice(0, editMode.length, ...data.map(() => false));
  } catch (err) {
    error.value = 'Failed to fetch users';
  }
  loading.value = false;
}

function enableEdit(index) { editMode[index] = true; }
function cancelEdit(index) { editMode[index] = false; fetchUsers(); }
async function saveUser(index) { 
  changepassword();
  editMode[index] = false; fetchUsers(); 
}

async function createUser() {
  error.value = '';
  message.value = '';
  loading.value = true;

  try {
    if (users.find(u => u.name === newUser.name)) {
    error.value = 'User with that name already exists';
    loading.value = false;
    return;
    } 
    const res = await fetch(`${API_BASE}/users`, {
      method: 'POST',
      headers: getHeadersWithBody(),
      body: JSON.stringify(newUser),
    });

    if (!res.ok) {
      error.value = await res.text();
      loading.value = false;
      return;
    }

    message.value = 'User created successfully';
    newUser.name = '';
    newUser.password = '';
    newUser.admin = false;
    await fetchUsers();
  } catch (err) {
    error.value = 'Failed to create user';
  }

  loading.value = false;
}

async function deleteUser(name) {
  error.value = '';
  loading.value = true;
  try {
    const res = await fetch(`${API_BASE}/users/${encodeURIComponent(name)}`, {
      method: 'DELETE',
      headers: getHeadersWithoutBody(),
    });

    if (!res.ok) {
      error.value = await res.text();
    } else {
      message.value = `User ${name} deleted.`;
      await fetchUsers(); 
    }
  } catch (err) {
    error.value = 'Failed to delete user.';
  } finally {
    loading.value = false;
  }
}

async function changepassword(name, newPassword) {
  const res = await fetch(`${API_BASE}/users/${encodeURIComponent(name)}`, {
    method: 'PUT',
    headers: getHeaders(true),  
    body: JSON.stringify({ password: newPassword }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to change password: ${errorText}`);
  }

  return true;
}

onMounted(() => {
  const storedToken = localStorage.getItem('token');
  if (!storedToken) {
    ready.value = true; 
    return;
  }

  try {
    const payload = JSON.parse(atob(storedToken.split('.')[1]));
    currentUser.name = payload.name;
    currentUser.admin = payload.admin;
    token.value = storedToken;
    fetchUsers().finally(() => {
      ready.value = true; 
    });
  } catch (e) {
    localStorage.removeItem('token');
    token.value = '';
    ready.value = true;
  }
});
</script>

<template>
  <div>
    <div class="user-management">
      <h2>User Management</h2>

      <div v-if="!ready">
        <p>Loading...</p>
      </div>

      <div v-else>
        <div v-if="!token" class="login-form">
          <h3>Login</h3>
          <input v-model="loginName" placeholder="Username" />
          <input v-model="loginPassword" type="password" placeholder="Password" />
          <button @click="login" :disabled="loading">Login</button>
          <p v-if="error" class="error">{{ error }}</p>
        </div>

        <div v-else>
          <button @click="logout">Logout</button>
          <p>Logged in als: <strong>{{ currentUser.name }}</strong> <span v-if="currentUser.admin">(Admin)</span></p>

          <h3>Users</h3>
          <button @click="fetchUsers" :disabled="loading">Refresh</button>

          <table border="1" cellpadding="5" cellspacing="0">
            <thead>
              <tr>
                <th>Name</th>
                <th>Admin</th>
                <th>Password</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(user, index) in users" :key="user.name">
                <td><input v-model="user.name" :disabled="!editMode[index]" /></td>
                <td><input type="checkbox" v-model="user.admin" :disabled="!editMode[index]" /></td>
                <td><input v-model="user.password" type="password" :disabled="!editMode[index]" placeholder="••••••" /></td>
                <td>
                  <button v-if="!editMode[index] && (user.name === currentUser.name || currentUser.admin)" @click="() => enableEdit(index)">Edit</button>
                  <button v-if="editMode[index] && (user.name === currentUser.name  || currentUser.admin)" @click="() => saveUser(index)">Save</button>
                  <button v-if="editMode[index]" @click="() => cancelEdit(index)">Cancel</button>
                  <button v-if="editMode[index] && user.name !== currentUser.name " @click="() => deleteUser(user.name)" :disabled="!currentUser.admin">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>

          <h3>Create New User</h3>
          <form @submit.prevent="createUser">
            <input v-model="newUser.name" placeholder="Name" required />
            <input v-model="newUser.password" type="password" placeholder="Password" required />
            <label>
              Admin:
              <input type="checkbox" v-model="newUser.admin" />
            </label>
            <button type="submit" :disabled="loading || !currentUser.admin">Create</button>
          </form>

          <p v-if="message" class="message">{{ message }}</p>
          <p v-if="error" class="error">{{ error }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.user-management {
  max-width: 800px;
  margin: auto;
  font-family: Arial, sans-serif;
}
input[type="text"], input[type="password"] {
  padding: 6px;
  margin: 4px 0;
}
button {
  margin: 4px;
  padding: 6px 12px;
}
.error {
  color: red;
}
.message {
  color: green;
}
table {
  width: 100%;
  margin: 10px 0;
  border-collapse: collapse;
}
</style>
