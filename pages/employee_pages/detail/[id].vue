<template>
  <div class="mx-auto p-6 container">
    <h1 class="mb-4 font-bold text-2xl text-center">Detail Karyawan</h1>
    <div v-if="employee" class="bg-white shadow-md p-6 rounded-lg">
      <div class="flex flex-col md:flex-col items-center md:text-left text-center">
        <!-- Foto berada di atas -->
        <img
          :src="employee.employee_photo ? `http://localhost:8000/storage/${employee.employee_photo}` : '/assets/images/photo_default.png'"
          class="mb-4 rounded-lg w-40 h-40 object-cover"
        />
        <!-- Detail informasi -->
        <div class="w-full">
          <p><strong>Kode:</strong> {{ employee.code }}</p>
          <p><strong>Nama:</strong> {{ employee.employee_name }}</p>
          <p><strong>Posisi:</strong> {{ employee.employee_position }}</p>
          <p><strong>Kontak:</strong> {{ employee.employee_contact }}</p>
          <p><strong>Tanggal Lahir:</strong> {{ employee.employee_birth }}</p>
          <p><strong>Deskripsi:</strong> {{ employee.employee_description }}</p>
        </div>
      </div>
      <div class="flex justify-center mt-4">
        <router-link
          to="/employee_pages/employees"
          class="bg-gray-600 px-4 py-2 rounded text-white"
        >
          Kembali
        </router-link>
      </div>
    </div>
    <p v-else class="text-red-500 text-center">Data karyawan tidak ditemukan.</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";

const route = useRoute();
const employee = ref(null);

const fetchEmployeeDetail = async () => {
  try {
    const response = await axios.get(`http://localhost:8000/api/employees/${route.params.id}`);
    employee.value = response.data.data;
  } catch (error) {
    console.error("Error fetching employee details:", error);
  }
};

onMounted(fetchEmployeeDetail);
</script>
