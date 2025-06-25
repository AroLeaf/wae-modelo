<script setup>
import {ref, computed, onMounted, onBeforeUnmount} from 'vue'
import { fetchData } from './services/DataFetch.js'

const headers= ref ([
  'station',
  'timestamp',
  'temperature',
  'dewpoint_temperature',
  'air_pressure_station',
  'air_pressure_sea_level',
  'visibility',
  'wind_speed',
  'percipation',
  'snow_depth',
  'cloud_cover',
  'wind_direction'
])
const data = ref([])

const startDate = ref('');
const endDate = ref('');
const stationFilter = ref('')
const displayLimit = ref(50);

const sortedFilteredData = computed(() => {
  let filtered = data.value;
  // filter
  if (startDate.value || endDate.value) {
    filtered = filtered.filter(row => {
      const rowDate = new Date(row.timestamp);
      const start = startDate.value ? new Date(startDate.value) : null;
      const end = endDate.value ? new Date(endDate.value) : null;

      if (start && end) {
        return rowDate >= start && rowDate <= end;
      } else if (start) {
        return rowDate >= start;
      } else if (end) {
        return rowDate <= end;
      }
    });
  }

  if (stationFilter.value.trim() !== '') {
    filtered = filtered.filter(row =>
        (row.stationName || row.station).toLowerCase().includes(stationFilter.value.trim().toLowerCase())
    );
  }

  // Sort
  filtered = [...filtered].sort((a, b) => {
    const valA = a[sortKey.value];
    const valB = b[sortKey.value];

    if (typeof valA === 'number' && typeof valB === 'number') {
      return ascKey.value ? valA - valB : valB - valA;
    } else {
      return ascKey.value
          ? String(valA).localeCompare(String(valB))
          : String(valB).localeCompare(String(valA));
    }
  });

  return filtered.slice(0, displayLimit.value);
});

const sortKey = ref('timestamp');
const ascKey = ref(false);

function sortBy(header) {
  if (header === 'station') {
    if (sortKey.value === 'stationName') {
      ascKey.value = !ascKey.value;
    } else {
      sortKey.value = 'stationName';
      ascKey.value = true;
    }
  } else {
    if (sortKey.value === header) {
      ascKey.value = !ascKey.value;
    } else {
      sortKey.value = header;
      ascKey.value = true;
    }
  }

  data.value.sort((a, b) => {
    const valA = a[sortKey.value] ?? a.station; // fallback naar station id
    const valB = b[sortKey.value] ?? b.station;

    if (typeof valA === 'number' && typeof valB === 'number') {
      return ascKey.value ? valA - valB : valB - valA;
    } else {
      return ascKey.value
          ? String(valA).localeCompare(String(valB))
          : String(valB).localeCompare(String(valA));
    }
  });
}

const stationsMap = ref({}) // stationID -> naam

async function fetchStations() {
  const stations = await fetchData('http://localhost:8080/stations');

  const map = {};
  stations.forEach(station => {
    map[station.name] = station.nearest_location?.name || 'Onbekend';
  });
  stationsMap.value = map;

  // Update bestaande data met de juiste stationName
  data.value.forEach(item => {
    item.stationName = stationsMap.value[item.station] || item.station;
  });
}
let intervalId = null;

onMounted(async () => {
  await fetchStations();
  await setData();
  intervalId = setInterval(setData, 5000);
});

onBeforeUnmount(() => {
  if (intervalId) clearInterval(intervalId);
});

async function setData() {
  const newMeasurements = await fetchData('http://localhost:8080/queries/WAE/0');
  newMeasurements.forEach(item => {
    if (!data.value.some(d => d.timestamp === item.timestamp && d.station === item.station)) {
      item.stationName = stationsMap.value[item.station] || item.station;
      data.value.push(item);
    }
  });
}

const downloadXML = () => {
  const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>\n';
  const rows = sortedFilteredData.value.map(row => {
    return `
  <row>
    <station>${row.station}</station>
    <timestamp>${row.timestamp}</timestamp>
    <temperature>${row.temperature}</temperature>
    <dewpoint_temperature>${row.dewpoint_temperature}</dewpoint_temperature>
    <air_pressure_station>${row.air_pressure_station}</air_pressure_station>
    <air_pressure_sea_level>${row.air_pressure_sea_level}</air_pressure_sea_level>
    <visibility>${row.visibility}</visibility>
    <wind_speed>${row.wind_speed}</wind_speed>
    <percipation>${row.percipation}</percipation>
    <snow_depth>${row.snow_depth}</snow_depth>
    <cloud_cover>${row.cloud_cover}</cloud_cover>
    <wind_direction>${row.wind_direction}</wind_direction>
  </row>`;
  }).join('');

  const xml = `${xmlHeader}<data>${rows}\n</data>`;
  const blob = new Blob([xml], { type: 'application/xml' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'filtered-data.xml';
  a.click();
  URL.revokeObjectURL(url);
};


const formatHeader = (header) => {
  const text = header.replace(/_/g, ' ')
  return text.charAt(0).toUpperCase() + text.slice(1)
}
</script>


<template>
  <div id="app">
    <div class="topPage">
      <div class="datefilter">
        <label>
          Start date/time:
          <input type="datetime-local" v-model="startDate"/>
        </label><br>
        <label>
          End date/time:
          <input type="datetime-local" v-model="endDate"/>
        </label>
      </div>
      <div class="stationfilter">
        <input
            type="text"
            v-model="stationFilter"
            placeholder="Filter on station"
        />
      </div>
      <div class="downloadXML">
        <button @click="downloadXML">Download as XML</button>
      </div>
      <div class="displayLimit">
        <label>
          Amount of data points shown:
          <input
              type="number"
              v-model.number="displayLimit"
              min="1"
              max="1000"
          />
        </label>
      </div>

    </div>
    <div class="grid-wrapper">
      <div class="grid">
        <!-- Headers -->
        <div v-for="header in headers" class="cell header" :key="header" @click="sortBy(header)">
          {{ formatHeader(header) }}
          <span v-if="sortKey === header">
                      {{ ascKey ? '▲' : '▼' }}
                    </span>
        </div>

        <template v-for="row in sortedFilteredData" :key="`${row.station}-${row.timestamp}`">
          <div v-for="header in headers" class="cell" :key="header + row.station">
            {{
              header === 'station'
                  ? (row.stationName || row.station)
                  : header === 'timestamp'
                      ? new Date(row[header]).toLocaleString()
                      : typeof row[header] === 'number'
                          ? row[header].toFixed(2)
                          : row[header]
            }}
          </div>
        </template>
      </div>
    </div>
  </div>
</template>


<style scoped>

.grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 8px;

  margin-top: 5px;

}

.grid-wrapper {
  max-height: 70vh;
  overflow-y: auto;
  overflow-x: auto;
}

.cell {
  padding: 6px 10px;
  border: 1px solid #ccc;
}

.header {
  font-weight: bold;
  background-color: #f0f0f0;
  cursor: pointer;
}

.topPage {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
  justify-content: center;
  background-color: #cccccc;
  padding: 4px;
}
.topPage > div {
  background-color: #aaaaaa;
  padding: 5px;
}


.stationfilter {
  order: 1;
}

.datefilter {
  order: 2;
}
.downloadXML {
  order: 4;
  background-color: transparent !important;
}
.displayLimit {
  order: 3;
}

#app {
  width: 100vw;
  padding: 10px;
}
</style>