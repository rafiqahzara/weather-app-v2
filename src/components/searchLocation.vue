<script setup>
import { useWeatherStore } from "@/stores/weatherStore";

const { searchQuery } = useWeatherStore();
</script>

<template>
<v-container>
  <v-text-field
    v-model="searchQuery"
    label="Search for a city or airport"
    prepend-inner-icon="mdi-magnify"
    variant="solo-filled"
    hide-details
    clearable
  ></v-text-field>
</v-container>
</template>

<style lang="scss">

.v-text-field {
  .v-field{
    border-radius: 15px;
    border: none !important;
  }
  .v-field--variant-solo, .v-field--variant-solo-filled{
    box-shadow: none !important;
  }
} 
</style>