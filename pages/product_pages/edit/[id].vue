<script setup>
import { ref, reactive, onMounted, watch, nextTick } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";

const route = useRoute();
const router = useRouter();
const categories = ref([]);
const productImage = ref(null);
const expStockList = ref([]); // Menyimpan stok berdasarkan tanggal expired
const errorMessage = ref("");

const product = reactive({
  name: "",
  code: "",
  category_id: "",
  price: "",
  description: "",
  photo: null,
});

// Fetch kategori terlebih dahulu
const fetchCategories = async () => {
  try {
    const res = await fetch("http://127.0.0.1:8000/api/categories");
    if (!res.ok) throw new Error("Gagal mengambil data kategori");
    const data = await res.json();
    categories.value = data;
  } catch (error) {
    console.error("Error fetching categories:", error);
  }
};

// Fetch produk berdasarkan ID
const fetchProduct = async () => {
  try {
    const res = await fetch(`http://127.0.0.1:8000/api/products/${route.params.id}`);
    if (!res.ok) throw new Error("Gagal mengambil data produk");

    const data = await res.json();
    Object.assign(product, {
      name: data.data.name,
      code: data.data.code,
      category_id: data.data.category_id,
      price: data.data.price,
      description: data.data.description,
    });

    // Simpan stok berdasarkan tanggal expired
    expStockList.value = data.data.stocks || [];

    // Set URL gambar jika ada foto
    productImage.value = data.data.photo
      ? `http://127.0.0.1:8000/storage/${data.data.photo}`
      : null;

    await nextTick();
  } catch (error) {
    console.error("Error fetching product:", error);
  }
};

// Menangani unggahan file gambar
const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    product.photo = file;
    productImage.value = URL.createObjectURL(file); // Update preview
  }
};

// Fungsi untuk menambah stok berdasarkan tanggal expired
const addExpStock = () => {
  expStockList.value.push({ exp_date: "", stock: "" });
};

// Fungsi untuk menghapus entri stok tertentu
const removeExpStock = (index) => {
  expStockList.value.splice(index, 1);
};

// Fungsi untuk memperbarui produk
// const updateProduct = async () => {
//   try {
//     const formData = new FormData();
//     formData.append("name", product.name);
//     formData.append("code", product.code);
//     formData.append("category_id", String(product.category_id));
//     formData.append("price", product.price);
//     formData.append("description", product.description);

//     if (product.photo instanceof File) {
//       formData.append("photo", product.photo);
//     }

//     // Menambahkan stok berdasarkan tanggal expired ke dalam FormData
//     expStockList.value.forEach((item, index) => {
//       formData.append(`stocks[${index}][exp_date]`, item.exp_date);
//       formData.append(`stocks[${index}][stock]`, item.stock);
//     });

//     const res = await fetch(`http://127.0.0.1:8000/api/products/${route.params.id}`, {
//       method: "POST",
//       body: formData,
//     });

//     if (!res.ok) throw new Error("Gagal memperbarui produk");

//     router.push("/product_pages/products");
//   } catch (error) {
//     console.error("Error updating product:", error);
//   }
// };

const updateProduct = async () => {
  errorMessage.value = ""; // Reset error

  try {
    const formData = new FormData();
    formData.append("name", product.name);
    formData.append("code", product.code);
    formData.append("category_id", String(product.category_id));
    formData.append("price", product.price);
    formData.append("description", product.description);

    if (product.photo instanceof File) {
      formData.append("photo", product.photo);
    }

    // Tambahkan stok per tanggal expired ke FormData
    expStockList.value.forEach((item, index) => {
      formData.append(`stocks[${index}][exp_date]`, item.exp_date);
      formData.append(`stocks[${index}][stock]`, item.stock);
    });

    const res =
      // await fetch(`http://127.0.0.1:8000/api/products/${route.params.id}`, {
      //   method: "POST", // Ubah menjadi PUT jika API backend sudah menggunakan PUT/PATCH
      //   body: formData,
      // headers: {
      //     // Accept: "application/json",
      //     'Content-Type': "multipart/form-data",
      //   },
      // });

      await axios.post(
        `http://127.0.0.1:8000/api/products/${route.params.id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

    // const data = await res.json();
    console.log("Response Data:", res.data);

    // if (!res.ok) {
    //   throw new Error(data.message || "Gagal memperbarui produk");
    // }

    if (!res.data || res.data.success === false) {
      throw new Error(res.data?.message || "Gagal memperbarui produk");
    }

    router.push("/product_pages/products");
  } catch (error) {
    errorMessage.value = error.message;

    // Hapus errorMessage setelah 3 detik
    setTimeout(() => {
      errorMessage.value = "";
    }, 3000);
  }
};

// Ambil data kategori dulu, lalu produk setelahnya
onMounted(async () => {
  await fetchCategories();
  await fetchProduct();
});
</script>

<template>
  <div class="p-6">
    <h1 class="mb-4 font-bold text-2xl">Edit Produk</h1>

    <form @submit.prevent="updateProduct" enctype="multipart/form-data">
      <!-- Nama Produk -->
      <label>Nama Produk:</label>
      <textarea
        v-model="product.name"
        required
        class="p-2 border w-full overflow-hidden resize-none"
        rows="1"
      ></textarea>

      <!-- Kode Produk -->
      <label>Kode Produk:</label>
      <textarea
        v-model="product.code"
        required
        class="p-2 border w-full overflow-hidden resize-none"
        rows="1"
      ></textarea>

      <!-- Kategori -->
      <label>Kategori:</label>
      <select v-model="product.category_id" required class="p-2 border w-full">
        <option v-for="cat in categories" :key="cat.id" :value="String(cat.id)">
          {{ cat.name }}
        </option>
      </select>

      <!-- Harga -->
      <label>Harga:</label>
      <input
        v-model.lazy="product.price"
        type="number"
        required
        class="p-2 border w-full"
      />

      <!-- Stok berdasarkan tanggal expired -->
      <div>
        <label>Stok per Tanggal Expired:</label>
        <div
          v-for="(item, index) in expStockList"
          :key="index"
          class="flex items-center gap-2 mb-2"
        >
          <input v-model="item.exp_date" type="date" required class="p-2 border" />
          <input
            v-model="item.stock"
            type="number"
            required
            class="p-2 border w-24"
          />
          <!-- <p class="p-2 border w-24">{{ item.stock || 10 }}</p> -->
          <button
            type="button"
            @click="removeExpStock(index)"
            class="bg-red-500 p-1 rounded text-white"
          >
            Hapus
          </button>
        </div>
        <button
          type="button"
          @click="addExpStock"
          class="bg-green-500 mt-2 p-2 rounded text-white"
        >
          Tambah Stok Expired
        </button>
      </div>

      <!-- Deskripsi -->
      <label>Deskripsi:</label>
      <textarea
        v-model="product.description"
        required
        class="p-2 border w-full overflow-hidden resize-none"
        rows="3"
      ></textarea>

      <!-- Foto Produk -->
      <label>Foto Produk:</label>
      <div v-if="productImage" class="mb-2">
        <img
          :src="productImage"
          alt="Foto Produk"
          class="border rounded w-40 h-40 object-cover"
        />
      </div>
      <input type="file" @change="handleFileUpload" class="p-2 border w-full" />

      <p
        v-if="errorMessage"
        class="bg-red-100 mt-2 p-2 border border-red-400 rounded text-red-500"
      >
        {{ errorMessage }}
      </p>
      <!-- Tombol Submit -->
      <button type="submit" class="bg-blue-500 mt-4 p-2 rounded text-white">
        Simpan Perubahan
      </button>
    </form>
  </div>
</template>
