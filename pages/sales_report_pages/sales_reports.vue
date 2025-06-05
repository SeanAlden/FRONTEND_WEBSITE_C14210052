<script setup>
import { ref, computed, onMounted, watch } from "vue";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import * as XLSX from "xlsx";
import autoTable from "jspdf-autotable";
import axios from "axios";

definePageMeta({
  middleware: ["auth"],
});

// Data transaksi dari API
const transactions = ref([]);
const isLoading = ref(true);
const error = ref(null);

// Filter bulan & tahun
const selectedMonth = ref(new Date().getMonth() + 1); // Default bulan ini
const selectedYear = ref(new Date().getFullYear()); // Default tahun ini

// Daftar bulan dalam bahasa Indonesia
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

// Pagination & Search
const itemsPerPageOptions = [5, 10, 20, 50];
const itemsPerPage = ref(5);
const currentPage = ref(1);
const searchQuery = ref("");
const token = useCookie("my_auth_token");

const fallbackImage = "/assets/images/avatar.png";

const formatPrice = (price) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);
};

// Fetch data transaksi dari API Laravel
const fetchTransactions = async () => {
  isLoading.value = true; // Set loading to true

  // try {
  //   isLoading.value = true;
  //   const response = await fetch(useApi("/api/transactions"), {
  //     headers: {
  //       Authorization: `Bearer ${token.value}`,
  //     },
  //   });
  //   if (!response.ok) throw new Error("Gagal mengambil data transaksi");

  //   const data = await response.json();
  //   transactions.value = data.transactions;
  // } catch (err) {
  //   error.value = err.message;
  // } finally {
  //   isLoading.value = false;
  // }
  try {
    const response = await axios.get(useApi("/api/transactions"), {
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    });
    transactions.value = response.data.transactions.map((transaction) => {
      const mergedProducts = {};

      transaction.details.forEach((detail) => {
        const productId = detail.product.id;
        if (!mergedProducts[productId]) {
          mergedProducts[productId] = {
            product_id: productId,
            name: detail.product.name,
            code: detail.product.code,
            photo: detail.product.photo,
            price: detail.product.price,
            quantity: 0,
          };
        }
        mergedProducts[productId].quantity += detail.quantity;
      });

      return {
        ...transaction,
        mergedDetails: Object.values(mergedProducts),
      };
    });
  } catch (error) {
    console.error("Gagal mengambil data transaksi:", error);
  } finally {
    isLoading.value = false;
  }
};

// Panggil fetch saat komponen dimuat
onMounted(fetchTransactions);

// // Filter transaksi berdasarkan bulan & tahun yang dipilih dan pencarian
// const filteredTransactions = computed(() => {
//   return transactions.value.filter((transaction) => {
//     const date = new Date(transaction.transaction_date);

//     // Filter berdasarkan bulan & tahun
//     if (
//       date.getMonth() + 1 !== selectedMonth.value ||
//       date.getFullYear() !== selectedYear.value
//     ) {
//       return false;
//     }

//     // Filter berdasarkan pencarian
//     const query = searchQuery.value.toLowerCase();
//     const productNames = transaction.details
//       .map((detail) => detail.product.name)
//       .join(" ");

//     return productNames.toLowerCase().includes(query);
//   });
// });

// // **Menggabungkan produk yang sama menjadi satu baris**
// const mergedTransactions = computed(() => {
//   const productMap = new Map();

//   filteredTransactions.value.forEach((transaction) => {
//     transaction.details.forEach((detail) => {
//       const product = detail.product;
//       const key = `${product.name}-${product.price}`; // Unik berdasarkan nama & harga

//       if (!productMap.has(key)) {
//         productMap.set(key, {
//           no: 0, // Akan diatur nanti
//           photo: product.photo || "/default-image.png",
//           name: product.name,
//           price: product.price,
//           sold: 0,
//           totalIncome: 0,
//           margin: 0,
//         });
//       }

//       const existingProduct = productMap.get(key);
//       existingProduct.sold += detail.quantity;
//       existingProduct.totalIncome += (product.price * detail.quantity);
//       existingProduct.margin += (product.price * detail.quantity) * 0.25;
//     });
//   });

