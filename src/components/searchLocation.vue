<script setup>
import { useWeatherStore } from "@/stores/weatherStore";

const { searchQuery } = useWeatherStore();
</script>

<template>
  <v-text-field
    v-model="searchQuery"
    label="Search"
    prepend-inner-icon="mdi-magnify"
    variant="outlined"
    hide-details
    single-line
  ></v-text-field>
</template>
