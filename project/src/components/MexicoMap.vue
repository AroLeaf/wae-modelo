<script setup>
import { onMounted, ref } from 'vue'
import datatest from '../../../IWA/data/datatest.json'
import { fetchData } from './DataFetch.js'

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



onMounted(async () => {
  const urls = ['http://localhost:8080/stations', 'http://localhost:8080/queries/WAE/0'];

  var fetchedData = await Promise.all(urls.map(url => fetchData(url)));

  const stations = fetchedData[0];
  const mexicoData = fetchedData[1];

  
  // intervalId = setInterval(fetchData, 5000);
});

</script>

<template>
  <div class="map">
    <map-chart :option="chartOptions" />
  </div>
</template>


