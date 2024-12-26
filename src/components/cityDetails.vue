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
  <v-container v-if="todayWeather" class="city-details">
    <div class="city-banner">
    <v-card variant="text" class="text-center">
      <v-card-item>
        <v-row align="center" class="mb-3">
          <v-col cols="2">
            <v-btn icon="mdi mdi-chevron-left" variant="plain" @click="goBack"></v-btn>
          </v-col>
          <v-col cols="8">
            <v-card-title>{{ todayWeather.location }}, {{ todayWeather.city }}</v-card-title>
          </v-col>
        </v-row>
        <v-card-subtitle>{{ todayWeather.date }}</v-card-subtitle>
      </v-card-item>
      <v-card-text class="weather-info text-center">
        <v-img
          :width="100"
          aspect-ratio="1/1"
          cover
          class="mx-auto"
          :src="`http://openweathermap.org/img/wn/${todayWeather.icon}@2x.png`" alt="Weather Icon" ></v-img>
        <div class="temperature text-h6">{{ todayWeather.temperature }}</div>
        <div class="description text-h5">{{ todayWeather.description }}</div>
      </v-card-text>
    </v-card>
    </div>

    <h2 class="my-5 mx-5 text-h5"> Hourly Forecast</h2>
     <v-row class="hourly-forecast mx-3">
      <v-col
        v-for="(hour, index) in hourlyForecast"
        :key="index"
        cols="4"
        md="4"
        class="text-center">
        <v-card class="hour-card" variant="text">
            <v-card-title>
                <v-img
                    :width="100"
                    aspect-ratio="1/1"
                    cover
                    class="mx-auto"
                    :src="`http://openweathermap.org/img/wn/${hour.weather[0].icon}@2x.png`"
                    alt="Weather Icon"
                ></v-img>
            </v-card-title>
            <v-card-text>
                <h3>{{ `${Math.round(hour.main.temp - 273.15)}°` }}</h3>
                <p>{{ new Date(hour.dt_txt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}</p>
            </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <h2 class="my-5 mx-5 text-h5">Weekly Forecast</h2>
    <v-row class="weekly-forecast mx-3">
      <v-col
        v-for="(day, index) in weeklyForecast"
        :key="index"
        cols="12"
        md="6"
        lg="4"
      >
        <v-card class="weekly-card" variant="text">
          <v-card-item>
            <v-row align="center">
                <v-col cols="3">
                    <v-img
                    :width="100"
                    aspect-ratio="1/1"
                    cover
                    class="mx-auto"
                    :src="`http://openweathermap.org/img/wn/${day.icon}@2x.png`"
                    alt="Weather Icon"
                ></v-img>
                </v-col>
                <v-col cols="6">
                    <h3>{{ day.day }}</h3>
                    <p>
                        <small> {{ day.date }} </small><br>
                        {{ day.main }}
                    </p>
                </v-col>
                <v-col cols="3">
                    <h3>{{ day.temperature }}</h3>
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
.city-details{
   padding: 0px !important;

  .city-banner{
    background-image: linear-gradient(to bottom right, #4F80FA, #3764D7, #335FD1);
    color: white;
    padding: 20px 0;
  }
  .weather-info{
    .description{
      &.text-h5{
        text-transform: capitalize !important;
      }
  }
  }
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
    .hour-card{
      border:1px solid #E0E0E0;
      border-radius: 10px;
      .v-card-title{
        padding: 0 !important;
      }
      .v-card-text{
        padding: 0 0 10px 0 !important;
        h3{
          font-weight: 700;
        }
        p{
          font-weight: 300;
        }
      }
    }
}
.weekly-forecast{
  .weekly-card{
    background-color: #D2DFFF;
    border-radius: 12px;
    .v-img{
      background-color: #9AB6FF;
      border-radius: 100px;
    }
    .v-card-item{
      h3{
        font-weight: 700;
      }
      p, small{
        font-weight: 300;
      }
    }
  }
}

</style>