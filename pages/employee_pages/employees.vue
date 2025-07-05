<template>
  <div class="container p-6 mx-auto">
    <h1 class="mb-4 text-2xl font-bold">Daftar Karyawan Diterima</h1>
    <div class="flex items-center justify-start mb-4">
      <router-link
        to="/employee_pages/add_employee"
        class="inline-block px-4 py-2 mb-4 mr-4 text-white bg-blue-500 rounded"
      >
        Tambah Karyawan
      </router-link>
      <router-link
        to="/employee_pages/registered_employees"
        class="inline-block px-4 py-2 mb-4 text-white bg-blue-500 rounded"
      >
        Daftar Akun Karyawan
      </router-link>
    </div>

    <div class="flex items-center justify-between mb-4">
      <!-- <div>
          <label class="mr-2">Tampilkan</label>
          <select v-model="itemsPerPage" class="p-1 border rounded">
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </select>
          <span class="ml-2">item per halaman</span>
        </div> -->

      <div>
        <label class="mr-2">Show</label>
        <!-- <select v-model="itemsPerPage" class="p-1 border rounded">
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
        class="p-2 border rounded"
      />
    </div>

    <div class="flex items-center justify-center py-10" v-if="isLoading">
      <!-- <p>Loading...</p> -->
      <!-- Ganti dengan spinner jika perlu -->
      <div
        class="w-16 h-16 ease-linear border-8 border-t-8 border-gray-200 rounded-full loader"
      ></div>
    </div>

    <transition name="fade">
      <div v-if="!isLoading" class="overflow-x-auto whitespace-nowrap">
        <table class="w-full bg-white border-collapse border-gray-500">
          <thead>
            <tr class="bg-gray-200">
              <th class="p-2 border">#</th>
              <th class="p-0 px-0 border">Foto</th>
              <th class="p-2 border">Nama</th>
              <th class="p-2 border">Posisi</th>
              <th class="p-2 border">Kontak</th>
              <th class="p-2 border">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="employee in paginatedProducts" :key="employee.id">
              <td class="p-2 border">{{ employee.code }}</td>
              <!-- <td class="flex items-center justify-center p-2 px-0 border"> -->
              <td
                class="flex min-h-[100px] min-w-[100px] items-center justify-center border p-2"
              >
                <img
                  :src="
                      employee.employee_photo ? useApi(`/public/storage/${employee.employee_photo}`) : fallbackImage
                    "
                    @error="onImageError"
                  class="w-20 h-20 object-fit"
                />
              </td>
              <td
                class="p-2 text-blue-500 underline border cursor-pointer"
                @click="goToDetail(employee.id)"
              >
                {{ employee.employee_name }}
              </td>
              <td class="p-2 border">{{ employee.employee_position }}</td>
              <td class="p-2 border">{{ employee.employee_contact }}</td>
              <td class="p-2 border">
                <router-link
                  :to="`/employee_pages/edit/${employee.id}`"
                  class="px-2 py-1 mr-2 text-white bg-yellow-500 rounded"
                  >Edit</router-link
                >
                <button
                  @click="deleteEmployee(employee.id)"
                  class="px-2 py-1 text-white bg-red-500 rounded"
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
            {{ Math.min(currentPage * itemsPerPage, filteredProducts.length) }} of
            {{ filteredProducts.length }} entries
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
const isLoading = ref(true); 

const fallbackImage = "/assets/images/photo_default.png";

const fetchEmployees = async () => {
  isLoading.value = true; 
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
      employee.code.toLowerCase().includes(query) || 
      employee.employee_name.toLowerCase().includes(query) || 
      employee.employee_position.toLowerCase().includes(query) || 
      employee.employee_contact.toLowerCase().includes(query) 
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
