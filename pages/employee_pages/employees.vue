<template>
  <div class="mx-auto p-6 container">
    <div class="flex justify-between items-center mb-4">
      <h1 class="mb-4 font-bold text-2xl">Daftar Karyawan</h1>
      <router-link
        to="/employee_pages/add_employee"
        class="inline-block bg-blue-500 mb-4 px-4 py-2 rounded text-white"
      >
        Tambah Karyawan
      </router-link>
    </div>

    <div class="flex justify-between items-center mb-4">
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
      <table class="bg-white border-gray-500 w-full border-collapse">
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
            <td class="flex justify-center items-center p-2 px-0 border">
              <img
                :src="
                  employee.employee_photo
                    ? `http://localhost:8000/storage/${employee.employee_photo}`
                    : '/assets/images/photo_default.png'
                "
                class="w-20 h-20 object-cover"
              />
            </td>
            <td
              class="p-2 border text-blue-500 underline cursor-pointer"
              @click="goToDetail(employee.id)"
            >
              {{ employee.employee_name }}
            </td>
            <td class="p-2 border">{{ employee.employee_position }}</td>
            <td class="p-2 border">{{ employee.employee_contact }}</td>
            <td class="p-2 border">
              <router-link
                :to="`/employee_pages/edit/${employee.id}`"
                class="bg-yellow-500 mr-2 px-2 py-1 rounded text-white"
                >Edit</router-link
              >
              <button
                @click="deleteEmployee(employee.id)"
                class="bg-red-500 px-2 py-1 rounded text-white"
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
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

const router = useRouter();
const employees = ref([]);
const searchQuery = ref("");
const itemsPerPage = ref(10);
const currentPage = ref(1);

const fetchEmployees = async () => {
  try {
    const response = await axios.get("http://localhost:8000/api/employees");
    employees.value = response.data.data;
  } catch (error) {
    console.error("Error fetching employees:", error);
  }
};

const deleteEmployee = async (id) => {
  if (confirm("Apakah Anda yakin ingin menghapus karyawan ini?")) {
    try {
      await axios.delete(`http://localhost:8000/api/employees/${id}`);
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

watch(itemsPerPage, () => {
  currentPage.value = 1;
  fetchEmployees();
});

onMounted(fetchEmployees);
</script>
