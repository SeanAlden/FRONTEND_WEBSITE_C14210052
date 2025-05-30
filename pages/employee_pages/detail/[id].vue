<template>
  <div class="container p-6 mx-auto">
    <h1 class="mb-4 text-2xl font-bold text-center">Detail Karyawan</h1>
    <div v-if="employee" class="p-6 bg-white rounded-lg shadow-md">
      <div class="flex flex-col items-center text-center md:flex-col md:text-left">
        <!-- Foto berada di atas -->
        <img
          :src="
            employee.employee_photo
              ? useApi(`/storage/${employee.employee_photo}`)
              : '/assets/images/photo_default.png'
          "
          class="object-cover w-40 h-40 mb-4 rounded-lg"
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
      <div class="flex justify-center mt-4">
        <router-link
          to="/employee_pages/employees"
          class="px-4 py-2 text-white bg-gray-600 rounded"
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

definePageMeta({
  middleware: ["auth"],
});

const fetchEmployeeDetail = async () => {
  try {
    const response = await axios.get(
      useApi(`/api/employees/${route.params.id}`)
    );
    employee.value = response.data.data;
  } catch (error) {
    console.error("Error fetching employee details:", error);
  }
};

onMounted(fetchEmployeeDetail);
</script>
