<script setup>
import { computed, onMounted } from "vue";
import { useWeatherStore } from "@/stores/weatherStore";

// Access the weather store
const { weatherData, getCityID, fetchWeatherData } = useWeatherStore();
const { filteredWeatherData } = useWeatherStore();

// Fetch city IDs and weather data on component mount
onMounted(async () => {
  await getCityID();
  await fetchWeatherData();
});

// Process weather data to fit the desired structure
const list = computed(() => {
  return filteredWeatherData.value.map((data) => ({
    id: data.id || "Unknown ID",
    location: data.name || "Unknown Location",
    city: data.sys.country || "Unknown Country",
    status: data.weather[0]?.description || "No Status",
    temperature: (data.main.temp - 273.15).toFixed(1), // Convert to Celsius
    highTemp: (data.main.temp_max - 273.15).toFixed(1), // Convert to Celsius
    lowTemp: (data.main.temp_min - 273.15).toFixed(1), // Convert to Celsius
    currentTime: new Date(data.dt * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  }));
});

</script>

<template>
  <v-container>
    <v-card v-for="(item, index) in list" :key="index" class="mb-5">
      <router-link :to="`/details/${item.id}`" style="text-decoration: none; color: inherit;">
      <v-card-item>
        <v-row align="center" no-gutters>
          <v-col cols="8">
            <v-card-title>{{ item.location }}</v-card-title>
            <v-card-subtitle>{{ item.city }} {{ item.currentTime }}</v-card-subtitle>
          </v-col>
          <v-col class="text-h4 text-end" cols="4">
            {{ item.temperature }}&deg;
          </v-col>
        </v-row>
      </v-card-item>

      <v-card-text>
        <v-row align="center" dense>
          <v-col cols="6" class="status">
            {{ item.status }}
          </v-col>
          <v-col cols="3" class="text-end">
            H: {{ item.highTemp }}&deg;
          </v-col>
          <v-col cols="3" class="text-end">
            L: {{ item.lowTemp }}&deg;
          </v-col>
        </v-row>
      </v-card-text>
      </router-link>
    </v-card>
  </v-container>
</template>

<style>
.status {
  text-transform: capitalize;
}
</style>
