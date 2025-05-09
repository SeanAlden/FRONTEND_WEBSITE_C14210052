<template>
  <!-- <div class="mx-auto p-6 max-w-5xl"> -->
  <div class="mx-auto p-6 container">
    <div class="flex justify-between items-center mb-4">
      <h1 class="mb-4 font-bold text-2xl">Daftar Kategori</h1>
      <NuxtLink
        to="/category_pages/add_category"
        class="inline-block bg-blue-500 mb-4 px-4 py-2 rounded text-white"
      >
        Tambah Kategori
      </NuxtLink>
    </div>

    <!-- <div
      class="bg-white shadow-md p-4 border rounded-lg w-full overflow-x-auto whitespace-nowrap"
    > -->

    <div class="flex justify-between items-center mb-4">
      <div>
        <label class="mr-2">Show</label>
        <select v-model="itemsPerPage" class="p-1 border rounded">
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
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

    <div class="overflow-x-auto whitespace-nowrap">
      <table
        class="bg-white shadow-md border-gray-300 rounded-lg min-w-full text-gray-700"
      >
        <thead>
          <tr class="bg-gray-200">
            <th class="p-3">#</th>
            <th class="p-3">Nama</th>
            <!-- <th class="p-3">Deskripsi</th> -->
            <th class="p-3">Produk</th>
            <th class="p-3">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="category in paginatedCategories" :key="category.id" class="border-t">
            <td class="p-3">{{ category.code }}</td>
            <!-- <td class="p-3">
            <span @click="openModal(category)" class="text-blue-500 cursor-pointer">
              {{ category.name }}
            </span>
          </td> -->

            <td class="p-3">
              <NuxtLink
                :to="`/category_pages/detail/${category.id}`"
                class="text-blue-500 hover:underline"
              >
                {{ category.name }}
              </NuxtLink>
            </td>

            <!-- <td class="p-3">{{ category.description }}</td> -->
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
              <!-- <button @click="handleDelete(category.id)" class="ml-2 text-red-500">
              Hapus
            </button> -->
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
        </tbody>
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
            class="bg-gray-300 disabled:opacity-50 px-3 py-1 border rounded"
          >
            Prev
          </button>

          <button
            v-for="page in generatePagination"
            :key="page"
            @click="changePage(page)"
            class="px-3 py-1 border rounded transition-all duration-200"
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
            class="bg-gray-300 disabled:opacity-50 px-3 py-1 border rounded"
          >
            Next
          </button>
        </div>
      </div>
    </div>
    <!-- </div> -->
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import useApi from "@/composables/useApi";

const { getCategories, deleteCategory } = useApi();
const categories = ref([]);
const searchQuery = ref("");
const isModalOpen = ref(false);
const selectedCategory = ref(null);
const itemsPerPage = ref(10);
const currentPage = ref(1);

const fetchCategories = async () => {
  categories.value = await getCategories();
};

// const handleDelete = async (id) => {
//   const category = categories.value.find((cat) => cat.id === id);
//   if (category.products && category.products.length > 0) {
//     alert("Kategori ini tidak dapat dihapus karena masih memiliki produk terkait.");
//     return;
//   }
//   if (confirm("Apakah Anda yakin ingin menghapus kategori ini?")) {
//     const success = await deleteCategory(id);
//     if (success) fetchCategories();
//   }
// };

const handleDelete = async (id) => {
  const category = categories.value.find((cat) => cat.id === id);
  if (!category) return;

  if (category.products && category.products.length > 0) {
    return; // Tidak melakukan apa-apa jika kategori masih memiliki produk
  }

  if (confirm("Apakah Anda yakin ingin menghapus kategori ini?")) {
    const success = await deleteCategory(id);
    if (success) fetchCategories();
  }
};

const openModal = (category) => {
  selectedCategory.value = category;
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};

// const filteredCategories = computed(() => {
//   return categories.value.filter((category) =>
//     category.name.toLowerCase().includes(searchQuery.value.toLowerCase())
//   );
// });

const filteredCategories = computed(() => {
  return categories.value.filter((category) => {
    const query = searchQuery.value.toLowerCase();
    return (
      category.name.toLowerCase().includes(query) ||
      (category.products &&
        category.products.some((product) => product.name.toLowerCase().includes(query)))
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

  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

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