//   return Array.from(productMap.values())
//     .sort((a, b) => b.sold - a.sold) // Sort descending by sold
//     .map((product, index) => ({
//       ...product,
//       no: index + 1,
//     }));
// });

// Modifikasi di computed filteredTransactions
// const filteredTransactions = computed(() => {
//   return transactions.value.filter((transaction) => {
//     // Parse tanggal dari API - format diasumsikan YYYY-MM-DD
//     const [year, month, day] = transaction.transaction_date.split("-");
//     const date = new Date(
//       parseInt(year),
//       parseInt(month) - 1, // Bulan dikurangi 1 karena JS Date month 0-based
//       parseInt(day)
//     );

//     // Filter berdasarkan bulan & tahun
//     if (
//       date.getMonth() + 1 !== selectedMonth.value ||
//       date.getFullYear() !== selectedYear.value
//     ) {
//       return false;
//     }

//     // Filter pencarian tetap sama
//     const query = searchQuery.value.toLowerCase();

//     // const productNames = transaction.details
//     //   .map((detail) => detail.product.name)
//     //   .join(" ");

//     const productNames = transaction.details
//       .map((detail) => detail.product_name) // Ambil langsung dari transaction_details
//       .join(" ");

//     return productNames.toLowerCase().includes(query);
//   });
// });

const filteredTransactions = computed(() => {
  return transactions.value
    .map((transaction) => {
      // Parse tanggal dari API - format diasumsikan YYYY-MM-DD
      const [year, month, day] = transaction.transaction_date.split("-");
      const date = new Date(
        parseInt(year),
        parseInt(month) - 1, // Bulan dikurangi 1 karena JS Date month 0-based
        parseInt(day)
      );

      // Filter berdasarkan bulan & tahun
      if (
        date.getMonth() + 1 !== selectedMonth.value ||
        date.getFullYear() !== selectedYear.value
      ) {
        return null; // Kembalikan null jika tidak sesuai bulan & tahun
      }

      // Filter pencarian
      const query = searchQuery.value.toLowerCase();

      // Cek produk yang cocok dengan query
      const matchedDetails = transaction.details.filter((detail) => {
        const productName = detail.product_name.toLowerCase();
        const productPrice = detail.product_price.toString(); // Konversi ke string untuk pencarian
        const productSold = detail.quantity.toString(); // Konversi ke string untuk pencarian
        const totalIncome = (detail.product_price * detail.quantity).toString(); // Hitung total income dan konversi ke string
        const margin = (totalIncome * 0.25).toString(); // Hitung margin dan konversi ke string

        return (
          productName.includes(query) ||
          productPrice.includes(query) ||
          productSold.includes(query) ||
          totalIncome.includes(query) ||
          margin.includes(query)
        );
      });

      // Kembalikan transaksi dengan produk yang cocok
      return matchedDetails.length > 0 ? { ...transaction, details: matchedDetails } : null;
    })
    .filter(transaction => transaction !== null); // Hapus transaksi yang null
});

// Modifikasi di mergedTransactions untuk perhitungan margin
// const mergedTransactions = computed(() => {
//   const productMap = new Map();

//   filteredTransactions.value.forEach((transaction) => {
//     transaction.details.forEach((detail) => {
//       const product = detail.product;
//       const key = `${product.name}-${product.price}`;

//       if (!productMap.has(key)) {
//         productMap.set(key, {
//           no: 0,
//           photo: product.photo || "/default-image.png",
//           name: product.name,
//           price: product.price,
//           sold: 0,
//           totalIncome: 0,
//           margin: 0,
//         });
//       }

//       const existingProduct = productMap.get(key);
//       const quantity = detail.quantity;
//       const totalPrice = product.price * quantity;

//       existingProduct.sold += quantity;
//       existingProduct.totalIncome += totalPrice;
//       existingProduct.margin += totalPrice * 0.25; // 25% margin
//     });
//   });

//   return Array.from(productMap.values())
//     .sort((a, b) => b.sold - a.sold)
//     .map((product, index) => ({
//       ...product,
//       no: index + 1,
//     }));
// });

