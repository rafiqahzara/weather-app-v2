<script setup>
import { ref } from 'vue';

const items = [
  {
    title: 'recipe with chicken',
  },
  {
    prependIcon: 'mdi-clock-outline',
    title: 'best hiking trails near me',
  },
  {
    prependIcon: 'mdi-clock-outline',
    title: 'how to learn a new language',
  },
  {
    prependIcon: 'mdi-clock-outline',
    title: 'DIY home organization ideas',
  },
  {
    prependIcon: 'mdi-clock-outline',
    title: 'latest fashion trends',
  },
]

</script>

<template>
    <v-autocomplete
      :items="items"
      append-inner-icon="mdi-close-circle-outline"
      class="mx-auto"
      density="comfortable"
      menu-icon=""
      placeholder="Search for a city or airport"
      prepend-inner-icon="mdi-magnify"
      style="max-width: 350px;"
      theme="light"
      variant="solo"
      auto-select-first
      item-props
      rounded
    ></v-autocomplete>
</template>

<style lang="scss">

</style>