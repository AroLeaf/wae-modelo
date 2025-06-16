<script setup>
    import datatest from '../assets/datatest.json';

    const sortedMap = datatest.MexicoStates
    .map(state => ({
        name: state.name,
        temperature: state.temperature
    }))
    .sort((a, b) => b.temperature - a.temperature);
</script>
<template>
    <div v-for="(state, index) in sortedMap" :key="state.name" style="list-style-type:none;">
        <li v-if="index < 10">
            {{index + 1 }}. {{ state.name }} {{state.temperature}}°C
        </li>
    </div>
</template>