// const mergedTransactions = computed(() => {
//   const productMap = new Map();
//   filteredTransactions.value.forEach((transaction) => {
//     transaction.details.forEach((detail) => {
//       // Gunakan data dari transaction_details
//       const key = `${detail.product_name}-${detail.product_price}`;
//       if (!productMap.has(key)) {
//         productMap.set(key, {
//           no: 0,
//           photo: detail.product.photo || "/assets/images/avatar.png", // Ambil dari transaction_details
//           name: detail.product_name, // Ambil dari transaction_details
//           price: detail.product_price, // Ambil dari transaction_details
//           sold: 0,
//           totalIncome: 0,
//           margin: 0,
//         });
//       }
//       const existingProduct = productMap.get(key);
//       const quantity = detail.quantity;
//       const totalPrice = detail.product_price * quantity; // Hitung dengan harga historis
//       existingProduct.sold += quantity;
//       existingProduct.totalIncome += totalPrice;
//       existingProduct.margin += totalPrice * 0.25;
//     });
//   });
//   return Array.from(productMap.values())
//     .sort((a, b) => b.sold - a.sold)
//     .map((product, index) => ({
//       ...product,
//       no: index + 1,
//     }));
// });

const mergedTransactions = computed(() => {
  const productMap = new Map();
  filteredTransactions.value.forEach((transaction) => {
    transaction.details.forEach((detail) => {
      const key = `${detail.product_name}-${detail.product_price}`;
      if (!productMap.has(key)) {
        productMap.set(key, {
          no: 0,
          photo: detail.product.photo || "/assets/images/avatar.png",
          name: detail.product_name,
          price: detail.product_price,
          sold: 0,
          totalIncome: 0,
          margin: 0,
        });
      }
      const existingProduct = productMap.get(key);
      const quantity = detail.quantity;
      const totalPrice = detail.product_price * quantity;
      existingProduct.sold += parseInt(quantity, 10); // Konversi ke integer
      existingProduct.totalIncome += totalPrice;
      existingProduct.margin += totalPrice * 0.25;
    });
  });
  return Array.from(productMap.values())
    .sort((a, b) => b.sold - a.sold)
    .map((product, index) => ({
      ...product,
      no: index + 1,
    }));
});

// Pagination
const paginatedTransactions = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  return mergedTransactions.value.slice(start, start + itemsPerPage.value);
});

const totalPages = computed(() =>
  Math.ceil(mergedTransactions.value.length / itemsPerPage.value)
);

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

// Method untuk mengubah halaman
const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value && page !== "...") {
    currentPage.value = page;
  }
};

// Total dari semua produk
const grandTotal = computed(() => {
  return mergedTransactions.value.reduce(
    (totals, product) => {
      totals.sold += product.sold;
      totals.totalIncome += product.totalIncome;
      totals.margin += product.margin;
      return totals;
    },
    { sold: 0, totalIncome: 0, margin: 0 }
  );
});

// const exportToPDF = async () => {
//   const element = document.getElementById("sales-report-table"); // ID tabel yang ingin diekspor
//   const pdf = new jsPDF("p", "pt", "a4");
//   const canvas = await html2canvas(element);
//   const imgData = canvas.toDataURL("image/png");
//   const imgWidth = 190; // Lebar gambar
//   const pageHeight = pdf.internal.pageSize.height;
//   const imgHeight = (canvas.height * imgWidth) / canvas.width;
//   let heightLeft = imgHeight;
//   let position = 0;
//   pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
//   heightLeft -= pageHeight;
//   while (heightLeft >= 0) {
//     position = heightLeft - imgHeight;
//     pdf.addPage();
//     pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
//     heightLeft -= pageHeight;
//   }
//   pdf.save("sales_report.pdf");
// };

