<script setup>
import cityList from '../components/cityList.vue'
import searchLocation from '../components/searchLocation.vue'
import { useRouter } from "vue-router";
const router = useRouter();

const profile = () => {
  router.push({ name: 'profile' });
};

</script>

<template>
  <header>
    <v-app>
      <v-app-bar :elevation="0">
        <v-app-bar-title class="text-h4">Weather</v-app-bar-title>
        <template v-slot:append>
          <v-btn icon="mdi-account-outline" @click="profile"></v-btn>
        </template>
      </v-app-bar>
    </v-app>
  </header>
  <main>
    <searchLocation />
    <cityList />
  </main>
</template>
