<template>
  <div class="mx-auto p-6 container">
    <h1 class="mb-4 font-bold text-2xl">Edit Karyawan</h1>
    
    <button @click="$router.back()" class="bg-gray-500 mb-4 px-4 py-2 rounded text-white">Kembali</button>

    <form @submit.prevent="updateEmployee" class="space-y-4">
      <!-- <input v-model="employee_name" placeholder="Nama" class="p-2 border w-full" required /> -->
			<textarea 
        v-model="employee_name"
        placeholder="Nama"
        class="p-2 border w-full"
        rows="3"
        style="resize: none; overflow-y: hidden;"
        ref="nameTextarea"
        @input="nameAutoResize"
        required
      ></textarea>
			<input v-model="code" placeholder="Kode Karyawan" type="text" class="p-2 border w-full" required />
      <input type="file" @change="onFileChange" class="p-2 border w-full" />
      <input v-model="employee_position" placeholder="Posisi" class="p-2 border w-full" required />
      <input v-model="employee_birth" type="date" class="p-2 border w-full" required />
      <input v-model="employee_contact" placeholder="Kontak" type="text" class="p-2 border w-full" required />
      
      <!-- Textarea Deskripsi dengan auto-resize -->
      <textarea 
        v-model="employee_description"
        placeholder="Deskripsi"
        class="p-2 border w-full"
        rows="3"
        style="resize: none; overflow-y: hidden;"
        ref="descTextarea"
        @input="descAutoResize"
        required
      ></textarea>
      
      <button type="submit" class="bg-green-500 px-4 py-2 rounded text-white">Simpan Perubahan</button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';

const route = useRoute();
const router = useRouter();
const id = route.params.id;

const code = ref('');
const employee_name = ref('');
const employee_photo = ref(null);
const employee_position = ref('');
const employee_birth = ref('');
const employee_contact = ref('');
const employee_description = ref('');
const nameTextarea = ref(null); // Referensi untuk nametextarea
const codeTextarea = ref(null); // Referensi untuk codetextarea
const descTextarea = ref(null); // Referensi untuk desctextarea

const fetchEmployee = async () => {
  try {
    const response = await axios.get(`http://localhost:8000/api/employees/${id}`);
    const employee = response.data.data;
    code.value = employee.code;
    employee_name.value = employee.employee_name;
    employee_position.value = employee.employee_position;
    employee_birth.value = employee.employee_birth;
    employee_contact.value = employee.employee_contact;
    employee_description.value = employee.employee_description;
    
    // Setelah data dimuat, atur tinggi textarea
    await nextTick();
    autoResize();
  } catch (error) {
    console.error('Error fetching employee:', error);
  }
};

const onFileChange = (event) => {
  employee_photo.value = event.target.files[0];
};

const updateEmployee = async () => {
  const formData = new FormData();
  formData.append('code', code.value);
  formData.append('employee_name', employee_name.value);
  formData.append('employee_position', employee_position.value);
  formData.append('employee_birth', employee_birth.value);
  formData.append('employee_contact', employee_contact.value);
  formData.append('employee_description', employee_description.value);
  if (employee_photo.value) {
    formData.append('employee_photo', employee_photo.value);
  }
  formData.append('_method', 'PUT'); // Laravel membutuhkan ini

  try {
    await axios.post(`http://localhost:8000/api/employees/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    alert('Karyawan berhasil diperbarui!');
    router.back(); // Kembali ke halaman sebelumnya setelah update
  } catch (error) {
    console.error('Error updating employee:', error);
  }
};

// Fungsi untuk auto resize desctextarea
const descAutoResize = () => {
  if (descTextarea.value) {
    descTextarea.value.style.height = "auto"; // Reset tinggi sebelum menyesuaikan
    descTextarea.value.style.height = descTextarea.value.scrollHeight + "px"; // Sesuaikan dengan konten
  }
};

// Fungsi untuk auto resize nametextarea
const nameAutoResize = () => {
  if (nameTextarea.value) {
    nameTextarea.value.style.height = "auto"; // Reset tinggi sebelum menyesuaikan
    nameTextarea.value.style.height = nameTextarea.value.scrollHeight + "px"; // Sesuaikan dengan konten
  }
};

// Fungsi untuk auto resize codetextarea
const codeAutoResize = () => {
  if (codeTextarea.value) {
    codeTextarea.value.style.height = "auto"; // Reset tinggi sebelum menyesuaikan
    codeTextarea.value.style.height = codeTextarea.value.scrollHeight + "px"; // Sesuaikan dengan konten
  }
};

// onMounted(fetchEmployee);

// Ambil data kategori dulu, lalu produk setelahnya
onMounted(async () => {
  await fetchEmployee();
  nextTick(() => nameAutoResize());
  nextTick(() => descAutoResize());
  nextTick(() => codeTextarea());
});
</script>
