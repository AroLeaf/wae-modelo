<script setup>
import { reactive, ref, onMounted } from 'vue';

const API_BASE = 'http://localhost:5173'; 

const users = reactive([]);
const editMode = reactive([]);
const newUser = reactive({ name: '', password: '', admin: false });
const loginName = ref('');
const loginPassword = ref('');
const token = ref(localStorage.getItem('token') || '');
const currentUser = reactive({ name: '', admin: false });

const loading = ref(false);
const error = ref('');
const message = ref('');

function getHeaders() {
  return {
    'Content-Type': 'application/json',
    ...(token.value ? { Authorization: token.value } : {}),
  };
}

async function login() {
  error.value = '';
  loading.value = true;
  try {
    const res = await fetch(API_BASE + '/auth/login', {
      method: 'POST',
      headers: getHeaders(),
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
}

async function fetchUsers() {
  error.value = '';
  loading.value = true;
  try {
    const res = await fetch(API_BASE + '/users', {
      headers: getHeaders(),
    });
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

function enableEdit(index) {
  editMode[index] = true;
}
function cancelEdit(index) {
  editMode[index] = false;
  fetchUsers();
}

async function saveUser(index) {
  error.value = '';
  message.value = '';
  loading.value = true;

  const user = users[index];

  try {
    const res = await fetch(API_BASE + `/users/${encodeURIComponent(user.name)}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(user),
    });
    if (!res.ok) {
      error.value = await res.text();
      loading.value = false;
      return;
    }
    const updated = await res.json();
    users[index] = updated;
    editMode[index] = false;
    message.value = `User ${user.name} updated`;
  } catch (err) {
    error.value = 'Failed to update user';
  }
  loading.value = false;
}

async function createUser() {
  error.value = '';
  message.value = '';
  loading.value = true;

  try {
    const res = await fetch(API_BASE + '/users', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(newUser),
    });

    if (!res.ok) {
      error.value = await res.text();
      loading.value = false;
      return;
    }

    message.value = `User ${newUser.name} created`;
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
  message.value = '';

  if (!confirm(`Are you sure you want to delete user ${name}?`)) return;

  loading.value = true;
  try {
    const res = await fetch(API_BASE + `/users/${encodeURIComponent(name)}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });

    if (res.status === 204) {
      message.value = `User ${name} deleted`;
      await fetchUsers();
    } else {
      error.value = await res.text();
    }
  } catch (err) {
    error.value = 'Failed to delete user';
  }
  loading.value = false;
}

if (token.value) {
  try {
    const payload = JSON.parse(atob(token.value.split('.')[1]));
    currentUser.name = payload.name;
    currentUser.admin = payload.admin;
  } catch {
    token.value = '';
    localStorage.removeItem('token');
  }
  fetchUsers();
}
</script>

<template>
  <div>
    <NavBar />
    <div class="user-management">
      <h2>User Management</h2>

      <div v-if="!token" class="login-form">
        <h3>Login</h3>
        <input v-model="loginName" placeholder="Username" />
        <input v-model="loginPassword" type="password" placeholder="Password" />
        <button @click="login" :disabled="loading">Login</button>
        <p v-if="error" class="error">{{ error }}</p>
      </div>

      <div v-else>
        <button @click="logout">Logout</button>
        <p>Logged in as: <strong>{{ currentUser.name }}</strong> <span v-if="currentUser.admin">(Admin)</span></p>

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
                <button v-if="!editMode[index]" @click="enableEdit(index)">Edit</button>
                <button v-else @click="saveUser(index)">Save</button>
                <button v-if="editMode[index]" @click="cancelEdit(index)">Cancel</button>
                <button @click="deleteUser(user.name)" :disabled="!currentUser.admin || user.name === currentUser.name">Delete</button>
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