// const exportToPDF = async () => {
//   const element = document.getElementById("sales-report-table");
//   const pdf = new jsPDF("p", "pt", "a4");
//   // Menambahkan informasi di atas tabel
//   pdf.setFontSize(20);
//   pdf.text("Toko Obat Asia Raya", 40, 30);
//   pdf.setFontSize(12);
//   pdf.text(
//     `Laporan Penjualan Bulan: ${months[selectedMonth.value - 1]} Tahun: ${
//       selectedYear.value
//     }`,
//     40,
//     50
//   );
//   pdf.setFontSize(10);
//   pdf.text("Tanggal: " + new Date().toLocaleDateString(), 40, 70);
//   const canvas = await html2canvas(element);
//   const imgData = canvas.toDataURL("image/png");
//   const imgWidth = 190;
//   const pageHeight = pdf.internal.pageSize.height;
//   const imgHeight = (canvas.height * imgWidth) / canvas.width;
//   let heightLeft = imgHeight;
//   let position = 0;
//   pdf.addImage(imgData, "PNG", 10, position + 100, imgWidth, imgHeight); // Offset untuk teks
//   heightLeft -= pageHeight;
//   while (heightLeft >= 0) {
//     position = heightLeft - imgHeight;
//     pdf.addPage();
//     pdf.addImage(imgData, "PNG", 10, position + 100, imgWidth, imgHeight); // Offset untuk teks
//     heightLeft -= pageHeight;
//   }
//   pdf.save("sales_report.pdf");
// };

const exportToPDF = () => {
  const doc = new jsPDF();

  doc.setFontSize(14);
  doc.text("Toko Obat Asia Raya", 14, 15);
  doc.setFontSize(11);
  doc.text(`Bulan: ${months[selectedMonth.value - 1]}`, 14, 23);
  doc.text(`Tahun: ${selectedYear.value}`, 14, 30);

  const tableHeader = [["No", "Name", "Price", "Sold", "Total Income", "Margin"]];
  const tableData = mergedTransactions.value.map((product) => [
    product.no,
    product.name,
    product.price,
    product.sold,
    product.totalIncome,
    product.margin,
  ]);

  tableData.push([
    "Total",
    "",
    "",
    grandTotal.value.sold,
    grandTotal.value.totalIncome,
    grandTotal.value.margin,
  ]);

  autoTable(doc, {
    head: tableHeader,
    body: tableData,
    startY: 40,
    styles: { fontSize: 10 },
    headStyles: { fillColor: [41, 128, 185] },
  });

  const monthName = months[selectedMonth.value - 1].toLowerCase();
  doc.save(`sales_report_${monthName}.pdf`);
};

// const exportToExcel = () => {
//   const worksheet = XLSX.utils.json_to_sheet(
//     mergedTransactions.value.map((product) => ({
//       No: product.no,
//       Name: product.name,
//       Price: product.price,
//       Sold: product.sold,
//       TotalIncome: product.totalIncome,
//       Margin: product.margin,
//     }))
//   );
//   const workbook = XLSX.utils.book_new();
//   XLSX.utils.book_append_sheet(workbook, worksheet, "Sales Report");
//   XLSX.writeFile(workbook, "sales_report.xlsx");
// };

// const exportToExcel = () => {
//   const data = [
//     {
//       Info: "Toko Obat Asia Raya",
//       Bulan: `Bulan: ${months[selectedMonth.value - 1]}`,
//       Tahun: `Tahun: ${selectedYear.value}`,
//     },
//     {}, // Baris kosong untuk pemisah
//   ];
//   const worksheet = XLSX.utils.json_to_sheet(data);
//   const worksheetData = XLSX.utils.json_to_sheet(
//     mergedTransactions.value.map((product) => ({
//       No: product.no,
//       Name: product.name,
//       Price: product.price,
//       Sold: product.sold,
//       TotalIncome: product.totalIncome,
//       Margin: product.margin,
//     }))
//   );
//   // Menggabungkan worksheet
//   const workbook = XLSX.utils.book_new();

//   XLSX.utils.sheet_add_json(worksheet, data, { skipHeader: true, origin: "A1" });
//   XLSX.utils.book_append_sheet(workbook, worksheet, "Info");
//   XLSX.utils.book_append_sheet(workbook, worksheetData, "Sales Report");
//   XLSX.writeFile(workbook, "sales_report.xlsx");
// };

// const exportToExcel = () => {
//   // Data header
//   const header = [
//     // { No: "No" },
//     // { Name: "Name" },
//     // { Price: "Price" },
//     // { Sold: "Sold" },
//     // { TotalIncome: "Total Income" },
//     // { Margin: "Margin" },
//     {
//       Info: "Toko Obat Asia Raya",
//     },
//     {
//       Bulan: `Bulan: ${months[selectedMonth.value - 1]}`,
//     },
//     {
//       Tahun: `Tahun: ${selectedYear.value}`,
//     },
//   ];

