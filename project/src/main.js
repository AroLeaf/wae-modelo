import './assets/main.css'
import { createMemoryHistory, createRouter } from 'vue-router'

import HomeView from './components/Views/HomeView.vue'
import LoginView from './components/Views/LoginView.vue'
import FilterView from './components/Views/FilterView.vue'

const routes = [
    { path: '/', component: HomeView },
    { path: '/login', component: LoginView },
    { path: '/data', component: FilterView }
]

const router = createRouter({
    history: createMemoryHistory(),
    routes,
})

import { createApp } from 'vue'
import App from './App.vue'

createApp(App)
    .use(router)
    .mount('#app')
