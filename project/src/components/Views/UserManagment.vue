<script setup>
import { reactive, ref } from 'vue';
const API_BASE = 'http://localhost:8080'; 

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
  const headers = {
    'Content-Type': 'application/json',
  };
  if (token.value) {
    headers.Authorization = token.value;
  }
  console.log('[getHeaders] Headers:', headers);
  return headers;
}



async function login() {
  console.log('Login button clicked');
  error.value = '';
  loading.value = true;
  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }, // Login hoeft nog geen token mee
      body: JSON.stringify({ name: loginName.value, password: loginPassword.value }),
    });
    console.log('[login] Response status:', res.status);

    if (!res.ok) {
      error.value = await res.text();
      console.error('[login] Error:', error.value);
      loading.value = false;
      return;
    }

    const jwtToken = await res.text();
    console.log('[login] Received JWT token:', jwtToken);

    token.value = jwtToken;
    localStorage.setItem('token', jwtToken);

    try {
      const payload = JSON.parse(atob(jwtToken.split('.')[1]));
      console.log('[login] Decoded JWT payload:', payload);
      currentUser.name = payload.name;
      currentUser.admin = payload.admin;
    } catch (e) {
      console.error('[login] Invalid token payload', e);
      error.value = 'Invalid token received';
      loading.value = false;
      return;
    }

    await fetchUsers();
  } catch (err) {
    console.error('[login] Login failed:', err);
    error.value = 'Login failed';
  }
  loading.value = false;
}


function logout() {
  console.log('[logout] Logging out');
  token.value = '';
  localStorage.removeItem('token');
  users.length = 0;
  currentUser.name = '';
  currentUser.admin = false;
  message.value = '';
  error.value = '';
}

async function fetchUsers() {
  console.log('[fetchUsers] Fetching users...');
  error.value = '';
  loading.value = true;
  try {
    console.log('[fetchUsers] Using token:', token.value);
    const res = await fetch(`${API_BASE}/users`, {
      headers: getHeaders(),
    });
    console.log('[fetchUsers] Response status:', res.status);

    if (!res.ok) {
      error.value = await res.text();
      console.error('[fetchUsers] Error:', error.value);
      loading.value = false;
      return;
    }
    const data = await res.json();
    console.log('[fetchUsers] Users data:', data);
    users.splice(0, users.length, ...data);
    editMode.splice(0, editMode.length, ...data.map(() => false));
  } catch (err) {
    console.error('[fetchUsers] Failed to fetch users:', err);
    error.value = 'Failed to fetch users';
  }
  loading.value = false;
}

function enableEdit(index) {
  console.log(`[enableEdit] Enable edit mode for user index: ${index}, user:`, users[index]);
  editMode[index] = true;
}
function cancelEdit(index) {
  console.log(`[cancelEdit] Cancel edit mode for user index: ${index}`);
  editMode[index] = false;
  fetchUsers();
}

