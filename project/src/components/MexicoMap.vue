<script setup>
import { ref } from 'vue'

const chartOptions = ref({
  tooltip: {
    trigger: 'item',
    formatter: '{b}<br/>Temperature: {c}°C'
  },
  visualMap: {
    min: -10,
    max: 40,
    left: 'left',
    top: 'bottom',
    text: ['Hot', 'Cold'],
    inRange: {
      color: ['#c7ffd3', '#b80012']
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
      data: [
        { name: 'Guerrero', value: 30 },
        { name: 'Tabasco', value: 20 } 
      ]
    }
  ]
})
</script>

<template>
    <v-chart :option="chartOptions" style="width: 100%; height: 35vh; margin-bottom: 15vh;" />
</template>


