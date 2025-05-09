<script setup>
import { ref, onMounted, nextTick } from "vue";
import useApi from "@/composables/useApi";
import { useRoute, useRouter } from "vue-router";

const { getCategoryById, updateCategory } = useApi();
const route = useRoute();
const router = useRouter();
const category = await getCategoryById(route.params.id);

const name = ref("");
const code = ref("");
const description = ref("");
const isLoading = ref(true);

// Refs untuk input name dan textarea description
const nameInputRef = ref(null);
const codeInputRef = ref(null);
const descTextarea = ref(null);
const textareaRef = ref(null);

// Fungsi untuk menyesuaikan tinggi input secara otomatis
// const adjustHeight = (el) => {
//   nextTick(() => {
//     if (el) {
//       el.style.height = "auto";
//       el.style.height = `${el.scrollHeight}px`;
//     }
//   });
// };

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
    descTextarea.value.style.height = "auto"; // Reset height
    descTextarea.value.style.height = descTextarea.value.scrollHeight + "px"; // Sesuaikan tinggi
  }
};

onMounted(async () => {
  try {
    console.log("Fetching category with ID:", route.params.id);
    const category = await getCategoryById(route.params.id);
    console.log("Fetched category:", category);

    if (category) {
      name.value = category.name || "";
      description.value = category.description || "";
      code.value = category.code || "";

      // Sesuaikan tinggi input setelah data dimuat
      // nextTick(() => {
      //   adjustHeight(nameInputRef.value);
      //   adjustHeight(textareaRef.value);
      // });
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

watch(
  () => category.description, category.name,
  () => {
    nextTick(() => adjustTextareaHeight());
    nextTick(() => adjustNameHeight());
    nextTick(() => adjustCodeHeight());
  }
);

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
  <div class="mx-auto p-6 max-w-lg">
    <h1 class="mb-4 font-bold text-2xl">Edit Kategori</h1>

    <div v-if="isLoading" class="text-gray-500 text-center">Loading...</div>
    <form v-else @submit.prevent="handleSubmit">
      <label class="block mb-1">Nama Kategori:</label>
      <textarea
        v-model="name"
        ref="nameInputRef"
        @input="adjustNameHeight"
        class="mb-2 p-2 border w-full overflow-hidden resize-none"
        rows="1"
        required
      ></textarea>

			<label class="block mb-1">Kode Kategori:</label>
      <textarea
        v-model="code"
        ref="codeInputRef"
        @input="adjustCodeHeight"
        class="mb-2 p-2 border w-full overflow-hidden resize-none"
        rows="1"
        required
      ></textarea>

      <label class="block mb-1">Deskripsi:</label>
      <textarea
        v-model="description"
        ref="descTextarea"
        @input="adjustTextareaHeight"
        class="mb-2 p-2 border w-full overflow-hidden resize-none"
        rows="1"
      ></textarea>

			<button @click="$router.back()" class="bg-gray-500 mr-2 mb-4 px-4 py-2 rounded text-white">Back</button>
      <button type="submit" class="bg-blue-500 px-4 py-2 rounded text-white">
        Save Changes
      </button>
    </form>
  </div>
</template>
