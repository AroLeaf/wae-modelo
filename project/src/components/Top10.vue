<script setup>
    import { ref } from 'vue';
    
    const top10temps =  ref([
        {key: 1, name: "Durango", temp: 35},
        {key: 2, name: "Sonora", temp: 33}
    ]);
</script>
<template>
    <p v-for="{temp, name, key} in top10temps">
        {{key + ". " + name + ": " + temp}}
    </p>
</template>