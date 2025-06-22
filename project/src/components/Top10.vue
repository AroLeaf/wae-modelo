<script setup>
    import { onMounted, ref, onBeforeUnmount } from 'vue';
    import { fetchData } from './services/DataFetch.js'

    const top10 = ref([]);
    let intervalId = null;

    onMounted(async () => {
        await configTop10();
        intervalId = setInterval(configTop10, 5000);
    });

    async function configTop10(){
        const data = await fetchData('http://localhost:8080/queries/WAE/1'); //get top10
        const top10measurements = getTop10(data);
        await matchMeasurementsAndStations(top10measurements);
        
    }

    async function matchMeasurementsAndStations(measurements) {
        top10.value = await Promise.all(measurements.map(async (measurement) => {
            const station = await fetchData('http://localhost:8080/stations/' + measurement.station);
            return {
                station: station.nearest_location.name,
                temperature: (measurement.temperature.toFixed(1))
            };
        }));
    }

    function getTop10(jsonndata) {
        return jsonndata
        .map(measurement => ({
            station: measurement.station,
            temperature: measurement.temperature
        }))
    }

    onBeforeUnmount(() => {
        if (intervalId) clearInterval(intervalId);
    });

</script>
<template>
    <div>
        <div v-for="(measurement, index) in top10" :key="measurement.station" style="list-style-type:none;">
            <li v-if="index < 5">
                <b>{{index + 1 }}.</b> {{ measurement.station }} {{measurement.temperature}}°C
            </li>
        </div>
    </div>

    <div>
        <div v-for="(measurement, index) in top10" :key="measurement.station" style="list-style-type:none;">
            <li v-if="4 < index && index < 10">
                <b>{{index + 1 }}.</b> {{ measurement.station }} {{measurement.temperature}}°C
            </li>
        </div>
    </div>
</template>