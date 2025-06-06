<template>
  <div class="min-h-screen bg-gray-100 p-6">
    <h1 class="text-2xl font-bold">Dashboard</h1>
    <!-- <p class="text-gray-600">Hello, john doe</p> -->
    <p class="text-gray-600">Hello, {{ user?.name || "Guest" }}</p>

    <!-- Dropdown untuk pilih bulan -->
    <!-- <div class="mb-4 mt-4 flex flex-wrap items-center">
      <label for="month" class="mr-2 text-sm font-medium text-gray-700"
        >Pilih Bulan:</label
      >
      <select
        v-model="currentMonth"
        @change="fetchData"
        class="rounded-md border border-gray-300 px-2 py-1"
      >
        <option v-for="month in months" :key="month" :value="month">{{ month }}</option>
      </select>

      <label for="year" class="mr-2 text-sm font-medium text-gray-700"
        >Pilih Tahun:</label
      >
      <select
        v-model="currentYear"
        @change="fetchData"
        class="rounded-md border border-gray-300 px-2 py-1"
      >
        <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
      </select>
    </div> -->

    <div class="mb-4 mt-4 flex flex-wrap items-center">
      <!-- Dropdown Bulan -->
      <div class="mb-2 mr-6 flex items-center">
        <label for="month" class="mr-2 text-sm font-medium text-gray-700">
          Pilih Bulan:
        </label>
        <select
          v-model="currentMonth"
          @change="fetchData"
          class="rounded-md border border-gray-300 px-2 py-1"
        >
          <option v-for="month in months" :key="month" :value="month">
            {{ month }}
          </option>
        </select>
      </div>

      <!-- Dropdown Tahun -->
      <div class="mb-2 flex items-center">
        <label for="year" class="mr-2 text-sm font-medium text-gray-700">
          Pilih Tahun:
        </label>
        <!-- <select
          v-model="currentYear"
          @change="fetchData"
          class="rounded-md border border-gray-300 px-2 py-1"
        >
          <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
        </select> -->
        <input
          v-model="currentYear"
          type="number"
          @change="fetchData"
          class="rounded-md border border-gray-300 px-2 py-1"
        />
      </div>
    </div>

    <div class="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
      <div class="flex items-center rounded-lg bg-white p-4 shadow">
        <img src="/assets/icons/income.png" class="mr-3 h-10 w-10" />
        <div class="overflow-x-auto whitespace-nowrap">
          <p class="text-gray-500">Income Total ({{ currentMonth }})</p>
          <p class="text-xl font-bold">{{ formatPrice(totalRevenue) }}</p>
        </div>
      </div>

      <div class="flex items-center rounded-lg bg-white p-4 shadow">
        <img src="/assets/icons/transaction.png" class="mr-3 h-10 w-10" />
        <div class="overflow-x-auto whitespace-nowrap">
          <p class="text-gray-500">Transaction Total ({{ currentMonth }})</p>
          <p class="text-xl font-bold">{{ totalTransactions }}</p>
        </div>
      </div>

      <div class="flex items-center rounded-lg bg-white p-4 shadow">
        <img src="/assets/icons/product_data.png" class="mr-3 h-10 w-10" />
        <div class="overflow-x-auto whitespace-nowrap">
          <p class="text-gray-500">Product Total</p>
          <p class="text-xl font-bold">{{ totalProducts }}</p>
        </div>
      </div>
    </div>

    <div class="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
      <div class="overflow-x-auto whitespace-nowrap rounded-lg bg-white p-4 shadow">
        <h2 class="text-lg font-bold">Top Products</h2>
        <table class="mt-3 w-full border-collapse border border-gray-200">
          <thead>
            <tr class="bg-gray-100">
              <th class="border p-2">Photo</th>
              <th class="border p-2">Product</th>
              <th class="border p-2">Price</th>
              <th class="border p-2">Category</th>
              <th class="border p-2">Sold Total</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="product in topProducts" :key="product.id" class="border">
              <td class="flex items-center p-2">
                <!-- <img
                  :src="
                    product.photo
                      ? useApi(`/storage/${product.photo}`)
                      : '/assets/images/avatar.png'
                  "
                  class="mr-2 h-10 w-10"
                /> -->
                <img
                  :src="
                    product.photo
                      ? useApi(`/public/storage/${product.photo}`)
                      : fallbackImage
                  "
                  @error="onImageError"
                  class="mr-2 h-10 w-10"
                />
              </td>
              <td>{{ product.name }}</td>
              <td class="p-2">{{ formatPrice(product.price) }}</td>
              <td class="p-2">{{ product.category_name }}</td>
              <td class="p-2">{{ product.total_sold }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="overflow-x-auto whitespace-nowrap rounded-lg bg-white p-4 shadow">
        <h2 class="text-lg font-bold">Grafik Penjualan</h2>
        <canvas id="salesChart"></canvas>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, ref } from "vue";
