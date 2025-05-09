<template>
  <div class="bg-gray-100 p-6 min-h-screen">
    <h1 class="font-bold text-2xl">Dashboard</h1>
    <p class="text-gray-600">Hello, john doe</p>

    <!-- Dropdown untuk pilih bulan -->
    <div class="mt-4 mb-4">
      <label for="month" class="mr-2 font-medium text-gray-700 text-sm"
        >Pilih Bulan:</label
      >
      <select
        v-model="currentMonth"
        @change="fetchData"
        class="px-2 py-1 border border-gray-300 rounded-md"
      >
        <option v-for="month in months" :key="month" :value="month">{{ month }}</option>
      </select>
    </div>

    <div class="gap-4 grid grid-cols-1 md:grid-cols-3 mt-4">
      <div class="flex items-center bg-white shadow p-4 rounded-lg">
        <img src="/assets/icons/income.png" class="mr-3 w-10 h-10" />
        <div class="overflow-x-auto whitespace-nowrap">
          <p class="text-gray-500">Income Total ({{ currentMonth }})</p>
          <p class="font-bold text-xl">{{ formatPrice(totalRevenue) }}</p>
        </div>
      </div>

      <div class="flex items-center bg-white shadow p-4 rounded-lg">
        <img src="/assets/icons/transaction.png" class="mr-3 w-10 h-10" />
        <div class="overflow-x-auto whitespace-nowrap">
          <p class="text-gray-500">Transaction Total ({{ currentMonth }})</p>
          <p class="font-bold text-xl">{{ totalTransactions }}</p>
        </div>
      </div>

      <div class="flex items-center bg-white shadow p-4 rounded-lg">
        <img src="/assets/icons/product_data.png" class="mr-3 w-10 h-10" />
        <div class="overflow-x-auto whitespace-nowrap">
          <p class="text-gray-500">Product Total</p>
          <p class="font-bold text-xl">{{ totalProducts }}</p>
        </div>
      </div>
    </div>

    <div class="gap-4 grid grid-cols-1 md:grid-cols-2 mt-6">
      <div class="bg-white shadow p-4 rounded-lg overflow-x-auto whitespace-nowrap">
        <h2 class="font-bold text-lg">Top Products</h2>
        <table class="mt-3 border border-gray-200 w-full border-collapse">
          <thead>
            <tr class="bg-gray-100">
              <th class="p-2 border">Photo</th>
              <th class="p-2 border">Product</th>
              <th class="p-2 border">Price</th>
              <th class="p-2 border">Category</th>
              <th class="p-2 border">Sold Total</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="product in topProducts" :key="product.id" class="border">
              <td class="flex items-center p-2">
                <img
                  :src="
                    product.photo
                      ? `http://localhost:8000/storage/${product.photo}`
                      : '/assets/images/avatar.png'
                  "
                  class="mr-2 w-16 h-16"
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

      <div class="bg-white shadow p-4 rounded-lg overflow-x-auto whitespace-nowrap">
        <h2 class="font-bold text-lg">Grafik Penjualan</h2>
        <canvas id="salesChart"></canvas>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, ref } from "vue";
import Chart from "chart.js/auto";
import axios from "axios";

// definePageMeta({
// 	middleware: ['$auth']
// });

export default {
  setup() {
    const totalRevenue = ref(0);
    const totalTransactions = ref(0);
    const totalProducts = ref(0);
    const topProducts = ref([]);
    const salesData = ref([]);
    const salesLabels = ref([]);
    const currentMonth = ref(new Date().toLocaleString("id-ID", { month: "long" }));
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

    let chartInstance = null;

    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/dashboard?month=${currentMonth.value}`
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

    onMounted(fetchData);

    return {
      totalRevenue,
      totalTransactions,
      totalProducts,
      topProducts,
      salesLabels,
      salesData,
      currentMonth,
      months,
      fetchData,
      formatPrice,
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
