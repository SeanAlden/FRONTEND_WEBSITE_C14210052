<script setup>
import { ref, onMounted, nextTick } from "vue";
import useApi from "@/composables/useApi";
import { useRouter } from "vue-router";

const { createCategory } = useApi();
const router = useRouter();

const name = ref("");
const code = ref("");
const description = ref("");

// Refs untuk input name dan textarea description
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

// Fungsi untuk menangani submit
const handleSubmit = async () => {
  await createCategory({ name: name.value, code: code.value,description: description.value });
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
  <div class="mx-auto p-6 max-w-lg">
    <h1 class="mb-4 font-bold text-2xl">Tambah Kategori</h1>
    <form @submit.prevent="handleSubmit">
      <div class="relative">
        <textarea
          ref="nameInputRef"
          v-model="name"
          @input="adjustNameHeight"
          placeholder="Nama"
          class="mb-2 p-2 border w-full overflow-hidden resize-none"
          rows="1"
        ></textarea>
      </div>
			<div class="relative">
        <textarea
          ref="codeInputRef"
          v-model="code"
          @input="adjustCodeHeight"
          placeholder="Kode"
          class="mb-2 p-2 border w-full overflow-hidden resize-none"
          rows="1"
        ></textarea>
      </div>
      <div class="relative">
        <textarea
          ref="textareaRef"
          v-model="description"
          @input="adjustTextareaHeight"
          placeholder="Deskripsi"
          class="mb-2 p-2 border w-full overflow-hidden resize-none"
          rows="1"
        ></textarea>
      </div>
			<button @click="$router.back()" class="bg-gray-500 mr-2 mb-4 px-4 py-2 rounded text-white">Back</button>
      <button type="submit" class="bg-green-500 px-4 py-2 rounded text-white">Add</button>
    </form>
  </div>
</template>
