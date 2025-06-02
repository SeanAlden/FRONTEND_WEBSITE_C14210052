<script setup>
import { ref, reactive, onMounted, watch, nextTick } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";

definePageMeta({
  middleware: ["auth"],
});

const route = useRoute();
const router = useRouter();
const categories = ref([]);
const productImage = ref(null);
const expStockList = ref([]); // Menyimpan stok berdasarkan tanggal expired
const errorMessage = ref("");
const descTextarea = ref(null); // Referensi untuk desctextarea

const product = reactive({
  name: "",
  code: "",
  category_id: "",
  price: "",
  description: "",
  photo: null,
});

// Fetch kategori terlebih dahulu
// const fetchCategories = async () => {
//   try {
//     const res = await fetch(useApi("/api/categories"));
//     if (!res.ok) throw new Error("Gagal mengambil data kategori");
//     const data = await res.json();
//     categories.value = data;
//   } catch (error) {
//     console.error("Error fetching categories:", error);
//   }
// };

// ✅ Fetch kategori pakai axios
const fetchCategories = async () => {
  try {
    const res = await axios.get(useApi("/api/categories"));
    categories.value = res.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
  }
};

// Fetch produk berdasarkan ID
// const fetchProduct = async () => {
//   try {
//     const res = await fetch(useApi(`/api/products/${route.params.id}`));
//     if (!res.ok) throw new Error("Gagal mengambil data produk");

//     const data = await res.json();
//     Object.assign(product, {
//       name: data.data.name,
//       code: data.data.code,
//       category_id: data.data.category_id,
//       price: data.data.price,
//       description: data.data.description,
//     });

//     // Simpan stok berdasarkan tanggal expired
//     expStockList.value = data.data.stocks || [];

//     // Set URL gambar jika ada foto
//     productImage.value = data.data.photo
//       ? useApi(`/storage/${data.data.photo}`)
//       : null;

//     await nextTick();
//   } catch (error) {
//     console.error("Error fetching product:", error);
//   }
// };

// ✅ Fetch produk berdasarkan ID pakai axios
const fetchProduct = async () => {
  try {
    const res = await axios.get(useApi(`/api/products/${route.params.id}`));
    const data = res.data;

    Object.assign(product, {
      name: data.data.name,
      code: data.data.code,
      category_id: data.data.category_id,
      price: data.data.price,
      description: data.data.description,
    });

    expStockList.value = data.data.stocks || [];

    productImage.value = data.data.photo
      ? useApi(`/storage/${data.data.photo}`)
      : null;

    await nextTick();
  } catch (error) {
    console.error("Error fetching product:", error);
  }
};

const goBack = () => {
  router.back(); // Fungsi untuk kembali ke halaman sebelumnya
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

// Sesuaikan tinggi textarea secara otomatis
const adjustHeight = (element) => {
  nextTick(() => {
    if (element) {
      element.style.height = "auto";
      element.style.height = `${element.scrollHeight}px`;
    }
  });
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

// const updateProduct = async () => {
//   errorMessage.value = ""; // Reset error

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

//     // Tambahkan stok per tanggal expired ke FormData
//     expStockList.value.forEach((item, index) => {
//       formData.append(`stocks[${index}][exp_date]`, item.exp_date);
//       formData.append(`stocks[${index}][stock]`, item.stock);
//     });

//     const res =
//       // await fetch(`http://127.0.0.1:8000/api/products/${route.params.id}`, {
//       //   method: "POST", // Ubah menjadi PUT jika API backend sudah menggunakan PUT/PATCH
//       //   body: formData,
//       // headers: {
//       //     // Accept: "application/json",
//       //     'Content-Type': "multipart/form-data",
//       //   },
//       // });

//       await axios.post(
//         useApi(`/api/products/${route.params.id}`),
//         formData,
//         {
//           headers: { "Content-Type": "multipart/form-data" },
//         }
//       );

//     // const data = await res.json();
//     console.log("Response Data:", res.data);

//     // if (!res.ok) {
//     //   throw new Error(data.message || "Gagal memperbarui produk");
//     // }

//     if (!res.data || res.data.success === false) {
//       throw new Error(res.data?.message || "Gagal memperbarui produk");
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

// ✅ Update produk pakai axios
const updateProduct = async () => {
  errorMessage.value = "";

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

    expStockList.value.forEach((item, index) => {
      formData.append(`stocks[${index}][exp_date]`, item.exp_date);
      formData.append(`stocks[${index}][stock]`, item.stock);
    });

    const res = await axios.post(
      useApi(`/api/products/${route.params.id}`),
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    if (!res.data || res.data.success === false) {
      throw new Error(res.data?.message || "Gagal memperbarui produk");
    }

    router.push("/product_pages/products");
  } catch (error) {
    errorMessage.value = error.message;
    setTimeout(() => {
      errorMessage.value = "";
    }, 3000);
  }
};

// Fungsi untuk auto resize desctextarea
const descAutoResize = () => {
  if (descTextarea.value) {
    descTextarea.value.style.height = "auto"; // Reset tinggi sebelum menyesuaikan
    descTextarea.value.style.height = descTextarea.value.scrollHeight + "px"; // Sesuaikan dengan konten
  }
};

// Ambil data kategori dulu, lalu produk setelahnya
onMounted(async () => {
  await fetchCategories();
  await fetchProduct();
  nextTick(() => descAutoResize());
});
</script>

<template>
  <div class="p-6">
    <h1 class="mb-4 text-2xl font-bold">Edit Produk</h1>

    <form @submit.prevent="updateProduct" enctype="multipart/form-data">
      <!-- Nama Produk -->
      <label>Nama Produk:</label>
      <textarea
        v-model="product.name"
        required
        class="w-full p-2 overflow-hidden border resize-none"
        rows="1"
      ></textarea>

      <!-- Kode Produk -->
      <label>Kode Produk:</label>
      <textarea
        v-model="product.code"
        required
        class="w-full p-2 overflow-hidden border resize-none"
        rows="1"
      ></textarea>

      <!-- Kategori -->
      <label>Kategori:</label>
      <select v-model="product.category_id" required class="w-full p-2 border">
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
        class="w-full p-2 border"
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
          <input v-model="item.stock" type="number" required class="w-24 p-2 border" />
          <!-- <p class="w-24 p-2 border">{{ item.stock || 10 }}</p> -->
          <button
            type="button"
            @click="removeExpStock(index)"
            class="p-1 text-white bg-red-500 rounded"
          >
            Hapus
          </button>
        </div>
        <button
          type="button"
          @click="addExpStock"
          class="p-2 mt-2 text-white bg-green-500 rounded"
        >
          Tambah Stok Expired
        </button>
      </div>

      <!-- Deskripsi -->
      <label>Deskripsi:</label>
      <textarea
        v-model="product.description"
        placeholder="Deskripsi"
        class="w-full p-2 border"
        rows="3"
        style="resize: none; overflow-y: hidden"
        ref="descTextarea"
        @input="descAutoResize"
        required
      ></textarea>

      <!-- Foto Produk -->
      <label>Foto Produk:</label>
      <div v-if="productImage" class="mb-2">
        <img
          :src="productImage"
          alt="Foto Produk"
          class="object-cover w-40 h-40 border rounded"
        />
      </div>
      <input type="file" @change="handleFileUpload" class="w-full p-2 border" />

      <p
        v-if="errorMessage"
        class="p-2 mt-2 text-red-500 bg-red-100 border border-red-400 rounded"
      >
        {{ errorMessage }}
      </p>

      <div class="flex justify-start">
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
          Simpan Perubahan
        </button>
      </div>
    </form>
  </div>
</template>
