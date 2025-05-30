<script setup>
// import { ref, onMounted, nextTick } from "vue";
// import useApi from "@/composables/useApi";
// import { useRoute, useRouter } from "vue-router";

// definePageMeta({
//   middleware: ["auth"],
// });

// const { getCategoryById, updateCategory } = useApi();
// const route = useRoute();
// const router = useRouter();
// const category = await getCategoryById(route.params.id);

// const name = ref("");
// const code = ref("");
// const description = ref("");
// const isLoading = ref(true);

// // Refs untuk input name dan textarea description
// const nameInputRef = ref(null);
// const codeInputRef = ref(null);
// const descTextarea = ref(null);
// const textareaRef = ref(null);

// // Fungsi untuk menyesuaikan tinggi input secara otomatis
// // const adjustHeight = (el) => {
// //   nextTick(() => {
// //     if (el) {
// //       el.style.height = "auto";
// //       el.style.height = `${el.scrollHeight}px`;
// //     }
// //   });
// // };

// const adjustNameHeight = () => {
//   nextTick(() => {
//     if (nameInputRef.value) {
//       nameInputRef.value.style.height = "auto";
//       nameInputRef.value.style.height = `${nameInputRef.value.scrollHeight}px`;
//     }
//   });
// };

// const adjustCodeHeight = () => {
//   nextTick(() => {
//     if (codeInputRef.value) {
//       codeInputRef.value.style.height = "auto";
//       codeInputRef.value.style.height = `${codeInputRef.value.scrollHeight}px`;
//     }
//   });
// };

// const adjustTextareaHeight = () => {
//   if (descTextarea.value) {
//     descTextarea.value.style.height = "auto"; // Reset height
//     descTextarea.value.style.height = descTextarea.value.scrollHeight + "px"; // Sesuaikan tinggi
//   }
// };

// onMounted(async () => {
//   try {
//     console.log("Fetching category with ID:", route.params.id);
//     const category = await getCategoryById(route.params.id);
//     console.log("Fetched category:", category);

//     if (category) {
//       name.value = category.name || "";
//       description.value = category.description || "";
//       code.value = category.code || "";

//       // Sesuaikan tinggi input setelah data dimuat
//       // nextTick(() => {
//       //   adjustHeight(nameInputRef.value);
//       //   adjustHeight(textareaRef.value);
//       // });
//     } else {
//       console.warn("Kategori tidak ditemukan.");
//     }
//   } catch (error) {
//     console.error("Error fetching category:", error);
//   } finally {
//     isLoading.value = false;
//   }
//     nextTick(() => adjustTextareaHeight());
//     nextTick(() => adjustNameHeight());
//     nextTick(() => adjustCodeHeight());
// });

// watch(
//   () => category.description, category.name,
//   () => {
//     nextTick(() => adjustTextareaHeight());
//     nextTick(() => adjustNameHeight());
//     nextTick(() => adjustCodeHeight());
//   }
// );

// const handleSubmit = async () => {
//   await updateCategory(route.params.id, {
//     name: name.value,
//     code: code.value,
//     description: description.value,
//   });
//   router.push("/category_pages/categories");
// };

import { ref, onMounted, nextTick, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

definePageMeta({
  middleware: ["auth"],
});

const route = useRoute();
const router = useRouter();

const name = ref("");
const code = ref("");
const description = ref("");
const isLoading = ref(true);

// Refs untuk input name, code, dan textarea description
const nameInputRef = ref(null);
const codeInputRef = ref(null);
const descTextarea = ref(null);

// API base URL
const apiUrl = "http://127.0.0.1:8000/api";

// Fungsi getCategoryById dipindah dari useApi.js
const getCategoryById = async (id) => {
  try {
    const response = await fetch(`${apiUrl}/categories/${id}`);
    if (!response.ok) throw new Error("Gagal mengambil data kategori");
    return await response.json();
  } catch (error) {
    console.error(`Error fetching category with ID ${id}:`, error);
    return null;
  }
};

// Fungsi updateCategory dipindah dari useApi.js
const updateCategory = async (id, data) => {
  try {
    const response = await fetch(`${apiUrl}/categories/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    console.error("Error updating category:", error);
  }
};

// Fungsi untuk menyesuaikan tinggi input secara otomatis
const adjustNameHeight = () => {
  nextTick(() => {
    if (nameInputRef.value) {
      nameInputRef.value.style.height = "auto";
      nameInputRef.value.style.height = `${nameInputRef.value.scrollHeight}px`;
    }
  });
};

const adjustCodeHeight = () => {
  nextTick(() => {
    if (codeInputRef.value) {
      codeInputRef.value.style.height = "auto";
      codeInputRef.value.style.height = `${codeInputRef.value.scrollHeight}px`;
    }
  });
};

const adjustTextareaHeight = () => {
  if (descTextarea.value) {
    descTextarea.value.style.height = "auto";
    descTextarea.value.style.height = descTextarea.value.scrollHeight + "px";
  }
};

// Ambil data kategori saat halaman dimuat
onMounted(async () => {
  try {
    console.log("Fetching category with ID:", route.params.id);
    const category = await getCategoryById(route.params.id);
    console.log("Fetched category:", category);

    if (category) {
      name.value = category.name || "";
      description.value = category.description || "";
      code.value = category.code || "";
    } else {
      console.warn("Kategori tidak ditemukan.");
    }
  } catch (error) {
    console.error("Error fetching category:", error);
  } finally {
    isLoading.value = false;
  }

  nextTick(() => adjustTextareaHeight());
  nextTick(() => adjustNameHeight());
  nextTick(() => adjustCodeHeight());
});

// Update tinggi input/textarea jika data berubah
watch([name, code, description], () => {
  nextTick(() => {
    adjustTextareaHeight();
    adjustNameHeight();
    adjustCodeHeight();
  });
});

// Fungsi submit untuk update kategori
const handleSubmit = async () => {
  await updateCategory(route.params.id, {
    name: name.value,
    code: code.value,
    description: description.value,
  });
  router.push("/category_pages/categories");
};
</script>

<template>
  <!-- <div class="mx-auto max-w-lg p-6"> -->
  <div class="mx-auto p-6">
    <h1 class="mb-4 text-2xl font-bold">Edit Kategori</h1>

    <div v-if="isLoading" class="text-center text-gray-500">Loading...</div>
    <form v-else @submit.prevent="handleSubmit">
      <label class="mb-1 block">Nama Kategori:</label>
      <textarea
        v-model="name"
        ref="nameInputRef"
        @input="adjustNameHeight"
        class="mb-2 w-full resize-none overflow-hidden border p-2"
        rows="1"
        required
      ></textarea>

      <label class="mb-1 block">Kode Kategori:</label>
      <textarea
        v-model="code"
        ref="codeInputRef"
        @input="adjustCodeHeight"
        class="mb-2 w-full resize-none overflow-hidden border p-2"
        rows="1"
        required
      ></textarea>

      <label class="mb-1 block">Deskripsi:</label>
      <textarea
        v-model="description"
        ref="descTextarea"
        @input="adjustTextareaHeight"
        class="mb-2 w-full resize-none overflow-hidden border p-2"
        rows="10"
      ></textarea>

      <button
        @click="$router.back()"
        class="mb-4 mr-2 rounded bg-gray-500 px-4 py-2 text-white"
      >
        Kembali
      </button>
      <button type="submit" class="rounded bg-blue-500 px-4 py-2 text-white">
        Simpan Perubahan
      </button>
    </form>
  </div>
</template>
