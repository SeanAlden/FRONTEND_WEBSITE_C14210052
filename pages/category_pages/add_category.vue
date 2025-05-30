<script setup>
// import { ref, onMounted, nextTick } from "vue";
// import useApi from "@/composables/useApi";
// import { useRouter } from "vue-router";

// definePageMeta({
//   middleware: ["auth"],
// });

// const { createCategory } = useApi();
// const router = useRouter();

// const name = ref("");
// const code = ref("");
// const description = ref("");

// // Refs untuk input name dan textarea description
// const nameInputRef = ref(null);
// const codeInputRef = ref(null);
// const textareaRef = ref(null);

// // Fungsi untuk mengatur tinggi input name secara dinamis
// const adjustNameHeight = () => {
//   nextTick(() => {
//     if (nameInputRef.value) {
//       nameInputRef.value.style.height = "auto";
//       nameInputRef.value.style.height = `${nameInputRef.value.scrollHeight}px`;
//     }
//   });
// };

// // Fungsi untuk mengatur tinggi input code secara dinamis
// const adjustCodeHeight = () => {
//   nextTick(() => {
//     if (codeInputRef.value) {
//       codeInputRef.value.style.height = "auto";
//       codeInputRef.value.style.height = `${codeInputRef.value.scrollHeight}px`;
//     }
//   });
// };

// // Fungsi untuk mengatur tinggi textarea description secara dinamis
// const adjustTextareaHeight = () => {
//   nextTick(() => {
//     if (textareaRef.value) {
//       textareaRef.value.style.height = "auto";
//       textareaRef.value.style.height = `${textareaRef.value.scrollHeight}px`;
//     }
//   });
// };

// // Fungsi untuk menangani submit
// const handleSubmit = async () => {
//   await createCategory({ name: name.value, code: code.value,description: description.value });
//   router.push("/category_pages/categories");
// };

// // Sesuaikan tinggi saat halaman dimuat
// onMounted(() => {
//   adjustNameHeight();
//   adjustCodeHeight();
//   adjustTextareaHeight();
// });

import { ref, onMounted, nextTick } from "vue";
import { useRouter } from "vue-router";

definePageMeta({
  middleware: ["auth"],
});

const router = useRouter();

const name = ref("");
const code = ref("");
const description = ref("");

// Refs untuk input name, code, dan textarea description
const nameInputRef = ref(null);
const codeInputRef = ref(null);
const textareaRef = ref(null);

// Fungsi untuk mengatur tinggi input name secara dinamis
const adjustNameHeight = () => {
  nextTick(() => {
    if (nameInputRef.value) {
      nameInputRef.value.style.height = "auto";
      nameInputRef.value.style.height = `${nameInputRef.value.scrollHeight}px`;
    }
  });
};

// Fungsi untuk mengatur tinggi input code secara dinamis
const adjustCodeHeight = () => {
  nextTick(() => {
    if (codeInputRef.value) {
      codeInputRef.value.style.height = "auto";
      codeInputRef.value.style.height = `${codeInputRef.value.scrollHeight}px`;
    }
  });
};

// Fungsi untuk mengatur tinggi textarea description secara dinamis
const adjustTextareaHeight = () => {
  nextTick(() => {
    if (textareaRef.value) {
      textareaRef.value.style.height = "auto";
      textareaRef.value.style.height = `${textareaRef.value.scrollHeight}px`;
    }
  });
};

// Fungsi createCategory langsung di-define di sini tanpa useApi
const createCategory = async (data) => {
  try {
    const response = await fetch("http://127.0.0.1:8000/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    console.error("Error creating category:", error);
  }
};

// Fungsi untuk menangani submit
const handleSubmit = async () => {
  await createCategory({
    name: name.value,
    code: code.value,
    description: description.value,
  });
  router.push("/category_pages/categories");
};

// Sesuaikan tinggi saat halaman dimuat
onMounted(() => {
  adjustNameHeight();
  adjustCodeHeight();
  adjustTextareaHeight();
});
</script>

<template>
  <!-- <div class="mx-auto max-w-lg p-6"> -->
  <div class="mx-auto p-6">
    <h1 class="mb-4 text-2xl font-bold">Tambah Kategori</h1>
    <form @submit.prevent="handleSubmit">
      <div class="relative">
        <textarea
          ref="nameInputRef"
          v-model="name"
          @input="adjustNameHeight"
          placeholder="Nama"
          class="mb-2 w-full resize-none overflow-hidden border p-2"
          rows="1"
        ></textarea>
      </div>
			<div class="relative">
        <textarea
          ref="codeInputRef"
          v-model="code"
          @input="adjustCodeHeight"
          placeholder="Kode"
          class="mb-2 w-full resize-none overflow-hidden border p-2"
          rows="1"
        ></textarea>
      </div>
      <div class="relative">
        <textarea
          ref="textareaRef"
          v-model="description"
          @input="adjustTextareaHeight"
          placeholder="Deskripsi"
          class="mb-2 w-full resize-none overflow-hidden border p-2"
          rows="10"
        ></textarea>
      </div>
			<button @click="$router.back()" class="mb-4 mr-2 rounded bg-gray-500 px-4 py-2 text-white">Kembali</button>
      <button type="submit" class="rounded bg-blue-600 px-4 py-2 text-white">Tambah Kategori</button>
    </form>
  </div>
</template>
