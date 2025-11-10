<template>
  <div class="container p-6 mx-auto">
    <h1 class="mb-4 text-2xl font-bold">Edit Karyawan</h1>

    <form @submit.prevent="updateEmployee" class="space-y-4">
      <div>
        <label class="block text-gray-600">Foto</label>
        <!-- <img
          :src="employee_photo ? useApi(`/public/storage/${employee_photo}`) : fallbackImage"
          @error="onImageError"
          class="w-20 h-20 object-fit"
        /> -->

        <img
          :src="employee_photo ? useApi(`/storage/${employee_photo}`) : fallbackImage"
          @error="onImageError"
          class="w-20 h-20 object-fit"
        />
        <input type="file" @change="onFileChange" class="w-full p-2 border rounded" />
      </div>

      <div>
        <label class="block text-gray-600">Nama</label>
        <!-- <textarea
          v-model="employee_name"
          placeholder="Nama Karyawan"
          class="w-full p-2 overflow-hidden border rounded resize-none"
          rows="3"
          ref="nameInputRef"
          @input="nameAutoResize"
          required
        ></textarea> -->
        <textarea
          v-model="employee_name"
          placeholder="Nama Karyawan"
          class="w-full p-2 overflow-hidden border rounded resize-none"
          rows="3"
          ref="nameTextarea"
          @input="nameAutoResize"
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
        <!-- <textarea
          v-model="employee_description"
          placeholder="Deskripsi Karyawan"
          class="w-full p-2 overflow-hidden border rounded resize-none"
          rows="3"
          ref="descInputRef"
          @input="descAutoResize"
          required
        ></textarea> -->
        <textarea
          v-model="employee_description"
          placeholder="Deskripsi Karyawan"
          class="w-full p-2 overflow-hidden border rounded resize-none"
          rows="3"
          ref="descTextarea"
          @input="descAutoResize"
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
          Simpan Perubahan
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";

const route = useRoute();
const router = useRouter();
const id = route.params.id;

const code = ref("");
const employee_name = ref("");
const employee_photo = ref(null);
const employee_position = ref("");
const employee_birth = ref("");
const employee_contact = ref("");
const employee_description = ref("");
const nameTextarea = ref(null); 
const codeTextarea = ref(null); 
const descTextarea = ref(null); 

const fallbackImage = "/assets/images/photo_default.png";

definePageMeta({
  middleware: ["auth"],
});

const fetchEmployee = async () => {
  try {
    const response = await axios.get(useApi(`/api/api/employees/${id}`));
    const employee = response.data.data;
    code.value = employee.code;
    employee_name.value = employee.employee_name;
    employee_photo.value = employee.employee_photo;
    employee_position.value = employee.employee_position;
    employee_birth.value = employee.employee_birth;
    employee_contact.value = employee.employee_contact;
    employee_description.value = employee.employee_description;

    // Setelah data dimuat, atur tinggi textarea
    await nextTick();
    autoResize();
  } catch (error) {
    console.error("Error fetching employee:", error);
  }
};

const onFileChange = (event) => {
  employee_photo.value = event.target.files[0];
};

const goBack = () => {
  router.back(); 
};

const updateEmployee = async () => {
  const formData = new FormData();
  formData.append("code", code.value);
  formData.append("employee_name", employee_name.value);
  formData.append("employee_position", employee_position.value);
  formData.append("employee_birth", employee_birth.value);
  formData.append("employee_contact", employee_contact.value);
  formData.append("employee_description", employee_description.value);
  if (employee_photo.value) {
    formData.append("employee_photo", employee_photo.value);
  }
  formData.append("_method", "PUT"); 

  try {
    await axios.post(useApi(`/api/api/employees/${id}`), formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    alert("Karyawan berhasil diperbarui!");
    router.back(); 
  } catch (error) {
    console.error("Error updating employee:", error);
  }
};

// Fungsi untuk auto resize desctextarea
const descAutoResize = () => {
  if (descTextarea.value) {
    descTextarea.value.style.height = "auto"; 
    descTextarea.value.style.height = `${descTextarea.value.scrollHeight}px`; 
  }
};

// Fungsi untuk auto resize nametextarea
const nameAutoResize = () => {
  if (nameTextarea.value) {
    nameTextarea.value.style.height = "auto"; 
    nameTextarea.value.style.height = nameTextarea.value.scrollHeight + "px"; 
  }
};

const onImageError = (event) => {
  event.target.src = fallbackImage;
};

// onMounted(fetchEmployee);

// Ambil data kategori dulu, lalu produk setelahnya
onMounted(async () => {
  await fetchEmployee();
  await nextTick(() => {
    nameAutoResize();
    descAutoResize();
  });
  // await nextTick(() => codeTextarea());
  // await nextTick(() => descTextarea());
  // await nextTick(() => nameTextarea());
});
</script>
