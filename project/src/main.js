import { createApp } from 'vue'
import App from './App.vue'
import VueECharts from 'vue-echarts'
import * as echarts from 'echarts'
import mexicoMap from './assets/mexico.geo.json'

echarts.registerMap('Mexico', mexicoMap)

const app = createApp(App)
app.component('v-chart', VueECharts)
app.mount('#app')
