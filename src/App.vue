<script setup>
</script>

<template>
  <header>
    <v-app>
      <v-app-bar :elevation="0">
        <v-app-bar-title>Weather</v-app-bar-title>
        <template v-slot:append>
          <v-btn icon="mdi-account-outline"></v-btn>
        </template>
      </v-app-bar>
    </v-app>
  </header>
  <router-view />
</template>

<style lang="scss">
.v-application__wrap{
  margin-top: 50px;
  min-height: 0 !important;
}
</style>
