<script setup>
import { ref, reactive, onMounted, nextTick } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

definePageMeta({
  middleware: ["auth"],
});

const router = useRouter();
const categories = ref([]);
const existingProductCodes = ref([]); // Menyimpan daftar kode produk yang ada
const form = reactive({
  name: "",
  code: "",
  category_id: "",
  price: "",
  description: "",
  photo: null,
  stocks: [{ stock: "0", exp_date: "" }], // Awal dengan satu input stok
});

const nameInputRef = ref(null);
const textareaRef = ref(null);
const codeError = ref(""); // Untuk menyimpan pesan error kode produk
const errorMessage = ref("");

// Ambil kategori & produk yang ada saat halaman dimuat
// const fetchCategories = async () => {
//   const res = await fetch(useApi(`/api/categories`));
//   const data = await res.json();
//   categories.value = data;
// };

// const fetchExistingProducts = async () => {
//   const res = await fetch(useApi(`/api/products`));
//   const data = await res.json();
//   existingProductCodes.value = data.map((product) => product.code); // Simpan kode produk yang sudah ada
// };

// Ambil kategori & produk yang ada saat halaman dimuat
const fetchCategories = async () => {
  try {
    const res = await axios.get(useApi(`/api/api/categories`));
    categories.value = res.data;
  } catch (error) {
    console.error("Gagal mengambil data kategori:", error);
  }
};

const fetchExistingProducts = async () => {
  try {
    const res = await axios.get(useApi(`/api/api/products`));
    existingProductCodes.value = res.data.map((product) => product.code);
  } catch (error) {
    console.error("Gagal mengambil data produk:", error);
  }
};

// Menangani upload foto
const handleFileUpload = (event) => {
  form.photo = event.target.files[0] || null;
};

// Tambah field stok & tanggal kadaluarsa
const addStockField = () => {
  form.stocks.push({ stock: "", exp_date: "" });
};

// Hapus field stok & tanggal kadaluarsa
const removeStockField = (index) => {
  if (form.stocks.length > 1) {
    form.stocks.splice(index, 1);
  }
};

// Validasi kode produk
const validateProductCode = () => {
  if (existingProductCodes.value.includes(form.code)) {
    codeError.value = "Kode produk ini sudah digunakan!";
  } else {
    codeError.value = "";
  }
};

// Kirim data ke backend
// const addProduct = async () => {

//   validateProductCode();
//   if (codeError.value) return; // Jika ada error, hentikan proses submit

//   const formData = new FormData();
//   Object.keys(form).forEach((key) => {
//     if (key !== "photo" && key !== "stocks") {
//       formData.append(key, form[key]);
//     }
//   });

//   // Tambahkan stok ke dalam formData
//   form.stocks.forEach((stock, index) => {
//     formData.append(`stocks[${index}][stock]`, stock.stock);
//     formData.append(`stocks[${index}][exp_date]`, stock.exp_date);
//   });

//   if (form.photo) {
//     formData.append("photo", form.photo);
//   }

//   await fetch(`http://127.0.0.1:8000/api/products`, {
//     method: "POST",
//     body: formData,
//   });

//   router.push("/product_pages/products");
// };

// const addProduct = async () => {
//   errorMessage.value = ""; // Reset error

//   const formData = new FormData();
//   Object.keys(form).forEach((key) => {
//     if (key !== "photo" && key !== "stocks") {
//       formData.append(key, form[key]);
//     }
//   });

//   form.stocks.forEach((stock, index) => {
//     formData.append(`stocks[${index}][stock]`, stock.stock);
//     formData.append(`stocks[${index}][exp_date]`, stock.exp_date);
//   });

//   if (form.photo) {
//     formData.append("photo", form.photo);
//   }

//   try {
//     const response =
// 		// await fetch(`http://127.0.0.1:8000/api/products`, {
//     //   method: "POST",
//     //   body: formData,
//     //   headers: {
//         // Accept: "application/json",
//     //   },
//     // });
// 	await axios.post(`http://127.0.0.1:8000/api/products`, formData, {
//       headers: { 'Content-Type': 'multipart/form-data' }
//     });

//     const data = await response.json();

//     if (!response.ok) {
//       throw new Error(data.message || "Gagal menambahkan produk");
//     }

//     router.push("/product_pages/products");
//   } catch (error) {
//     errorMessage.value = error.message;

//     // Hapus errorMessage setelah 3 detik
//     setTimeout(() => {
//       errorMessage.value = "";
//     }, 3000);
//   }
// };

