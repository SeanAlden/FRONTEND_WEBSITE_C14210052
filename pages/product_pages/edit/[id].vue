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
const expStockList = ref([]); 
const errorMessage = ref("");
const descTextarea = ref(null); 

const fallbackImage = "/assets/images/avatar.png";

const product = reactive({
  name: "",
  code: "",
  category_id: "",
  price: "",
  description: "",
  photo: null,
});

const fetchCategories = async () => {
  try {
    const res = await axios.get(useApi("/api/categories"));
    categories.value = res.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
  }
};

// Fetch produk berdasarkan ID
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

    productImage.value = data.data.photo ? useApi(`/public/storage/${data.data.photo}`) : null;

    await nextTick();
  } catch (error) {
    console.error("Error fetching product:", error);
  }
};

const goBack = () => {
  router.back(); 
};

// Menangani unggahan file gambar
const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    product.photo = file;
    productImage.value = URL.createObjectURL(file);
  }
};

// // Fungsi untuk menambah stok berdasarkan tanggal expired
// const addExpStock = () => {
//   expStockList.value.push({ exp_date: "", stock: "0" });
// };

// // Fungsi untuk menghapus entri stok tertentu
// const removeExpStock = (index) => {
//   expStockList.value.splice(index, 1);
// };

// // Sesuaikan tinggi textarea secara otomatis
// const adjustHeight = (element) => {
//   nextTick(() => {
//     if (element) {
//       element.style.height = "auto";
//       element.style.height = `${element.scrollHeight}px`;
//     }
//   });
// };

// Fungsi untuk memperbarui produk
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

    const res = await axios.post(useApi(`/api/products/${route.params.id}`), formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

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

const onImageError = (event) => {
  event.target.src = fallbackImage;
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
        class="w-full resize-none overflow-hidden border p-2"
        rows="1"
      ></textarea>

      <!-- Kode Produk -->
      <label>Kode Produk:</label>
      <textarea
        v-model="product.code"
        required
        class="w-full resize-none overflow-hidden border p-2"
        rows="1"
      ></textarea>

      <!-- Kategori -->
      <label>Kategori:</label>
      <select v-model="product.category_id" required class="w-full border p-2">
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
        class="w-full border p-2"
      />

      <!-- Stok berdasarkan tanggal expired -->
      <div>
        <label>Tanggal Expired & Stoknya:</label>
        <div
          v-for="(item, index) in expStockList"
          :key="index"
          class="mb-2 flex items-center gap-2"
        >
          <input v-model="item.exp_date" type="date" required class="border p-2" />
					<span class="inline-block w-24 select-none border p-2">{{ item.stock }}</span>			
          <!-- <button
            type="button"
            @click="removeExpStock(index)"
            class="rounded bg-red-500 p-1 text-white"
          >
            Hapus
          </button> -->
        </div>
        <!-- <button
          type="button"
          @click="addExpStock"
          class="mt-2 rounded bg-green-500 p-2 text-white"
        >
          Tambah Stok Expired
        </button> -->
      </div>

      <!-- Deskripsi -->
      <label>Deskripsi:</label>
      <textarea
        v-model="product.description"
        placeholder="Deskripsi"
        class="w-full border p-2"
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
          class="h-40 w-40 rounded border object-cover"
        />
        <!-- <img
          :src="product.photo ? useApi(`/public/storage/${product.photo}`) : fallbackImage"
          @error="onImageError"
        /> -->
      </div>
      <input type="file" @change="handleFileUpload" class="w-full border p-2" />

      <p
        v-if="errorMessage"
        class="mt-2 rounded border border-red-400 bg-red-100 p-2 text-red-500"
      >
        {{ errorMessage }}
      </p>

      <div class="flex justify-start">
        <button
          @click="goBack"
          type="button"
          class="mr-2 rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
        >
          Kembali
        </button>

        <button
          type="submit"
          class="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          Simpan Perubahan
        </button>
      </div>
    </form>
  </div>
</template>
