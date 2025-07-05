<template>
  <div class="container p-6 mx-auto">
    <div class="flex items-center justify-between mb-4">
      <h1 class="mb-4 text-2xl font-bold">Daftar Akun Karyawan</h1>
      <router-link
        to="/employee_pages/employees"
        class="inline-block px-4 py-2 mb-4 text-white bg-blue-500 rounded"
      >
        Kembali ke Daftar Karyawan
      </router-link>
    </div>

    <div class="flex items-center justify-between mb-4">
      <div>
        <label class="mr-2">Show</label>
        <select v-model="itemsPerPage" class="p-1 border rounded">
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
              <th class="p-2 border">Email</th>
              <th class="p-2 border">Kontak</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(user, index) in paginatedCashiers" :key="user.id">
              <td class="p-2 border">
                {{ (currentPage - 1) * itemsPerPage + index + 1 }}
              </td>
              <td class="flex items-center justify-center p-2 px-0 border">
                <img
									:src="
                      user.profile_image ? useApi(`/public/storage/profile_images/${user.profile_image}`) : fallbackImage
                    "
                    @error="onImageError"
                  class="object-cover w-20 h-20"
                />
              </td>
              <td class="p-2 border">{{ user.name }}</td>
              <td class="p-2 border">{{ user.email }}</td>
              <td class="p-2 border">{{ user.phone }}</td>
            </tr>
          </tbody>
        </table>

        <!-- Pagination -->
        <div class="flex justify-between mt-4">
          <div>
            Showing {{ (currentPage - 1) * itemsPerPage + 1 }} to
            {{ Math.min(currentPage * itemsPerPage, filteredCashiers.length) }} of
            {{ filteredCashiers.length }} entries
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

const fetchUsers = async () => {
  isLoading.value = true; 
  try {
    const response = await axios.get(useApi("/api/auth/users"));
    // Sesuaikan dengan struktur response API Anda
    cashiers.value = response.data.data.filter((user) => user.usertype === "employee");
  } catch (error) {
    console.error("Error fetching users:", error);
  } finally {
    isLoading.value = false;
  }
};

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
