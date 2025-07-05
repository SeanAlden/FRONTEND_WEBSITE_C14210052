<template>
  <div class="container p-6 mx-auto">
    <div class="flex items-center justify-between mb-4">
      <h1 class="mb-4 text-2xl font-bold">Daftar Kategori</h1>
      <NuxtLink
        to="/category_pages/add_category"
        class="inline-block px-4 py-2 mb-4 text-white bg-blue-500 rounded"
      >
        Tambah Kategori
      </NuxtLink>
    </div>

    <div class="flex items-center justify-between mb-4">
      <div>
        <label class="mr-2">Show</label>
        <select v-model="itemsPerPage" id="itemsPerPage">
          <option v-for="option in itemsPerPageOptions" :key="option" :value="option">
            {{ option }}
          </option>
        </select>
        <span class="ml-2">entries</span>
      </div>

      <input
        type="text"
        v-model="searchQuery"
        placeholder="Search"
        class="p-2 border rounded"
      />
    </div>

    <!-- Loading Spinner -->
    <div v-if="isLoading" class="flex items-center justify-center py-10">
      <div
        class="w-12 h-12 ease-linear border-4 border-t-4 border-gray-200 rounded-full loader"
      ></div>
    </div>

    <!-- Table with fade animation -->
    <transition name="fade">
      <div
        v-if="!isLoading"
        class="overflow-x-auto transition-opacity duration-300 whitespace-nowrap"
        :class="{ 'opacity-50 pointer-events-none': isLoading }"
      >
        <table
          class="min-w-full text-gray-700 bg-white border-gray-300 rounded-lg shadow-md"
        >
          <thead>
            <tr class="bg-gray-200">
              <th class="p-3">#</th>
              <th class="p-3">Nama</th>
              <th class="p-3">Produk</th>
              <th class="p-3">Aksi</th>
            </tr>
          </thead>
          <!-- <transition-group name="fade" tag="tbody"> -->
          <tr v-for="category in paginatedCategories" :key="category.id" class="border-t">
            <td class="p-3">{{ category.code }}</td>

            <td class="p-3">
              <NuxtLink
                :to="`/category_pages/detail/${category.id}`"
                class="text-blue-500 hover:underline"
              >
                {{ category.name }}
              </NuxtLink>
            </td>

            <td class="p-3">
              <ul v-if="category.products && category.products.length > 0">
                <li v-for="product in category.products" :key="product.id">
                  {{ product.name }} - {{ product.code }}
                </li>
              </ul>
              <span v-else class="text-gray-500">Tidak ada produk</span>
            </td>

            <td class="p-3">
              <NuxtLink :to="`/category_pages/edit/${category.id}`" class="text-blue-500"
                >Edit</NuxtLink
              >
              <button
                @click="handleDelete(category.id)"
                :class="
                  category.products && category.products.length > 0
                    ? 'text-gray-500 cursor-not-allowed'
                    : 'text-red-500'
                "
                :disabled="category.products && category.products.length > 0"
                class="ml-2"
              >
                Hapus
              </button>
            </td>
          </tr>
          <!-- </transition-group> -->
        </table>

        <!-- Pagination -->
        <div class="flex justify-between mt-4">
          <div>
            Showing {{ (currentPage - 1) * itemsPerPage + 1 }} to
            {{ Math.min(currentPage * itemsPerPage, filteredCategories.length) }} of
            {{ filteredCategories.length }} entries
          </div>
          <div class="flex items-center space-x-2">
            <button
              @click="changePage(currentPage - 1)"
              :disabled="currentPage === 1"
              class="px-3 py-1 bg-gray-300 border rounded disabled:opacity-50"
            >
              Prev
            </button>

            <button
              v-for="page in generatePagination"
              :key="page"
              @click="changePage(page)"
              class="px-3 py-1 transition-all duration-200 border rounded"
              :class="{
                'bg-blue-500 text-white': currentPage === page,
                'bg-white text-blue-500 hover:bg-blue-100':
                  currentPage !== page && page !== '...',
              }"
            >
              {{ page }}
            </button>

            <button
              @click="changePage(currentPage + 1)"
              :disabled="currentPage === totalPages"
              class="px-3 py-1 bg-gray-300 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>

import { ref, onMounted, computed, watch } from "vue";
import axios from "axios";

const categories = ref([]);
const searchQuery = ref("");
const isModalOpen = ref(false);
const selectedCategory = ref(null);
const itemsPerPageOptions = [5, 10, 20, 50];
const itemsPerPage = ref(5);
const currentPage = ref(1);
const isLoading = ref(true);

definePageMeta({
  middleware: ["auth"],
});

const deleteCategory = async (id) => {
  try {
    const response = await fetch(useApi(`/api/categories/${id}`), {
      method: "DELETE",
    });
    return response.ok;
  } catch (error) {
    console.error("Error deleting category:", error);
  }
};

const fetchCategories = async () => {
  // isLoading.value = true;
  // const data = await getCategories();
  // categories.value = data || [];
  // isLoading.value = false;

  isLoading.value = true;
  try {
    const response = await axios.get(useApi("/api/categories"));
    // categories.value = response.data;
    categories.value = response.data?.length ? response.data : [];
  } catch (error) {
    console.error("Error fetching categories:", error);
    // return null;
  } finally {
    isLoading.value = false;
  }
};

const handleDelete = async (id) => {
  const category = categories.value.find((cat) => cat.id === id);
  if (!category) return;

  if (category.products && category.products.length > 0) return;

  if (confirm("Apakah Anda yakin ingin menghapus kategori ini?")) {
    const success = await deleteCategory(id);
    if (success) fetchCategories();
  }
};

const filteredCategories = computed(() => {
  return categories.value.filter((category) => {
    const query = searchQuery.value.toLowerCase();
    return (
      category.name.toLowerCase().includes(query) ||
      (category.products &&
        category.products.some((product) => product.name.toLowerCase().includes(query)) ||
        category.code.toLowerCase().includes(query))
    );
  });
});

const paginatedCategories = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  return filteredCategories.value.slice(start, start + itemsPerPage.value);
});

const totalPages = computed(() => {
  return Math.ceil(filteredCategories.value.length / itemsPerPage.value);
});

const generatePagination = computed(() => {
  const total = totalPages.value;
  const current = currentPage.value;
  const pages = [];

  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  if (current <= 4) {
    pages.push(1, 2, 3, 4, 5, "...", total);
  } else if (current >= total - 3) {
    pages.push(1, "...", total - 4, total - 3, total - 2, total - 1, total);
  } else {
    pages.push(1, "...", current - 1, current, current + 1, "...", total);
  }

  return pages;
});

const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value && page !== "...") {
    currentPage.value = page;
  }
};

watch(itemsPerPage, () => {
  currentPage.value = 1;
  fetchCategories();
});

onMounted(fetchCategories);
</script>

<style scoped>
.loader {
  border-top-color: #3498db;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Fade Animation */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
