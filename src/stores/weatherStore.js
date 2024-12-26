import { ref, toRaw } from 'vue';
import axios from 'axios';

const weatherData = ref([]);
const forecastData = ref([]);
const error = ref(null);
const APPID = import.meta.env.VITE_OPENWEATHER_API_KEY;
const baseURL = 'http://api.openweathermap.org/data/2.5/';
const cities = ["Kuala Lumpur,Malaysia", "London,uk", "Seongnam-si,Korea", "Milan,italy"];
const cityIDs = ref([]);

const getCityID = async () => {
  try {
    const requests = cities.map((city) =>
      axios.get(baseURL + 'weather', {
        params: {
          q: city,
          APPID: APPID,
        },
      })
    );
    const responses = await Promise.all(requests);
    cityIDs.value = responses.map((response) => response.data.id);
  } catch (err) {
    error.value = 'Error fetching city IDs: ' + err.message;
    console.error('Error fetching city IDs:', err);
  }
};

const fetchWeatherData = async () => {
  try {
    const requests = cityIDs.value.map((id) =>
      axios.get(baseURL + 'weather', {
        params: {
          id,
          APPID: APPID,
        },
      })
    );
    const responses = await Promise.all(requests);
    console.log("fetchWeatherData responses:", responses)
    weatherData.value = responses.map((response) => response.data);
  } catch (err) {
    error.value = 'Error fetching weather data: ' + err.message;
    console.error('Error fetching weather data:', err);
  }
};

const fetchForecastData = async (id = null) => {
  try {
    let requests;

    if (id){
        requests = [
            axios.get(baseURL + 'forecast', {
                params: {
                    id,
                    APPID: APPID,
                },
            })
        ]
    }
    const responses = await Promise.all(requests);
    console.log("fetchForecastData responses:", responses[0].data);
    forecastData.value = responses.map((response) => response.data);
  } catch (err) {
    error.value = 'Error fetching forecast data: ' + err.message;
    console.error('Error fetching forecast data:', err);
  }
};

export const useWeatherStore = () => ({
  weatherData,
  forecastData,
  error,
  getCityID,
  fetchWeatherData,
  fetchForecastData,
});
