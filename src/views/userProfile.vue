<script setup>
import { ref, computed, watch } from 'vue';
import { useRoute, useRouter } from "vue-router";

const router = useRouter();
const valid = ref(false);
let oldFullname = ref("Jane Doe");
let oldEmail = ref("jane@gmail.com");
let oldPhone = ref("123 - 456 - 7890");
let loading = ref(false)
const fullname = ref("Jane Doe");
const email = ref("jane@gmail.com");
const phone = ref("123 - 456 - 7890");
const isEditMode = ref(false);

// Computed properties for form fields
const displayedFullname = computed(() => (isEditMode.value ? fullname.value : oldFullname.value));
const displayedEmail = computed(() => (isEditMode.value ? email.value : oldEmail.value));
const displayedPhone = computed(() => (isEditMode.value ? phone.value : oldPhone.value));

// Validation rules
const nameRules = [
  (v) => !!v || "Full name is required.",
  (v) => /^[A-Za-z ,.'-/]+$/.test(v) || "Full name must contain only alphabetic characters",
  (v) => (v && v.length >= 3 && v.length <= 35) || "Full Name must be between 3 to 35 characters",
];

const emailRules = [
  (v) => !!v || "Email is required",
  (v) => /^.+@.+\..+$/.test(v) || "E-mail must be valid",
  (v) => (v || "").indexOf(" ") < 0 || "No spaces are allowed",
];

const phoneRules = [
  (v) => !!v || 'Phone number is required.',
  (v) => /^\d{3} - \d{3} - \d{4}$/.test(v) || 'Phone number must follow the format xxx - xxx - xxxx.',
];

watch(valid, (newVal) => {
  if (newVal) {
    loading.value = false; // Reset loading when form becomes valid
  }
});

const toggleEditMode = () => {
  isEditMode.value = !isEditMode.value;
};

const submitForm = () => {
  if (!valid.value) {
    console.log("Validation failed. Form not submitted.");
    loading.value = true;
    return;
  }else {
     loading.value = false;
  }

  isEditMode.value = false;
  oldFullname.value = fullname.value;
  oldEmail.value = email.value;
  oldPhone.value = phone.value;
  
  console.log('Form submitted with:', { fullname: fullname.value, email: email.value, phone: phone.value });
};

const goBack = () => {
  router.back();
};
</script>


<template>
  <v-container class="profile">
    <div class="profile-info">
      <v-card variant="text" class="text-center">
      <v-card-item>
        <v-row align="center" class="mb-3">
          <v-col cols="2">
            <v-btn icon="mdi mdi-chevron-left" variant="plain" @click="goBack"></v-btn>
          </v-col>
          <v-col cols="8">
            <v-card-title>Edit Profile</v-card-title>
          </v-col>
        </v-row>
      </v-card-item>
      <v-card-text class="text-center">
        <v-img
          :width="100"
          aspect-ratio="1/1"
          cover
          class="mx-auto mb-5"
          src="src/assets/img/profile.svg" alt="Weather Icon" >
          </v-img>
        {{oldFullname}} <br>
        {{oldEmail}} | {{oldPhone}}
      </v-card-text>
    </v-card>
    </div>

    <v-form v-model="valid" @submit.prevent="submitForm"
    class="mx-5">
      <v-row class="mx-1">
        <v-col cols="12" md="4" class="pt-0 pb-2">
          <v-text-field
            v-model="fullname"
            :value="displayedFullname"
            :readonly="!isEditMode"
            :rules="nameRules"
            :class="{ 'edited': isEditMode }"
            variant="solo-filled"
            label="Full Name"
            required
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="4" class="pt-0 pb-2">
          <v-text-field
            v-model="email"
            :value="displayedEmail"
            :readonly="!isEditMode"
            :rules="emailRules"
            :class="{ 'edited': isEditMode }"
            variant="solo-filled"
            label="E-mail"
            required
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="4" class="pt-0 pb-2">
          <v-text-field
            v-model="phone"
            :value="displayedPhone"
            :readonly="!isEditMode"
            :rules="phoneRules"
            :class="{ 'edited': isEditMode }"
            variant="solo-filled"
            label="Phone Number"
            required
          ></v-text-field>
        </v-col>
        <v-col cols="12">
          <v-btn
            variant="text"
            class="button"
            color="white"
            @click="isEditMode ? submitForm() : toggleEditMode()"
            block
            :loading="loading">
            {{ isEditMode ? "Submit" : "Edit" }}
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>

<style lang="scss">
.profile{
  padding: 0 !important;
  .profile-info{
    background-image: url("src/assets/img/half-circle-bg.png");
    background-position: top;
    background-size: 100% 60%;
    .v-card-text{
      padding: 40px 0;
    }
  }
  .v-text-field {
    .v-field{
      border-radius: 15px;
      border: none;
    }
    .v-field--variant-solo, .v-field--variant-solo-filled{
      box-shadow: none !important;
    }
  } 

  .edited{
    .v-field{
      border: 1px solid #2E3A5A !important;
    }
  }
  .button{
    background-color: #2E3A5A;
  }
}

</style>
