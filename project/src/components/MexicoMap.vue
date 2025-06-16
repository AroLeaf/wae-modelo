<script setup>
import { ref } from 'vue'
import datatest from '../assets/datatest.json';

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
      color: ['#d4f08d','#ffe37d','#c9774b','#8a220f', '#260302']
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
    <v-chart :option="chartOptions" style="width: 100%; height: 40vh; margin-bottom: 10vh;" />
</template>


