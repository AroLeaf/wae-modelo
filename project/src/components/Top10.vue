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
  <div class="dataContainer">
    <h1>Top 10</h1>
    <v-chart :option="chartOptions" style="width: 100%; height: 40vh" />
  </div>
</template>

<style>
body {
  margin: 2vh 5vw;
}

h1 {
  background-color: rgb(17, 33, 66);
  color: white;
  padding: 5px;
  border-radius: 20px;
  text-align: center;
  margin: 0;
}

div.dataContainer {
  background-color: rgb(238, 238, 238);
  border-radius: 10px;
  padding: 1.5vh 3vw;
  height: 45vh;
}

.data {
  background-color: rgb(238, 238, 238);
  color: rgb(17, 33, 66);
  padding: 20px;
}
</style>
