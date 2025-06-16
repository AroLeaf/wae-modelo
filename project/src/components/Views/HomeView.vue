<script setup>
import NavBar from '../NavBar.vue' 
import MexicoMap from '../MexicoMap.vue'
import Top10 from '../Top10.vue';
</script>

<template>
  <div class="content">
    <MexicoMap/>
    <div class="dataContainer">
      <h1>Top 10 temperatures</h1>
      <div class="data">
        <top10/>
      </div>
    </div>
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

div.content {
  display: flex;
  flex-direction: row;
  gap: 20px;
}

div.dataContainer {
  background-color: rgb(238, 238, 238);
  border-radius: 10px;
  padding: 1.5vh 3vw;
  min-height: 30vw;
  height: 100vh;
  align-items: center;
  margin: 1%;
}

div.data {
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-color: rgb(238, 238, 238);
  color: rgb(17, 33, 66);
  padding: 10px;
  gap: 0;
}

div.map {
  width: 100%;
  height: 80vh;
  margin-bottom: 10vh;
}

@media (max-width: 1000px) {
  div.content {
    flex-direction: column;
    align-items: center;
  }
  div.dataContainer {
    margin: 0;
  }
  
  div.data {
    font-size:110%; 
    flex-direction: row;
    gap: 15px;
  }

  div.map {
  width: 100%;
  height: 40vh;
  margin-bottom: 5vh;
}
}
</style>