//   // Data untuk worksheet
//   const worksheetData = mergedTransactions.value.map((product) => ({
//     No: product.no,
//     Name: product.name,
//     Price: product.price,
//     Sold: product.sold,
//     TotalIncome: product.totalIncome,
//     Margin: product.margin,
//   }));

//   // Menghitung total
//   const totalSold = grandTotal.value.sold;
//   const totalIncome = grandTotal.value.totalIncome;
//   const totalMargin = grandTotal.value.margin;

//   // Menambahkan total ke data
//   worksheetData.push({
//     No: "Total",
//     Name: "",
//     Price: "",
//     Sold: totalSold,
//     TotalIncome: totalIncome,
//     Margin: totalMargin,
//   });

//   // Membuat worksheet
//   const worksheet = XLSX.utils.json_to_sheet(header.concat(worksheetData));

//   // Membuat workbook dan menambahkan worksheet
//   const workbook = XLSX.utils.book_new();
//   XLSX.utils.book_append_sheet(workbook, worksheet, "Sales Report");

//   // // Menyimpan file Excel
//   // XLSX.writeFile(workbook, "sales_report.xlsx");

//   // Menyimpan file Excel dengan nama yang mencakup bulan
//   const monthName = months[selectedMonth.value - 1].toLowerCase(); // Mengambil nama bulan dalam huruf kecil
//   const fileName = `sales_report_${monthName}.xlsx`; // Membentuk nama file
//   XLSX.writeFile(workbook, fileName);
// };

const exportToExcel = () => {
  const infoHeader = [
    ["Toko Obat Asia Raya"],
    [`Bulan: ${months[selectedMonth.value - 1]}`],
    [`Tahun: ${selectedYear.value}`],
    [], // Baris kosong sebelum header tabel
  ];

  const tableHeader = [["No", "Name", "Price", "Sold", "Total Income", "Margin"]];
  const tableData = mergedTransactions.value.map((product) => [
    product.no,
    product.name,
    product.price,
    product.sold,
    product.totalIncome,
    product.margin,
  ]);

  tableData.push([
    "Total",
    "",
    "",
    grandTotal.value.sold,
    grandTotal.value.totalIncome,
    grandTotal.value.margin,
  ]);

  const worksheetArray = infoHeader.concat(tableHeader, tableData);
  const worksheet = XLSX.utils.aoa_to_sheet(worksheetArray);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sales Report");

  const monthName = months[selectedMonth.value - 1].toLowerCase();
  const fileName = `sales_report_${monthName}.xlsx`;
  XLSX.writeFile(workbook, fileName);
};

const onImageError = (event) => {
  event.target.src = fallbackImage;
};

// Watcher untuk itemsPerPage
watch(itemsPerPage, () => {
  currentPage.value = 1;
});
</script>

