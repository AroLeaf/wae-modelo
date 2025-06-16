<script setup>
    import datatest from '../../../IWA/data/datatest.json'

    const sortedMap = datatest.MexicoStates
    .map(state => ({
        name: state.name,
        temperature: state.temperature
    }))
    .sort((a, b) => b.temperature - a.temperature);
</script>
<template>
    <div>
        <div v-for="(state, index) in sortedMap" :key="state.name" style="list-style-type:none;">
            <li v-if="index < 5">
                <b>{{index + 1 }}.</b> {{ state.name }} {{state.temperature}}°C
            </li>
        </div>
    </div>

    <div>
        <div v-for="(state, index) in sortedMap" :key="state.name" style="list-style-type:none;">
            <li v-if="4 < index && index < 10">
                <b>{{index + 1 }}.</b> {{ state.name }} {{state.temperature}}°C
            </li>
        </div>
    </div>
</template>