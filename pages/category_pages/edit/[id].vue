<script setup>

import { ref, onMounted, nextTick, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios"; 

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

const getCategoryById = async (id) => {
  try {
    const response = await axios.get(useApi(`/api/categories/${id}`));
    return response.data;
  } catch (error) {
    console.error(`Error fetching category with ID ${id}:`, error);
    return null;
  }
};

const updateCategory = async (id, data) => {
  try {
    const response = await axios.put(useApi(`/api/categories/${id}`), data);
    return response.data;
  } catch (error) {
    console.error("Error updating category:", error);
  }
};

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
  <!-- <div class="max-w-lg p-6 mx-auto"> -->
  <div class="p-6 mx-auto">
    <h1 class="mb-4 text-2xl font-bold">Edit Kategori</h1>

    <div v-if="isLoading" class="text-center text-gray-500">Loading...</div>
    <form v-else @submit.prevent="handleSubmit">
      <label class="block mb-1">Nama Kategori:</label>
      <textarea
        v-model="name"
        ref="nameInputRef"
        @input="adjustNameHeight"
        class="w-full p-2 mb-2 overflow-hidden border resize-none"
        rows="1"
        required
      ></textarea>

      <label class="block mb-1">Kode Kategori:</label>
      <textarea
        v-model="code"
        ref="codeInputRef"
        @input="adjustCodeHeight"
        class="w-full p-2 mb-2 overflow-hidden border resize-none"
        rows="1"
        required
      ></textarea>

      <label class="block mb-1">Deskripsi:</label>
      <textarea
        v-model="description"
        ref="descTextarea"
        @input="adjustTextareaHeight"
        class="w-full p-2 mb-2 overflow-hidden border resize-none"
        rows="10"
      ></textarea>

      <button
        @click="$router.back()"
        class="px-4 py-2 mb-4 mr-2 text-white bg-gray-500 rounded"
      >
        Kembali
      </button>
      <button type="submit" class="px-4 py-2 text-white bg-blue-500 rounded">
        Simpan Perubahan
      </button>
    </form>
  </div>
</template>
