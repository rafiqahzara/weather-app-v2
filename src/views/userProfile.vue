<script setup>
import { ref } from 'vue';
import { useRoute, useRouter } from "vue-router";

const router = useRouter();
const valid = ref(false);
const fullname = ref("Jane Doe");
const email = ref("jane@gmail.com");
const phone = ref("123 - 456 - 7890");
const isEditMode = ref(false);

// Validation rules
const nameRules = [
  (v) => !!v || 'Full name is required.',
];

const emailRules = [
  (v) => !!v || 'E-mail is required.',
  (v) => /.+@.+\..+/.test(v) || 'E-mail must be valid.',
];

const phoneRules = [
  (v) => !!v || 'Phone number is required.',
  (v) => /^\d{3} - \d{3} - \d{4}$/.test(v) || 'Phone number must follow the format xxx - xxx - xxxx.',
];

const toggleEditMode = () => {
  isEditMode.value = !isEditMode.value;
};

const submitForm = () => {
  isEditMode.value = false;
  console.log('Form submitted with:', { fullname: fullname.value, email: email.value, phone: phone.value });
};

const goBack = () => {
  router.back();
};
</script>

<template>
  <v-container>
    <v-btn @click="goBack" color="primary" outlined>
      Back
    </v-btn>
    <v-form v-model="valid" @submit.prevent="submitForm">
      <v-row>
        <v-col cols="12" md="4">
          <v-text-field
            v-model="fullname"
            :readonly="!isEditMode"
            :rules="nameRules"
            label="Full Name"
            required
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="4">
          <v-text-field
            v-model="email"
            :readonly="!isEditMode"
            :rules="emailRules"
            label="E-mail"
            required
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="4">
          <v-text-field
            v-model="phone"
            :readonly="!isEditMode"
            :rules="phoneRules"
            label="Phone Number"
            required
          ></v-text-field>
        </v-col>
        <v-col cols="12">
          <v-btn
            class="mt-2"
            color="primary"
            @click="isEditMode ? submitForm() : toggleEditMode()"
            block
          >
            {{ isEditMode ? "Submit" : "Edit" }}
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>
