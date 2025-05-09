import { defineStore } from "pinia";

export const useProductStore = defineStore("product", {
  state: () => ({
    products: [],
    categories: [],
  }),
  actions: {
    async fetchProducts() {
      const response = await fetch("http://localhost:8000/api/products");
      const data = await response.json();
      this.products = data.data;
    },
    async fetchProductsByCategory(categoryId) {
      const response = await fetch(`http://localhost:8000/api/products/category/${categoryId}`);
      const data = await response.json();
      this.products = data.data;
    },
    async addProduct(product) {
      const response = await fetch("http://localhost:8000/api/products", {
        method: "POST",
        body: product,
      });
      return response.json();
    },
    async deleteProduct(id) {
      await fetch(`http://localhost:8000/api/products/${id}`, { method: "DELETE" });
      this.fetchProducts();
    }
  },
});
