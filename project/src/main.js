import './assets/main.css'
import { createMemoryHistory, createRouter } from 'vue-router'

import HomeView from './components/Views/HomeView.vue'
import LoginView from './components/Views/LoginView.vue'
import DataView from './components/Views/DataView.vue'
import UserManagement from './components/Views/UserManagment.vue';

const routes = [
  { path: '/', component: LoginView, },
  { path: '/home', component: HomeView, meta: { requiresAuth: true },},
  { path: '/data', component: DataView, meta: { requiresAuth: true }, },
  { 
    path: '/usermanagement',
    component: UserManagement,
    beforeEnter: (to, from, next) => {
      const token = localStorage.getItem('token');
      if (token) {
        next();
      } else {
        next('/'); 
      }
    }
  }
];


const router = createRouter({
    history: createMemoryHistory(),
    routes,
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  const isAuthenticated = !!token;

  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/');
  } else if (to.path === '/' && isAuthenticated) {
    next('/home');
  } else {
    next();
  }
});

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

export default routes;