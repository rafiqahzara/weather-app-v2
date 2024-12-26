<script setup>
import { computed, onMounted } from "vue";
import { useWeatherStore } from "@/stores/weatherStore";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const cityId = route.params.id;
const { forecastData, fetchForecastData } = useWeatherStore();

const goBack = () => {
  router.back();
};

// Function to get today's date in YYYY-MM-DD format
const getTodayDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const todayDate = getTodayDate();

onMounted(async () => {
  await fetchForecastData(cityId);
});

// Extract today's weather data
const todayWeather = computed(() => {
  if (!forecastData.value.length) return null;

  const data = forecastData.value[0]; 

  const todayForecast = data.list.find((item) =>
    item.dt_txt.startsWith(todayDate)
  );
  if (todayForecast) {
    return {
      location: data.city.name || "Unknown Location",
      city: data.city.country || "Unknown Country",
      temperature: `${Math.round(todayForecast.main.temp - 273.15)}°C`, // Convert Kelvin to Celsius
      description: todayForecast.weather[0].description || "No data",
      icon: todayForecast.weather[0].icon || "No data",
      date: new Date(todayForecast.dt_txt).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    };
  }

  return null;
});

const hourlyForecast = computed(() => {
  if (!forecastData.value.length) return [];
  const data = forecastData.value[0];
  return data.list.filter((item) => item.dt_txt.startsWith(todayDate));
});

const weeklyForecast = computed(() => {
  if (!forecastData.value.length) return [];

  const groupedByDay = forecastData.value[0].list.reduce((acc, forecast) => {
    const date = new Date(forecast.dt_txt);
    const day = date.toLocaleDateString("en-US", { weekday: "long" });
    if (!acc[day]) {
      acc[day] = {
        date: date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
        forecasts: [],
      };
    }
    acc[day].forecasts.push(forecast);
    return acc;
  }, {});

  // Map grouped data into the required format
  return Object.keys(groupedByDay).map((day) => {
    const dayData = groupedByDay[day].forecasts;
    const avgTemp =
      dayData.reduce((sum, item) => sum + item.main.temp, 0) / dayData.length;

    return {
      day,
      date: groupedByDay[day].date, // Add the date
      temperature: `${Math.round(avgTemp - 273.15)}°C`,
      description: dayData[0].weather[0].description,
      main: dayData[0].weather[0].main,
      icon: dayData[0].weather[0].icon,
    };
  });
});

</script>


<template>
  <v-container v-if="todayWeather">
     <v-btn @click="goBack" color="primary" outlined>
      Back
    </v-btn>
    <v-card
    class="text-center"
    color="blue-darken-2">
      <v-card-item>
        <v-card-title>{{ todayWeather.location }}, {{ todayWeather.city }}</v-card-title>
        <v-card-subtitle>{{ todayWeather.date }}</v-card-subtitle>
      </v-card-item>
      <v-card-text class="weather-info">
        <img :src="`http://openweathermap.org/img/wn/${todayWeather.icon}@2x.png`" alt="Weather Icon" />
        <div class="temperature">{{ todayWeather.temperature }}</div>
        <div class="description">{{ todayWeather.description }}</div>
      </v-card-text>
    </v-card>

    <h2 class="my-5"> Hourly Forecast</h2>
     <v-row class="hourly-forecast">
      <v-col
        v-for="(hour, index) in hourlyForecast"
        :key="index"
        cols="4"
        md="4"
        class="text-center">
        <v-card class="hour-card" outlined>
            <v-card-title>
                <v-img
                    aspect-ratio="1/1"
                    contain
                    :src="`http://openweathermap.org/img/wn/${hour.weather[0].icon}@2x.png`"
                    alt="Weather Icon"
                ></v-img>
            </v-card-title>
            <v-card-text>
                <h3>{{ `${Math.round(hour.main.temp - 273.15)}°C` }}</h3>
                <p>{{ new Date(hour.dt_txt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}</p>
            </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <h2 class="my-5">Weekly Forecast</h2>
    <v-row>
      <v-col
        v-for="(day, index) in weeklyForecast"
        :key="index"
        cols="12"
        md="6"
        lg="4"
      >
        <v-card class="weekly-card" outlined>
          <v-card-item>
            <v-row>
                <v-col cols="3">
                    <v-img
                    aspect-ratio="1/1"
                    contain
                     :src="`http://openweathermap.org/img/wn/${day.icon}@2x.png`"
                    alt="Weather Icon"
                ></v-img>
                </v-col>
                <v-col cols="6">
                    <h3 class="day">{{ day.day }}</h3>
                    <p class="description">
                        <small> {{ day.date }} </small><br>
                        {{ day.main }}
                    </p>
                </v-col>
                <v-col cols="3">
                    <h4 class="temperature">{{ day.temperature }}</h4>
                </v-col>
            </v-row>
          </v-card-item>
        </v-card>
      </v-col>
    </v-row>

  </v-container>
</template>

<style lang="scss">
/* #app {
    padding: 0 !important;
} */
.v-container{
    padding: 0 !important;
}
.description{
    text-transform: capitalize;
}
.hourly-forecast{
    -ms-overflow-style: none;  
    scrollbar-width: none; 
    flex-wrap: nowrap !important;
    overflow: auto;
    align-items: stretch;
    &::-webkit-scrollbar { 
        display: none; 
    }
}
.hour-card{

    .v-card-title{
        padding: 0 !important;
    }
    .v-card-text{
        padding: 0 0 10px 0 !important;
    }
}

</style>