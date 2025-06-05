<script setup>
import NavBar from '../NavBar.vue' 
</script>

<template>
    <NavBar />
     <body>
        <div id="app">
            <div class="grid">
            <!-- Headers -->
                <div v-for="header in headers" class="cell header" :key="header">
                    {{ formatHeader(header) }}
                </div>

                <!-- Data cells (flattened) -->
                <div v-for="row in data" :key="row.station">
                    <template v-for="header in headers" :key="header + row.station">
                        <div class="cell">{{ row[header] }}</div>
                    </template>
                </div>
            </div>
        </div>
    </body>
</template>

<script>
export default {
  data() {
    return {
      headers: [
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
      ],
      data: [
        {
            "station": "766753",
            "timestamp": 1748870591264,
            "temperature": 49.504785004539556,
            "dewpoint_temperature": 48.35806604094067,
            "air_pressure_station": 0.9008099775111472,
            "air_pressure_sea_level": 0.8785790324721788,
            "visibility": 68.59445409802903,
            "wind_speed": 168.73133136614047,
            "percipation": 0.14482830496075172,
            "snow_depth": 1.6899985874545687,
            "cloud_cover": 0.9589210697206183,
            "wind_direction": 119.25528374604502
        },
        {
            "station": "766910",
            "timestamp": 1748870591264,
            "temperature": 49.42472043960747,
            "dewpoint_temperature": 25.365393037460937,
            "air_pressure_station": 0.9151731806752441,
            "air_pressure_sea_level": 1.05574549076024,
            "visibility": 49.52831467798309,
            "wind_speed": 18.542271160316336,
            "percipation": 0.5791616296063034,
            "snow_depth": 9.465217923669002,
            "cloud_cover": 0.2846185045216967,
            "wind_direction": 39.659425478179514
        },
        {
            "station": "764125",
            "timestamp": 1748870591264,
            "temperature": 49.17833258416686,
            "dewpoint_temperature": 20.669921681366866,
            "air_pressure_station": 0.9570555223877618,
            "air_pressure_sea_level": 0.8776010505633575,
            "visibility": 9.834529320947047,
            "wind_speed": 233.31886693679792,
            "percipation": 0.6494871590573457,
            "snow_depth": 4.5182512571477,
            "cloud_cover": 0.25277716254977745,
            "wind_direction": 84.0434405234557
        },
        {
            "station": "783250",
            "timestamp": 1748870591264,
            "temperature": 48.822504617528026,
            "dewpoint_temperature": 46.79869682257114,
            "air_pressure_station": 0.9643336557060149,
            "air_pressure_sea_level": 0.9998124914455302,
            "visibility": 65.16355002508551,
            "wind_speed": 90.1802190204658,
            "percipation": 0.5444660620191386,
            "snow_depth": 6.264358071216769,
            "cloud_cover": 0.3784194496374993,
            "wind_direction": 80.83117395453259
        },
        {
            "station": "784580",
            "timestamp": 1748870591264,
            "temperature": 48.4515474962876,
            "dewpoint_temperature": 28.17845491739216,
            "air_pressure_station": 0.9828155557255608,
            "air_pressure_sea_level": 0.9848754597909604,
            "visibility": 25.508770943188516,
            "wind_speed": 211.1622514061105,
            "percipation": 0.15375219413741825,
            "snow_depth": 3.3018764841341066,
            "cloud_cover": 0.007946656478386327,
            "wind_direction": 345.9918180029945
        },
        {
            "station": "761180",
            "timestamp": 1748870591264,
            "temperature": 47.960423161567654,
            "dewpoint_temperature": 21.73432090467452,
            "air_pressure_station": 0.904430760978245,
            "air_pressure_sea_level": 0.988804514280429,
            "visibility": 79.90870776808075,
            "wind_speed": 244.79381312255575,
            "percipation": 0.8791152436017842,
            "snow_depth": 3.250539928392981,
            "cloud_cover": 0.9415976211456913,
            "wind_direction": 330.63141465582896
        },
        {
            "station": "766491",
            "timestamp": 1748870591264,
            "temperature": 47.90139704182679,
            "dewpoint_temperature": 12.40494039912895,
            "air_pressure_station": 0.9952597529828063,
            "air_pressure_sea_level": 0.933080752503368,
            "visibility": 48.98561600749848,
            "wind_speed": 270.8219138046677,
            "percipation": 0.5219430116136794,
            "snow_depth": 9.340683736617066,
            "cloud_cover": 0.22312861252737792,
            "wind_direction": 63.81571203062918
        },
        {
            "station": "784600",
            "timestamp": 1748870591264,
            "temperature": 47.16793311514762,
            "dewpoint_temperature": 48.88553016909649,
            "air_pressure_station": 0.8995276672052336,
            "air_pressure_sea_level": 0.9945851793333763,
            "visibility": 40.45677058568204,
            "wind_speed": 229.6871702592551,
            "percipation": 0.2716451521903305,
            "snow_depth": 4.584818312847324,
            "cloud_cover": 0.4959619455935478,
            "wind_direction": 160.93277421119575
        },
        {
            "station": "766540",
            "timestamp": 1748870591264,
            "temperature": 46.95743081388567,
            "dewpoint_temperature": 31.507105481361165,
            "air_pressure_station": 0.8948193822610453,
            "air_pressure_sea_level": 0.9822399000482643,
            "visibility": 74.79980189814155,
            "wind_speed": 296.8787489508434,
            "percipation": 0.6340022867322166,
            "snow_depth": 8.669569363078729,
            "cloud_cover": 0.12190127686601859,
            "wind_direction": 229.49834476835832
        },
        {
            "station": "768556",
            "timestamp": 1748870591264,
            "temperature": 46.817129910295286,
            "dewpoint_temperature": 22.859369948038566,
            "air_pressure_station": 1.0428764894987785,
            "air_pressure_sea_level": 0.897884800058228,
            "visibility": 30.483054433946084,
            "wind_speed": 11.831666608549469,
            "percipation": 0.5321310466394673,
            "snow_depth": 4.493499249667935,
            "cloud_cover": 0.4921376205007266,
            "wind_direction": 62.084263354581594
        }
      ]
    };
  },
  methods: {
    formatHeader(header) {
      const text = header.replace(/_/g, ' ');
      return text.charAt(0).toUpperCase() + text.slice(1);
    }
  }
};
</script>

<style scoped>
  .grid {
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    gap: 8px;
    padding: 20px;
}

.cell {
    padding: 6px 10px;
    border: 1px solid #ccc;
}

.header {
    font-weight: bold;
    background-color: #f0f0f0;
}
</style>