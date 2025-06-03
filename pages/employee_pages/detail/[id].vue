<template>
  <div class="container mx-auto p-6">
    <h1 class="mb-4 text-center text-2xl font-bold">Detail Karyawan</h1>
    <div v-if="employee" class="rounded-lg bg-white p-6 shadow-md">
      <div class="flex flex-col items-center text-center md:flex-col md:text-left">
        <!-- Foto berada di atas -->
        <img
          :src="
            employee.employee_photo
              ? useApi(`/storage/${employee.employee_photo}`)
              : fallbackImage
          "
          @error="onImageError"
          class="mb-4 h-40 w-40 rounded-lg object-cover"
        />
        <!-- Detail informasi -->
        <div class="w-full">
          <p><strong>Kode:</strong> {{ employee.code }}</p>
          <p><strong>Nama:</strong> {{ employee.employee_name }}</p>
          <p><strong>Posisi:</strong> {{ employee.employee_position }}</p>
          <p><strong>Kontak:</strong> {{ employee.employee_contact }}</p>
          <p><strong>Tanggal Lahir:</strong> {{ employee.employee_birth }}</p>
          <p>
            <strong>Deskripsi:</strong>
          </p>
          <p class="whitespace-pre-line">
            {{ employee.employee_description }}
          </p>
        </div>
      </div>
      <div class="mt-4 flex justify-center">
        <router-link
          to="/employee_pages/employees"
          class="rounded bg-gray-600 px-4 py-2 text-white"
        >
          Kembali
        </router-link>
      </div>
    </div>
    <p v-else class="text-center text-red-500">Data karyawan tidak ditemukan.</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";

const route = useRoute();
const employee = ref(null);

const fallbackImage = "/assets/images/photo_default.png";

definePageMeta({
  middleware: ["auth"],
});

const fetchEmployeeDetail = async () => {
  try {
    const response = await axios.get(useApi(`/api/employees/${route.params.id}`));
    employee.value = response.data.data;
  } catch (error) {
    console.error("Error fetching employee details:", error);
  }
};

const onImageError = (event) => {
  event.target.src = fallbackImage;
};

onMounted(fetchEmployeeDetail);
</script>
