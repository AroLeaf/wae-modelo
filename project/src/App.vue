<script setup>  
import MexicoMap from './components/MexicoMap.vue'
import Top10 from './components/Top10.vue';
</script>

<template>
  <MexicoMap/>
  <div class="dataContainer">
    <h1>Top 10 temperatures</h1>
    <top10/>
  </div>
</template>

<style>
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