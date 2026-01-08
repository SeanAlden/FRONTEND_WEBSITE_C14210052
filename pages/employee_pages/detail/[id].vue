<template>
  <div class="container relative p-6 mx-auto">
    <h1 class="mb-4 text-2xl font-bold text-center">Detail Karyawan</h1>

    <!-- LOADING SPINNER -->
    <div
      v-if="isLoading"
      class="items-center p-6 bg-white rounded-lg shadow-md"
    >
      <div
        class="w-16 h-16 border-8 border-t-8 border-gray-200 rounded-full loader"
      ></div>
    </div>

    <!-- DATA KARYAWAN -->
    <div
      v-if="employee && !isLoading"
      class="p-6 bg-white rounded-lg shadow-md"
    >
      <div class="flex flex-col items-center text-center md:text-left">
        <!-- Foto -->
        <img
          :src="employee.employee_photo ? employee.employee_photo : fallbackImage"
          @error="onImageError"
          class="object-cover w-40 h-40 mb-4 rounded-lg"
        />

        <!-- Detail informasi -->
        <div class="w-full">
          <p><strong>Kode:</strong> {{ employee.code }}</p>
          <p><strong>Nama:</strong> {{ employee.employee_name }}</p>
          <p><strong>Posisi:</strong> {{ employee.employee_position }}</p>
          <p><strong>Kontak:</strong> {{ employee.employee_contact }}</p>
          <p><strong>Tanggal Lahir:</strong> {{ employee.employee_birth }}</p>
          <p><strong>Deskripsi:</strong></p>
          <p class="whitespace-pre-line">
            {{ employee.employee_description }}
          </p>
        </div>
      </div>

      <div class="flex justify-center mt-4">
        <router-link
          to="/employee_pages/employees"
          class="px-4 py-2 text-white bg-gray-600 rounded"
        >
          Kembali
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";

const route = useRoute();
const employee = ref(null);
const isLoading = ref(true);

const fallbackImage = "/assets/images/photo_default.png";

definePageMeta({
  middleware: ["auth"],
});

const fetchEmployeeDetail = async () => {
  isLoading.value = true;
  try {
    const response = await axios.get(
      useApi(`/api/api/employees/${route.params.id}`)
    );
    employee.value = response.data.data;
  } catch (error) {
    console.error("Error fetching employee details:", error);
  } finally {
    isLoading.value = false;
  }
};

const onImageError = (event) => {
  event.target.src = fallbackImage;
};

onMounted(fetchEmployeeDetail);
</script>

<style scoped>
.loader {
  border-top-color: #3498db;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
