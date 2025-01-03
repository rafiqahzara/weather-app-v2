<script setup>
import { computed, onMounted } from "vue";
import { useWeatherStore } from "@/stores/weatherStore";

// Access the weather store
const { weatherData, getCityID, fetchWeatherData } = useWeatherStore();
const { filteredWeatherData } = useWeatherStore();
// const currentTime = ref(null)

// Fetch city IDs and weather data on component mount
onMounted(async () => {
  await getCityID();
  await fetchWeatherData();
});

// Process weather data to fit the desired structure
const list = computed(() => {
  return filteredWeatherData.value.map((data) => {
    const localTimestamp = (data.dt + data.timezone) * 1000; // Adjust for timezone
    const localTime = new Date(localTimestamp);
    return {
      id: data.id || "Unknown ID",
      location: data.name || "Unknown Location",
      city: data.sys.country || "Unknown Country",
      status: data.weather[0]?.description || "No Status",
      temperature: (data.main.temp - 273.15).toFixed(1),
      highTemp: (data.main.temp_max - 273.15).toFixed(1),
      lowTemp: (data.main.temp_min - 273.15).toFixed(1),
      currentTime: localTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      hour: localTime.getHours(), // Extract the hour for background
    };
  });
});

const getImageBg = (hour) => {
  if (hour >= 6 && hour < 18) {
    return "src/assets/img/day.png"; // Daytime color
  }
  return "src/assets/img/night.png"; // Nighttime color
};
</script>

<template>
  <v-container>
    <!-- :color="getCardColor(item.hour)" -->
    <v-card v-for="(item, index) in list" :key="index" 
      :image="getImageBg(item.hour)"
      class="mb-5 city-card">
      <router-link :to="`/details/${item.id}`" style="text-decoration: none; color: inherit;">
      <v-card-item>
        <v-row align="center" no-gutters>
          <v-col cols="7">
            <v-card-title class="city-card-title">{{ item.location }}</v-card-title>
            <v-card-subtitle>{{ item.city }} {{ item.currentTime }}</v-card-subtitle>
          </v-col>
          <v-col class="text-h3 text-end" cols="5">
            {{ item.temperature }}&deg;
          </v-col>
        </v-row>
      </v-card-item>

      <v-card-text class="mt-4">
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

<style lang="scss">
.status {
  text-transform: capitalize;
}
.city-card{
  border-radius: 20px !important;
  box-shadow: none !important;
  color: white !important;

  .city-card-title{
    font-weight: 800;
  }
}
</style>
