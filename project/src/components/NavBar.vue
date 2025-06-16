<template>
  <nav class="navbar">
    <div class="logo">Navbar</div>

    <div class="hamburger" :class="{ open: isOpen }" @click="toggleMenu">
      <span></span>
      <span></span>
      <span></span>
    </div>

    <ul class="nav-links" :class="{ open: isOpen }">
      <li><RouterLink to="/">Home</RouterLink></li>
      <li><RouterLink to="/data">Data</RouterLink></li>
      <li><RouterLink to="/usermanagement">User Management</RouterLink></li>
    </ul>
  </nav>
</template>

<script setup>
import { ref } from 'vue'

const isOpen = ref(false)

function toggleMenu() {
  isOpen.value = !isOpen.value
}
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: #1e1e2f;
  color: white;
  position: relative;
  z-index: 1000;
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
}

.hamburger {
  width: 30px;
  height: 21px;
  position: relative;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  z-index: 1010;
}

.hamburger span {
  display: block;
  height: 3px;
  background: white;
  border-radius: 2px;
  transition: 0.3s;
}

.hamburger.open span:nth-child(1) {
  transform: rotate(45deg) translate(5px, 5px);
}
.hamburger.open span:nth-child(2) {
  opacity: 0;
}
.hamburger.open span:nth-child(3) {
  transform: rotate(-45deg) translate(5px, -5px);
}

.nav-links {
  list-style: none;
  display: flex;
  gap: 1.5rem;
  align-items: center;
}

.nav-links li {
  position: relative;
}

.nav-links li a {
  color: white;
  text-decoration: none;
  font-size: 1.1rem;
}

.dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  background: #2e2e40;
  list-style: none;
  padding: 0.5rem 0;
  margin: 0;
  min-width: 160px;
  border-radius: 0.5rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  display: none;
}

.dropdown li {
  padding: 0.5rem 1rem;
}

.dropdown li a {
  color: white;
  display: block;
}

.dropdown li a:hover {
  background: #444;
  border-radius: 0.25rem;
}

.nav-links li:hover .dropdown {
  display: block;
}

/* Mobile styles */
@media (max-width: 768px) {
  .hamburger {
    display: flex;
  }

  .nav-links {
    flex-direction: column;
    position: absolute;
    top: 100%;
    right: 0;
    background: #1e1e2f;
    width: 200px;
    padding: 1rem;
    gap: 1rem;
    max-height: 0;
    overflow: hidden;
    opacity: 0;
    transition: max-height 0.3s ease, opacity 0.3s ease;
    visibility: hidden;
  }

  .nav-links.open {
    max-height: 500px;
    opacity: 1;
    visibility: visible;
  }

  .nav-links li:hover .dropdown {
    display: none;
  }

  .dropdown {
    position: static;
    box-shadow: none;
    padding-left: 1rem;
    display: none;
  }

  .dropdown.show {
    display: block;
  }
}

/* Desktop only */
@media (min-width: 769px) {
  .hamburger {
    display: none;
  }
}  
</style>
