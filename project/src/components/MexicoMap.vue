<script setup>
import { onMounted, onBeforeUnmount, ref, computed } from 'vue'
import datatest from '../../../IWA/data/datatest.json'
import { fetchData } from './services/DataFetch.js'

const dataMap = datatest.MexicoStates.map(state =>({ //test data
  name: state.name,
  value: state.temperature
}))

const map = ref([]);
let intervalId = null;

onMounted(async () => {
    await configMap();
    intervalId = setInterval(configMap, 5000);
});

async function configMap(){
    const data = await fetchData('http://localhost:8080/queries/WAE/0'); //get mexico measurements in json
    const mexicoMeasurements = getMapData(data); //convert to map
    // console.log(mexicoMeasurements);
    await matchMeasurementsAndStations(mexicoMeasurements);
    
}

async function matchMeasurementsAndStations(measurements) {
    const doubleMeasurements = await Promise.all(measurements.map(async (measurement) => {
        const station = await fetchData('http://localhost:8080/stations/' + measurement.station);
        return {
            name: station.nearest_location.administrative_region1,
            value: parseFloat(measurement.temperature.toFixed(1))
        };
    }));

    await calculateAverage(doubleMeasurements);
}

async function calculateAverage(measurements) {
  const grouped = {};
  measurements.forEach(measurement => {
    if (!grouped[measurement.name]) {
      grouped[measurement.name] = { sum: 0, count: 0 };
      }
    grouped[measurement.name].sum += measurement.value;
    grouped[measurement.name].count += 1;
  });

  const averaged = Object.entries(grouped).map(([name, { sum, count }]) => ({
    name,
    value: parseFloat((sum / count).toFixed(1))
  }));

  map.value = averaged;
  console.log(map.value);
}

function getMapData(jsonndata) {
    return jsonndata
    .map(measurement => ({
        station: measurement.station,
        temperature: measurement.temperature
    }))
}

onBeforeUnmount(() => {
    if (intervalId) clearInterval(intervalId);
});

const chartOptions = computed(() => ({
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
      data: map.value // ← this will now always be the latest
    }
  ]
}));
</script>

<template>
  <div class="map">
    <map-chart :option="chartOptions" />
  </div>
</template>


