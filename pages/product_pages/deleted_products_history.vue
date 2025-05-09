<script setup>
import { ref, computed, onMounted, watch } from "vue";

const products = ref([]);
const searchQuery = ref("");
const itemsPerPage = ref(10);
const currentPage = ref(1);

const fetchProducts = async () => {
  const res = await fetch(`http://127.0.0.1:8000/api/nonactive-history`);
  const data = await res.json();
  products.value = data.data;
};

const formatPrice = (price) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" });
};

const getTotalStock = (item) => {
  if (!item.details || !Array.isArray(item.details)) return 0;
  return item.details.reduce((sum, detail) => sum + detail.product_stock, 0);
};

const filteredProducts = computed(() => {
  return products.value.filter((item) => {
    const query = searchQuery.value.toLowerCase();
    const product = item.product;

    return (
      item.condition === "nonactive" &&
      (product.code?.toLowerCase().includes(query) ||
        product.name?.toLowerCase().includes(query) ||
        product.category?.name?.toLowerCase().includes(query) ||
        product.price?.toString().includes(query))
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
  fetchProducts();
});

onMounted(fetchProducts);
</script>

<template>
  <div class="mx-auto p-6 container">
    <h1 class="mb-4 font-bold text-2xl">Riwayat Produk Dinonaktifkan</h1>

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
        class="bg-white shadow-md border border-gray-300 rounded-lg min-w-full text-gray-700"
      >
        <thead>
          <tr class="bg-gray-200">
            <!-- <th class="p-2 border">#</th> -->
            <th class="p-2 border">Kode</th>
            <th class="p-2 border">Foto</th>
            <th class="p-2 border">Nama</th>
            <th class="p-2 border">Kategori</th>
            <th class="p-2 border">Harga</th>
            <th class="p-2 border">Tanggal Kadaluarsa & Stok</th>
						<th class="p-2 border">Total Stok</th>
            <th class="p-2 border">Waktu Nonaktif</th>
          </tr>
        </thead>
        <tbody>
          <!-- <tr
            v-for="(item, index) in paginatedProducts"
            :key="item.id"
            :class="{ 'bg-red-100': item.condition === 'nonactive' }"
          > -->
          <tr
            v-for="item in paginatedProducts"
            :key="item.id"
            :class="{ 'bg-red-100': item.condition === 'nonactive' }"
          >
            <!-- <td class="p-2 border">{{ index + 1 }}</td> -->
            <td class="p-2 border">{{ item.product.code }}</td>
            <td class="flex justify-center items-center p-2 border">
              <img
                :src="
                  item.product.photo
                    ? `http://localhost:8000/storage/${item.product.photo}`
                    : '/assets/images/avatar.png'
                "
                class="w-20 h-20 object-cover"
              />
            </td>
            <td class="p-2 border">
              <NuxtLink
                :to="`/product_pages/detail/${item.product.id}`"
                class="text-blue-500 hover:underline"
              >
                {{ item.product.name }}
              </NuxtLink>
            </td>
            <td class="p-2 border">{{ item.product.category.name || "Tidak ada" }}</td>
            <td class="p-2 border">{{ formatPrice(item.product.price) }}</td>
            <!-- <td class="p-2 border">
						<strong>{{ item.details.product_exp_date }}</strong> - Stok: {{ item.details.product_stock }}
						</td> -->
            <td class="p-2 border">
              <div v-for="(detail, i) in item.details" :key="i" :class="{
                    'p-2 rounded-md': true,
                  }">
                <strong>{{ detail.product_exp_date }}</strong> - Stok:
                {{ detail.product_stock }}
              </div>
            </td>
						<td class="p-2 border">{{ getTotalStock(item) }}</td>
            <td class="p-2 border">{{ formatDate(item.changed_at) }}</td>
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
            :class="[
              'px-3 py-1 border rounded',
              currentPage === page ? 'bg-blue-500 text-white' : 'bg-gray-200',
            ]"
            :disabled="page === '...'"
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
