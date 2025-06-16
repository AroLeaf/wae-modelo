<script setup>
import { ref } from 'vue'
import datatest from '../../../IWA/data/datatest.json'

const dataMap = datatest.MexicoStates.map(state =>({
  name: state.name,
  value: state.temperature
}))

const chartOptions = ref({
  tooltip: {
    trigger: 'item',
    formatter: '{b}<br/>Temperature: {c}°C'
  },
  visualMap: {
    min: 15,
    max: 40,
    left: 'left',
    top: 'bottom',
    text: ['Hot', 'Cold'],
    inRange: {
      color: ['#d4f08d','#ffe37d', '#ffc74f','#c9774b','#8a220f', '#260302']
    },
  },
  series: [
    {
      name: 'Temperature',
      type: 'map',
      map: 'Mexico',
      nameProperty: 'state_name',
      label: {
        show: false
      },
      data: dataMap
    }
  ]
})
</script>

<template>
  <div class="map">
    <v-chart :option="chartOptions" />
  </div>
</template>


