<template>
  <div class="container mx-auto p-6">
    <h1 class="mb-4 text-2xl font-bold">Daftar Karyawan Diterima</h1>
    <div class="mb-4 flex items-center justify-start">
      <router-link
        to="/employee_pages/add_employee"
        class="mb-4 mr-4 inline-block rounded bg-blue-500 px-4 py-2 text-white"
      >
        Tambah Karyawan
      </router-link>
      <router-link
        to="/employee_pages/registered_employees"
        class="mb-4 inline-block rounded bg-blue-500 px-4 py-2 text-white"
      >
        Daftar Akun Karyawan
      </router-link>
    </div>

    <div class="mb-4 flex items-center justify-between">
      <!-- <div>
          <label class="mr-2">Tampilkan</label>
          <select v-model="itemsPerPage" class="rounded border p-1">
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </select>
          <span class="ml-2">item per halaman</span>
        </div> -->

      <div>
        <label class="mr-2">Show</label>
        <!-- <select v-model="itemsPerPage" class="rounded border p-1">
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
        </select> -->
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
        class="rounded border p-2"
      />
    </div>

    <div class="flex items-center justify-center py-10" v-if="isLoading">
      <!-- <p>Loading...</p> -->
      <!-- Ganti dengan spinner jika perlu -->
      <div
        class="loader h-16 w-16 rounded-full border-8 border-t-8 border-gray-200 ease-linear"
      ></div>
    </div>

    <transition name="fade">
      <div v-if="!isLoading" class="overflow-x-auto whitespace-nowrap">
        <table class="w-full border-collapse border-gray-500 bg-white">
          <thead>
            <tr class="bg-gray-200">
              <th class="border p-2">#</th>
              <th class="border p-0 px-0">Foto</th>
              <th class="border p-2">Nama</th>
              <th class="border p-2">Posisi</th>
              <th class="border p-2">Kontak</th>
              <th class="border p-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="employee in paginatedProducts" :key="employee.id">
              <td class="border p-2">{{ employee.code }}</td>
              <!-- <td class="flex items-center justify-center border p-2 px-0"> -->
              <td
                class="flex min-h-[100px] min-w-[100px] items-center justify-center border p-2"
              >
                <img
                  :src="
                      employee.employee_photo ? useApi(`/storage/${employee.employee_photo}`) : fallbackImage
                    "
                    @error="onImageError"
                  class="object-fit h-20 w-20"
                />
              </td>
              <td
                class="cursor-pointer border p-2 text-blue-500 underline"
                @click="goToDetail(employee.id)"
              >
                {{ employee.employee_name }}
              </td>
              <td class="border p-2">{{ employee.employee_position }}</td>
              <td class="border p-2">{{ employee.employee_contact }}</td>
              <td class="border p-2">
                <router-link
                  :to="`/employee_pages/edit/${employee.id}`"
                  class="mr-2 rounded bg-yellow-500 px-2 py-1 text-white"
                  >Edit</router-link
                >
                <button
                  @click="deleteEmployee(employee.id)"
                  class="rounded bg-red-500 px-2 py-1 text-white"
                >
                  Hapus
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <!-- Pagination -->
        <div class="mt-4 flex justify-between">
          <div>
            Showing {{ (currentPage - 1) * itemsPerPage + 1 }} to
            {{ Math.min(currentPage * itemsPerPage, filteredProducts.length) }} of
            {{ filteredProducts.length }} entries
          </div>
          <div class="flex items-center space-x-2">
            <button
              @click="changePage(currentPage - 1)"
              :disabled="currentPage === 1"
              class="rounded border bg-gray-300 px-3 py-1 disabled:opacity-50"
            >
              Prev
            </button>

            <button
              v-for="page in generatePagination"
              :key="page"
              @click="changePage(page)"
              class="rounded border px-3 py-1 transition-all duration-200"
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
              class="rounded border bg-gray-300 px-3 py-1 disabled:opacity-50"
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
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

definePageMeta({
  middleware: ["auth"],
});

const router = useRouter();
const employees = ref([]);
const searchQuery = ref("");
const itemsPerPageOptions = [5, 10, 20, 50];
const itemsPerPage = ref(5);
const currentPage = ref(1);
const isLoading = ref(true); // State untuk loading

const fallbackImage = "/assets/images/photo_default.png";

const fetchEmployees = async () => {
  isLoading.value = true; // Set loading to true
  try {
    const response = await axios.get(useApi("/api/employees"));
    employees.value = response.data.data;
  } catch (error) {
    console.error("Error fetching employees:", error);
  } finally {
    isLoading.value = false;
  }
};

const deleteEmployee = async (id) => {
  if (confirm("Apakah Anda yakin ingin menghapus karyawan ini?")) {
    try {
      await axios.delete(useApi(`/api/employees/${id}`));
      fetchEmployees();
    } catch (error) {
      console.error("Error deleting employee:", error);
    }
  }
};

const goToDetail = (id) => {
  router.push(`/employee_pages/detail/${id}`);
};

const filteredProducts = computed(() => {
  return employees.value.filter((employee) => {
    const query = searchQuery.value.toLowerCase();
    return (
      employee.code.toLowerCase().includes(query) || // Pencarian berdasarkan kode
      employee.employee_name.toLowerCase().includes(query) || // Pencarian berdasarkan kode
      employee.employee_position.toLowerCase().includes(query) || // Pencarian berdasarkan kode
      employee.employee_contact.toLowerCase().includes(query) // Pencarian berdasarkan kode
    );
  });
});

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  return filteredProducts.value.slice(start, start + itemsPerPage.value);
});

const totalPages = computed(() => {
  return Math.ceil(filteredProducts.value.length / itemsPerPage.value);
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

const onImageError = (event) => {
  event.target.src = fallbackImage;
};

watch(itemsPerPage, () => {
  currentPage.value = 1;
  fetchEmployees();
});

onMounted(fetchEmployees);
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