import Chart from "chart.js/auto";
import axios from "axios";
import { useCookie } from "#app";
import { useApi } from "~/composables/useApi";

definePageMeta({
  middleware: ["auth"],
});

export default {
  setup() {
    const isLoading = ref(true);
    const totalRevenue = ref(0);
    const totalTransactions = ref(0);
    const totalProducts = ref(0);
    const topProducts = ref([]);
    const salesData = ref([]);
    const salesLabels = ref([]);
    const currentMonth = ref(new Date().toLocaleString("id-ID", { month: "long" }));

    const fallbackImage = "/assets/images/avatar.png";

    const onImageError = (event) => {
      event.target.src = fallbackImage;
    };

    const months = [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ];
    const currentYear = ref(new Date().getFullYear());
    const years = ref(new Date().getFullYear());

    let chartInstance = null;

    // ✅ Tambahan: State untuk user login
    const user = ref(null);
    const token = useCookie("my_auth_token");

    // ✅ Tambahan: Ambil data user
    const fetchUser = async () => {
      try {
        const res = await axios.get(useApi("/api/user"), {
          headers: {
            Authorization: `Bearer ${token.value}`,
          },
        });
        user.value = res.data;
        console.log("User:", user.value);
      } catch (error) {
        console.error("Gagal mengambil data user:", error);
        if (error.response?.status === 401) {
          alert("Sesi Anda telah habis. Silakan login ulang.");
          window.location.href = "/login";
        }
      }
    };

    const fetchData = async () => {
      try {
        isLoading.value = true;

        const response = await axios.get(
          useApi(`/api/dashboard?month=${currentMonth.value}&year=${currentYear.value}`),
          {
            headers: {
              Authorization: `Bearer ${token.value}`, // ✅ Pakai token untuk semua request
            },
          }
        );

        totalRevenue.value = response.data.total_revenue;
        totalTransactions.value = response.data.total_transactions;
        totalProducts.value = response.data.total_products;
        topProducts.value = response.data.top_products;
        salesData.value = response.data.sales_by_month.map((item) => item.revenue);
        salesLabels.value = response.data.sales_by_month.map((item) => item.month);

        renderChart();
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        if (error.response?.status === 401) {
          alert("Autentikasi gagal, silakan login ulang.");
          window.location.href = "/login";
        }
      } finally {
        setTimeout(() => {
          isLoading.value = false;
        }, 500);
      }
    };

    const fetchNotifications = async () => {
      try {
        const res = await axios.get(useApi("/api/notifications"), {
          headers: { Authorization: `Bearer ${token.value}` },
        });
        notifications.value = res.data.slice(0, 5);
        unreadCount.value = res.data.filter(notif);
      } catch (err) {
        console.error("Gagal mengambil notifikasi:", err);
      }
    };

    const renderChart = () => {
      const ctx = document.getElementById("salesChart").getContext("2d");
      if (chartInstance) chartInstance.destroy();
      chartInstance = new Chart(ctx, {
        type: "line",
        data: {
          labels: salesLabels.value,
          datasets: [
            {
              label: "Total Pendapatan",
              data: salesData.value,
              borderColor: "#4A90E2",
              backgroundColor: "rgba(74, 144, 226, 0.2)",
              borderWidth: 2,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: { grid: { display: false } },
            y: { beginAtZero: true },
          },
        },
      });
    };

    const formatPrice = (price) => {
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
      }).format(price);
    };

    // ✅ Jalankan fetch user dan dashboard saat mounted
    onMounted(() => {
      fetchUser();
      fetchData();
      fetchNotifications();
    });

    return {
      totalRevenue,
      totalTransactions,
      totalProducts,
      topProducts,
      salesLabels,
      salesData,
      currentMonth,
      months,
      currentYear,
      years,
      fetchData,
      fetchNotifications,
      formatPrice,
      user, 
      onImageError,
    };
  },
};
</script>

<style>
canvas {
  width: 100% !important;
  height: 300px !important;
}
</style>