const addProduct = async () => {
  errorMessage.value = "";

  const formData = new FormData();
  Object.keys(form).forEach((key) => {
    if (key !== "photo" && key !== "stocks") {
      formData.append(key, form[key]);
    }
  });

  form.stocks.forEach((stock, index) => {
    formData.append(`stocks[${index}][stock]`, stock.stock);
    formData.append(`stocks[${index}][exp_date]`, stock.exp_date);
  });

  if (form.photo) {
    formData.append("photo", form.photo);
  }

  try {
    // const response = await axios.post(useApi(`/api/api/products`), formData, {
    //   headers: { 'Content-Type': 'multipart/form-data' }
    // });

    const response = await axios.post(useApi(`/api/api/products`), formData);

    console.log("Response Data:", response.data);

    if (!response.data || response.data.success === false) {
      throw new Error(response.data?.message || "Gagal menambahkan produk");
    }

    router.push("/product_pages/products");
  } catch (error) {
    errorMessage.value = error.response?.data?.message || error.message;

    setTimeout(() => {
      errorMessage.value = "";
    }, 3000);
  }
};

const goBack = () => {
  router.back();
};

// Sesuaikan tinggi textarea secara otomatis
const adjustHeight = (element) => {
  nextTick(() => {
    if (element) {
      element.style.height = "auto";
      element.style.height = `${element.scrollHeight}px`;
    }
  });
};

onMounted(() => {
  fetchCategories();
  fetchExistingProducts();
});
</script>

<template>
  <div class="p-6">
    <h1 class="mb-4 text-2xl font-bold">Tambah Produk</h1>

    <form @submit.prevent="addProduct">
      <!-- Nama Produk -->
      <label>Nama Produk:</label>
      <textarea
        ref="nameInputRef"
        v-model="form.name"
        rows="1"
        required
        class="w-full p-2 overflow-hidden border resize-none"
        @input="adjustHeight($event.target)"
      ></textarea>

      <!-- Kode Produk -->
      <label>Kode Produk:</label>
      <textarea
        v-model="form.code"
        rows="1"
        required
        class="w-full p-2 overflow-hidden border resize-none"
        @input="
          adjustHeight($event.target);
          validateProductCode();
        "
      ></textarea>
      <p v-if="codeError" class="text-red-500">{{ codeError }}</p>
      <!-- Menampilkan pesan error -->

      <!-- Kategori -->
      <label>Kategori:</label>
      <select v-model="form.category_id" required class="w-full p-2 border">
        <option value="">Pilih Kategori</option>
        <option v-for="cat in categories" :key="cat.id" :value="cat.id">
          {{ cat.name }}
        </option>
      </select>

      <!-- Harga -->
      <label>Harga:</label>
      <input v-model="form.price" type="number" required class="w-full p-2 border" />

      <!-- Stok & Tanggal Kadaluarsa -->
      <label>Stok & Tanggal Kadaluarsa:</label>
      <!-- <label>Tanggal Kadaluarsa:</label> -->
      <div v-for="(stock, index) in form.stocks" :key="index" class="flex gap-2 mb-2">
        <!-- <input
          v-model="stock.stock"
          type="number"
          placeholder="Jumlah Stok"
          required
          class="w-1/2 p-2 border"
        /> -->
        <input v-model="stock.exp_date" type="date" required class="w-1/2 p-2 border" />
        <button
          type="button"
          @click="removeStockField(index)"
          class="p-2 text-white bg-red-500 rounded"
          v-if="form.stocks.length > 1"
        >
          ✕
        </button>
      </div>
      <button
        type="button"
        @click="addStockField"
        class="p-2 mb-4 text-white bg-blue-500 rounded"
      >
        + Tambah Stok
      </button>

      <!-- Deskripsi -->
      <label>Deskripsi:</label>
      <textarea
        ref="textareaRef"
        v-model="form.description"
        required
        class="w-full p-2 overflow-hidden border resize-none"
        @input="adjustHeight($event.target)"
      ></textarea>

      <!-- Foto Produk -->
      <label>Foto Produk:</label>
      <input type="file" @change="handleFileUpload" class="w-full p-2 border" />

      <p
        v-if="errorMessage"
        class="p-2 mt-2 text-red-500 bg-red-100 border border-red-400 rounded"
      >
        {{ errorMessage }}
      </p>

      <div class="flex justify-start mb-4">
        <button
          @click="goBack"
          type="button"
          class="px-4 py-2 mr-2 text-white bg-gray-500 rounded hover:bg-gray-600"
        >
          Kembali
        </button>

        <button
          type="submit"
          class="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
        >
          Tambah Produk
        </button>
      </div>
    </form>
  </div>
</template>