async function saveUser(index) {
  error.value = '';
  message.value = '';
  loading.value = true;

  const user = users[index];
  console.log(`[saveUser] Saving user at index ${index}:`, user);

  try {
    const res = await fetch(`${API_BASE}/users/${encodeURIComponent(user.name)}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(user),
    });
    console.log('[saveUser] Response status:', res.status);

    if (!res.ok) {
      const errText = await res.text();
      console.log('[saveUser] Save failed with message:', errText);
      error.value = errText;
      loading.value = false;
      return;
    }
    const updated = await res.json();
    console.log('[saveUser] User updated:', updated);
    users[index] = updated;
    editMode[index] = false;
    message.value = `User ${user.name} updated`;
  } catch (err) {
    console.error('[saveUser] Error:', err);
    error.value = 'Failed to update user';
  }
  loading.value = false;
}

async function createUser() {
  error.value = '';
  message.value = '';
  loading.value = true;

  console.log('[createUser] Creating user:', newUser);

  try {
    const res = await fetch(`${API_BASE}/users`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(newUser),
    });
    console.log('[createUser] Response status:', res.status);

    if (!res.ok) {
      const errText = await res.text();
      console.log('[createUser] Create failed with message:', errText);
      error.value = errText;
      loading.value = false;
      return;
    }

    message.value = `User ${newUser.name} created`;
    newUser.name = '';
    newUser.password = '';
    newUser.admin = false;
    await fetchUsers();
  } catch (err) {
    console.error('[createUser] Error:', err);
    error.value = 'Failed to create user';
  }
  loading.value = false;
}

async function deleteUser(name) {
  error.value = '';
  message.value = '';

  if (!confirm(`Are you sure you want to delete user ${name}?`)) {
    console.log('[deleteUser] Deletion cancelled by user');
    return;
  }

  console.log('[deleteUser] Deleting user:', name);
  loading.value = true;
  try {
    const res = await fetch(`${API_BASE}/users/${encodeURIComponent(name)}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    console.log('[deleteUser] Response status:', res.status);

    if (res.status === 204) {
      message.value = `User ${name} deleted`;
      await fetchUsers();
    } else {
      const errText = await res.text();
      console.log('[deleteUser] Delete failed with message:', errText);
      error.value = errText;
    }
  } catch (err) {
    console.error('[deleteUser] Error:', err);
    error.value = 'Failed to delete user';
  }
  loading.value = false;
}

if (token.value) {
  try {
    const payload = JSON.parse(atob(token.value.split('.')[1]));
    currentUser.name = payload.name;
    currentUser.admin = payload.admin;
    console.log('[init] Existing token found, user:', currentUser);
    fetchUsers();
  } catch (e) {
    console.log('[init] Invalid token found, clearing');
    token.value = '';
    localStorage.removeItem('token');
  }
}
</script>

<template>
  <div>
    <div class="user-management">
      <h2>User Management</h2>

      <div v-if="!token" class="login-form">
        <h3>Login</h3>
        <input v-model="loginName" placeholder="Username" @input="console.log('[login input] Username:', loginName)" />
        <input v-model="loginPassword" type="password" placeholder="Password" @input="console.log('[login input] Password entered')" />
        <button @click="() => { console.log('[login button] Clicked'); login(); }" :disabled="loading">Login</button>
        <p v-if="error" class="error">{{ error }}</p>
      </div>

      <div v-else>
        <button @click="() => { console.log('[logout button] Clicked'); logout(); }">Logout</button>
        <p>Logged in as: <strong>{{ currentUser.name }}</strong> <span v-if="currentUser.admin">(Admin)</span></p>

        <h3>Users</h3>
        <button @click="() => { console.log('[refresh button] Clicked'); fetchUsers(); }" :disabled="loading">Refresh</button>

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
              <td>
                <input 
                  v-model="user.name" 
                  :disabled="!editMode[index]" 
                  @input="console.log(`[user input] Name changed for index ${index}:`, user.name)" 
                />
              </td>
              <td>
                <input 
                  type="checkbox" 
                  v-model="user.admin" 
                  :disabled="!editMode[index]" 
                  @change="console.log(`[user input] Admin changed for index ${index}:`, user.admin)" 
                />
              </td>
              <td>
                <input 
                  v-model="user.password" 
                  type="password" 
                  :disabled="!editMode[index]" 
                  placeholder="••••••" 
                  @input="console.log(`[user input] Password changed for index ${index}`)" 
                />
              </td>
              <td>
                <button v-if="!editMode[index]" @click="() => { console.log(`[edit button] Clicked for index ${index}`); enableEdit(index); }">Edit</button>
                <button v-else @click="() => { console.log(`[save button] Clicked for index ${index}`); saveUser(index); }">Save</button>
                <button v-if="editMode[index]" @click="() => { console.log(`[cancel button] Clicked for index ${index}`); cancelEdit(index); }">Cancel</button>
                <button 
                  @click="() => { console.log(`[delete button] Clicked for user ${user.name}`); deleteUser(user.name); }" 
                  :disabled="!currentUser.admin || user.name === currentUser.name"
                >Delete</button>
              </td>
            </tr>
          </tbody>
        </table>

        <h3>Create New User</h3>
        <form @submit.prevent="() => { console.log('[create user form] Submitted'); createUser(); }">
          <input v-model="newUser.name" placeholder="Name" required @input="console.log('[newUser input] Name:', newUser.name)" />
          <input v-model="newUser.password" type="password" placeholder="Password" required @input="console.log('[newUser input] Password entered')" />
          <label>
            Admin:
            <input type="checkbox" v-model="newUser.admin" @change="console.log('[newUser input] Admin:', newUser.admin)" />
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
