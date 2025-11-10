<template>
  <!-- <div class="container max-w-lg p-6 mx-auto bg-white rounded shadow-md"> -->
  <div class="container p-6 mx-auto">
    <!-- <h1 class="mb-6 text-2xl font-bold text-center text-gray-700">Tambah Karyawan</h1> -->
    <h1 class="mb-4 text-2xl font-bold">Tambah Karyawan</h1>
    <form @submit.prevent="addEmployee" class="space-y-4">
      <div>
        <label class="block text-gray-600">Foto</label>
        <input type="file" @change="onFileChange" class="w-full p-2 border rounded" />
      </div>

      <div>
        <label class="block text-gray-600">Nama</label>
        <textarea
          v-model="employee_name"
          placeholder="Nama Karyawan"
          class="w-full p-2 overflow-hidden border rounded resize-none"
          rows="3"
          ref="nameInputRef"
          @input="adjustNameHeight"
          required
        ></textarea>
      </div>

      <div>
        <label class="block text-gray-600">Kode</label>
        <input
          v-model="code"
          type="text"
          placeholder="Kode Karyawan"
          class="w-full p-2 border rounded"
          required
        />
      </div>

      <div>
        <label class="block text-gray-600">Posisi</label>
        <input
          v-model="employee_position"
          type="text"
          placeholder="Jabatan / Posisi"
          class="w-full p-2 border rounded"
          required
        />
      </div>

      <div>
        <label class="block text-gray-600">Tanggal Lahir</label>
        <input
          v-model="employee_birth"
          type="date"
          class="w-full p-2 border rounded"
          required
        />
      </div>

      <div>
        <label class="block text-gray-600">Kontak</label>
        <input
          v-model="employee_contact"
          type="text"
          placeholder="Nomor Telepon"
          class="w-full p-2 border rounded"
          required
        />
      </div>

      <div>
        <label class="block text-gray-600">Deskripsi</label>
        <textarea
          v-model="employee_description"
          placeholder="Deskripsi Karyawan"
          class="w-full p-2 overflow-hidden border rounded resize-none"
          rows="3"
          ref="descInputRef"
          @input="adjustDescHeight"
          required
        ></textarea>
      </div>

      <div class="flex justify-start">
        <button
          @click="goBack"
          type="button"
          class="px-4 py-2 mr-2 text-white bg-gray-500 rounded hover:bg-gray-600"
        >
          Kembali
        </button>

        <button
          type="submit"
          class="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
        >
          Tambah Karyawan
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

definePageMeta({
  middleware: ["auth"],
});

const router = useRouter();

const code = ref("");
const employee_name = ref("");
const employee_photo = ref(null);
const employee_position = ref("");
const employee_birth = ref("");
const employee_contact = ref("");
const employee_description = ref("");

// const descriptionField = ref(null);

// Refs untuk input name dan textarea description
const nameInputRef = ref(null);
const descInputRef = ref(null);

const onFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    employee_photo.value = file;
  }
};

// const autoResize = () => {
//   const el = descriptionField.value;
//   el.style.height = 'auto';
//   el.style.height = el.scrollHeight + 'px';
// };

// Fungsi untuk mengatur tinggi input name secara dinamis
const adjustNameHeight = () => {
  nextTick(() => {
    if (nameInputRef.value) {
      nameInputRef.value.style.height = "auto";
      nameInputRef.value.style.height = `${nameInputRef.value.scrollHeight}px`;
    }
  });
};

// Fungsi untuk mengatur tinggi textarea description secara dinamis
const adjustDescHeight = () => {
  nextTick(() => {
    if (descInputRef.value) {
      descInputRef.value.style.height = "auto";
      descInputRef.value.style.height = `${descInputRef.value.scrollHeight}px`;
    }
  });
};

const addEmployee = async () => {
  const formData = new FormData();
  formData.append("employee_name", employee_name.value);
  formData.append("code", code.value);
  if (employee_photo.value) {
    formData.append("employee_photo", employee_photo.value);
  }
  formData.append("employee_position", employee_position.value);
  formData.append("employee_birth", employee_birth.value);
  formData.append("employee_contact", employee_contact.value);
  formData.append("employee_description", employee_description.value);

  try {
    const response = await axios.post(
      useApi("/api/api/employees/store"),
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    alert("Karyawan berhasil ditambahkan!");
    console.log("Response:", response.data);

    // Reset form setelah berhasil submit
    code.value = "";
    employee_name.value = "";
    employee_photo.value = null;
    employee_position.value = "";
    employee_birth.value = "";
    employee_contact.value = "";
    employee_description.value = "";

    // Kembali ke halaman sebelumnya setelah submit
    router.back();
  } catch (error) {
    console.error("Error adding employee:", error.response ? error.response.data : error);
    alert("Gagal menambahkan karyawan! Periksa kembali data yang dimasukkan.");
  }
};

const goBack = () => {
  router.back(); 
};

onMounted(() => {
  adjustNameHeight();
  adjustDescHeight();
});
</script>

<style>
body {
  background-color: #f8f9fa;
}
</style>
