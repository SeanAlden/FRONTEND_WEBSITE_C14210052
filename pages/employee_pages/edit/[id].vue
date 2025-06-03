<template>
  <div class="container mx-auto p-6">
    <h1 class="mb-4 text-2xl font-bold">Edit Karyawan</h1>

    <form @submit.prevent="updateEmployee" class="space-y-4">
      <div>
        <label class="block text-gray-600">Foto</label>
        <img
          :src="
            employee.employee_photo
              ? useApi(`/storage/${employee.employee_photo}`)
              : fallbackImage
          "
          @error="onImageError"
          class="object-fit h-20 w-20"
        />
        <input type="file" @change="onFileChange" class="w-full rounded border p-2" />
      </div>

      <div>
        <label class="block text-gray-600">Nama</label>
        <!-- <textarea
          v-model="employee_name"
          placeholder="Nama Karyawan"
          class="w-full resize-none overflow-hidden rounded border p-2"
          rows="3"
          ref="nameInputRef"
          @input="nameAutoResize"
          required
        ></textarea> -->
        <textarea
          v-model="employee_name"
          placeholder="Nama Karyawan"
          class="w-full resize-none overflow-hidden rounded border p-2"
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
          class="w-full rounded border p-2"
          required
        />
      </div>

      <div>
        <label class="block text-gray-600">Posisi</label>
        <input
          v-model="employee_position"
          type="text"
          placeholder="Jabatan / Posisi"
          class="w-full rounded border p-2"
          required
        />
      </div>

      <div>
        <label class="block text-gray-600">Tanggal Lahir</label>
        <input
          v-model="employee_birth"
          type="date"
          class="w-full rounded border p-2"
          required
        />
      </div>

      <div>
        <label class="block text-gray-600">Kontak</label>
        <input
          v-model="employee_contact"
          type="text"
          placeholder="Nomor Telepon"
          class="w-full rounded border p-2"
          required
        />
      </div>

      <div>
        <label class="block text-gray-600">Deskripsi</label>
        <!-- <textarea
          v-model="employee_description"
          placeholder="Deskripsi Karyawan"
          class="w-full resize-none overflow-hidden rounded border p-2"
          rows="3"
          ref="descInputRef"
          @input="descAutoResize"
          required
        ></textarea> -->
        <textarea
          v-model="employee_description"
          placeholder="Deskripsi Karyawan"
          class="w-full resize-none overflow-hidden rounded border p-2"
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
          class="mr-2 rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
        >
          Kembali
        </button>

        <button
          type="submit"
          class="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
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
const nameTextarea = ref(null); // Referensi untuk nametextarea
const codeTextarea = ref(null); // Referensi untuk codetextarea
const descTextarea = ref(null); // Referensi untuk desctextarea

const fallbackImage = "/assets/images/photo_default.png";

definePageMeta({
  middleware: ["auth"],
});

const fetchEmployee = async () => {
  try {
    const response = await axios.get(useApi(`/api/employees/${id}`));
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
  router.back(); // Fungsi untuk kembali ke halaman sebelumnya
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
  formData.append("_method", "PUT"); // Laravel membutuhkan ini

  try {
    await axios.post(useApi(`/api/employees/${id}`), formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    alert("Karyawan berhasil diperbarui!");
    router.back(); // Kembali ke halaman sebelumnya setelah update
  } catch (error) {
    console.error("Error updating employee:", error);
  }
};

// Fungsi untuk auto resize desctextarea
const descAutoResize = () => {
  if (descTextarea.value) {
    descTextarea.value.style.height = "auto"; // Reset tinggi sebelum menyesuaikan
    descTextarea.value.style.height = `${descTextarea.value.scrollHeight}px`; // Sesuaikan dengan konten
  }
};

// Fungsi untuk auto resize nametextarea
const nameAutoResize = () => {
  if (nameTextarea.value) {
    nameTextarea.value.style.height = "auto"; // Reset tinggi sebelum menyesuaikan
    nameTextarea.value.style.height = nameTextarea.value.scrollHeight + "px"; // Sesuaikan dengan konten
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
