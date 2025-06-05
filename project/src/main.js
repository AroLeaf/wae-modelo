import './assets/main.css'
import { createMemoryHistory, createRouter } from 'vue-router'

import HomeView from './components/Views/HomeView.vue'
import LoginView from './components/Views/LoginView.vue'
import FilterView from './components/Data.vue'

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
import VueECharts from 'vue-echarts'
import * as echarts from 'echarts'
import mexicoMap from './assets/mexico.geo.json'

echarts.registerMap('Mexico', mexicoMap)

const app = createApp(App)
app.component('v-chart', VueECharts)
app.use(router)
app.mount('#app')