<template>
  <div class="container p-6 mx-auto bg-gray-100">
    <h1 class="text-3xl font-bold text-center">Toko Obat Asia Raya</h1>
    <h2 class="text-xl font-semibold text-center">Product Sales Report</h2>
    <p class="text-center text-gray-500">
      Bulan {{ months[selectedMonth - 1] }} Tahun {{ selectedYear }}
    </p>

    <!-- Filter -->
    <div class="flex justify-center mt-4 space-x-4">
      <div>
        <label class="font-medium">Pilih Bulan:</label>
        <select v-model="selectedMonth" class="px-3 py-1 border rounded">
          <option v-for="(month, index) in months" :key="index" :value="index + 1">
            {{ month }}
          </option>
        </select>
      </div>
      <div>
        <label class="font-medium">Pilih Tahun:</label>
        <input
          v-model="selectedYear"
          type="number"
          class="w-20 px-3 py-1 border rounded"
        />
      </div>
    </div>
    <div class="flex justify-end mt-4 space-x-4">
      <button @click="exportToPDF" class="px-4 py-2 text-white bg-blue-500 rounded">
        Ekspor ke PDF
      </button>
      <button @click="exportToExcel" class="px-4 py-2 text-white bg-green-500 rounded">
        Ekspor ke Excel
      </button>
    </div>

    <!-- Search & Items per page -->
    <div class="flex justify-between my-4">
      <div>
        <label class="mr-2">Show</label>
        <select v-model="itemsPerPage" class="px-2 py-1 border rounded">
          <option v-for="option in itemsPerPageOptions" :key="option" :value="option">
            {{ option }}
          </option>
        </select>
        <span class="ml-2">entries</span>
      </div>
      <input
        type="text"
        v-model="searchQuery"
        placeholder="Search products"
        class="px-3 py-1 border rounded"
      />
    </div>

    <div class="flex items-center justify-center py-10" v-if="isLoading">
      <!-- <p>Loading...</p> -->
      <!-- Ganti dengan spinner jika perlu -->
      <div
        class="w-16 h-16 ease-linear border-8 border-t-8 border-gray-200 rounded-full loader"
      ></div>
    </div>

    <!-- Tabel Data -->
    <transition v-if="!isLoading" name="fade">
      <div
        class="p-4 mt-6 overflow-x-auto bg-white rounded-lg shadow-md whitespace-nowrap"
      >
        <div
          id="sales-report-table"
          class="p-4 mt-6 overflow-x-auto bg-white rounded-lg shadow-md whitespace-nowrap"
        >
          <table class="w-full border-collapse">
            <thead class="bg-gray-200">
              <tr>
                <th class="px-2 py-2 border">No</th>
                <th class="px-2 py-2 border">Photo</th>
                <th class="px-2 py-2 border">Name</th>
                <th class="px-2 py-2 border">Harga</th>
                <th class="px-2 py-2 border">Sold</th>
                <th class="px-2 py-2 border">Kas Masuk</th>
                <th class="px-2 py-2 border">Margin Penjualan</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="isLoading">
                <td colspan="7" class="py-4 text-center text-gray-500">Memuat data...</td>
              </tr>
              <tr v-else-if="error">
                <td colspan="7" class="text-center text-red-500">{{ error }}</td>
              </tr>
              <tr v-else-if="mergedTransactions.length === 0">
                <td colspan="7" class="py-4 text-center text-gray-500">
                  Tidak ada data untuk bulan ini
                </td>
              </tr>
              <tr v-else v-for="product in paginatedTransactions" :key="product.no">
                <td class="px-4 py-2 border text-lg-center">
                  {{ (currentPage - 1) * itemsPerPage + product.no }}
                </td>
                <!-- <td class="flex items-center justify-center px-0 py-2 border"> -->
                <td
                  class="flex min-h-[100px] min-w-[100px] items-center justify-center border p-2"
                >
                  <img
                    :src="
                      product.photo ? useApi(`/public/storage/${product.photo}`) : fallbackImage
                    "
                    @error="onImageError"
                    class="w-20 h-20 object-fit"
                  />
                </td>
                <td class="px-2 py-2 text-blue-600 border cursor-pointer hover:underline">
                  {{ product.name }}
                </td>
                <td class="px-2 py-2 text-center border">
                  {{ formatPrice(product.price) }}
                </td>
                <td class="px-2 py-2 text-center border">{{ product.sold }}</td>
                <td class="px-2 py-2 text-center border">
                  {{ formatPrice(product.totalIncome) }}
                </td>
                <td class="px-2 py-2 text-center border">
                  {{ formatPrice(product.margin) }}
                </td>
              </tr>
            </tbody>
            <tfoot v-if="!isLoading && !error && mergedTransactions.length > 0">
              <tr class="font-semibold bg-gray-100">
                <td colspan="4" class="px-2 py-2 text-right border">
                  Total Keseluruhan:
                </td>
                <td class="px-2 py-2 text-center border">{{ grandTotal.sold }}</td>
                <td class="px-2 py-2 text-center border">
                  {{ formatPrice(grandTotal.totalIncome) }}
                </td>
                <td class="px-2 py-2 text-center border">
                  {{ formatPrice(grandTotal.margin) }}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </transition>

    <!-- Pagination Controls -->
    <div class="flex justify-between mt-4">
      <div>
        Showing {{ (currentPage - 1) * itemsPerPage + 1 }} to
        {{ Math.min(currentPage * itemsPerPage, mergedTransactions.length) }} of
        {{ mergedTransactions.length }} entries
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
</template>
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
