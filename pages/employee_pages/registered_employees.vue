<template>
  <div class="container mx-auto p-6">
    <div class="mb-4 flex items-center justify-between">
      <h1 class="mb-4 text-2xl font-bold">Daftar Akun Karyawan</h1>
      <router-link
        to="/employee_pages/employees"
        class="mb-4 inline-block rounded bg-blue-500 px-4 py-2 text-white"
      >
        Kembali ke Daftar Karyawan
      </router-link>
    </div>

    <div class="mb-4 flex items-center justify-between">
      <div>
        <label class="mr-2">Show</label>
        <select v-model="itemsPerPage" class="rounded border p-1">
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
              <th class="border p-2">Email</th>
              <th class="border p-2">Kontak</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(user, index) in paginatedCashiers" :key="user.id">
              <td class="border p-2">
                {{ (currentPage - 1) * itemsPerPage + index + 1 }}
              </td>
              <td class="flex items-center justify-center border p-2 px-0">
                <img
									:src="
                      user.profile_image ? useApi(`/storage/profile_images/${user.profile_image}`) : fallbackImage
                    "
                    @error="onImageError"
                  class="h-20 w-20 object-cover"
                />
              </td>
              <td class="border p-2">{{ user.name }}</td>
              <td class="border p-2">{{ user.email }}</td>
              <td class="border p-2">{{ user.phone }}</td>
            </tr>
          </tbody>
        </table>

        <!-- Pagination -->
        <div class="mt-4 flex justify-between">
          <div>
            Showing {{ (currentPage - 1) * itemsPerPage + 1 }} to
            {{ Math.min(currentPage * itemsPerPage, filteredCashiers.length) }} of
            {{ filteredCashiers.length }} entries
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
import { ref, computed, watch } from "vue";
import axios from "axios";

definePageMeta({
  middleware: ["auth"],
});

const cashiers = ref([]);
const searchQuery = ref("");
const itemsPerPage = ref(5);
const itemsPerPageOptions = [5, 10, 20, 50];
const currentPage = ref(1);
const isLoading = ref(true); // State untuk loading

const fallbackImage = "/assets/images/photo_default.png";

// ✅ Fetch langsung saat setup, tidak perlu onMounted
// const { data, error } = await useFetch("http://127.0.0.1:8000/api/auth/users");
// if (error.value) {
//   console.error("Fetch error:", error.value);
// } else if (data.value && data.value.data) {
//   cashiers.value = data.value.data.filter((user) => user.usertype === "cashier");
// }

const fetchUsers = async () => {
  isLoading.value = true; // Set loading to true
  try {
    // const { data, error } = await useFetch("http://127.0.0.1:8000/api/auth/users");
    // // cashiers.value = response.data.data;
    // if (error.value) {
    //   console.error("Fetch error:", error.value);
    // } else if (data.value && data.value.data) {
    //   cashiers.value = data.value.data.filter((user) => user.usertype === "cashier");
    // }
    const response = await axios.get(useApi("/api/auth/users"));
    // Sesuaikan dengan struktur response API Anda
    cashiers.value = response.data.data.filter((user) => user.usertype === "employee");
  } catch (error) {
    console.error("Error fetching users:", error);
  } finally {
    isLoading.value = false;
  }
};

// ✅ Filter berdasarkan query pencarian
const filteredCashiers = computed(() => {
  const query = searchQuery.value.toLowerCase();
  return cashiers.value.filter((user) => {
    return (
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      user.phone.toLowerCase().includes(query)
    );
  });
});

// ✅ Pagination
const paginatedCashiers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  return filteredCashiers.value.slice(start, start + itemsPerPage.value);
});

const totalPages = computed(() => {
  return Math.ceil(filteredCashiers.value.length / itemsPerPage.value);
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

// Reset ke halaman 1 jika jumlah item per halaman berubah
watch(itemsPerPage, () => {
  currentPage.value = 1;
});

onMounted(fetchUsers);
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
