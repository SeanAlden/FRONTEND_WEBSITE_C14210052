// export default function useApi() {
//     const apiUrl = "http://127.0.0.1:8000/api";
  
//     const getCategories = async () => {
//       try {
//         const response = await fetch(`${apiUrl}/categories`);
//         return await response.json();
//       } catch (error) {
//         console.error("Error fetching categories:", error);
//       }
//     };
  
//     const createCategory = async (data) => {
//       try {
//         const response = await fetch(`${apiUrl}/categories`, {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(data),
//         });
//         return await response.json();
//       } catch (error) {
//         console.error("Error creating category:", error);
//       }
//     };
  
//     const updateCategory = async (id, data) => {
//       try {
//         const response = await fetch(`${apiUrl}/categories/${id}`, {
//           method: "PUT",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(data),
//         });
//         return await response.json();
//       } catch (error) {
//         console.error("Error updating category:", error);
//       }
//     };
  
//     const deleteCategory = async (id) => {
//       try {
//         const response = await fetch(`${apiUrl}/categories/${id}`, {
//           method: "DELETE",
//         });
//         return response.ok;
//       } catch (error) {
//         console.error("Error deleting category:", error);
//       }
//     };
  
//     return { getCategories, createCategory, updateCategory, deleteCategory };
//   }
  

export default function useApi() {
  const apiUrl = "http://127.0.0.1:8000/api";

  // Ambil semua kategori
  const getCategories = async () => {
      try {
          const response = await fetch(`${apiUrl}/categories`);
          return await response.json();
      } catch (error) {
          console.error("Error fetching categories:", error);
          return null; // Tambahkan return null jika terjadi error
      }
  };

  // Ambil satu kategori berdasarkan ID
  const getCategoryById = async (id) => {
      try {
          const response = await fetch(`${apiUrl}/categories/${id}`);
          if (!response.ok) throw new Error("Gagal mengambil data kategori");

          return await response.json();
      } catch (error) {
          console.error(`Error fetching category with ID ${id}:`, error);
          return null;
      }
  };

  const createCategory = async (data) => {
      try {
          const response = await fetch(`${apiUrl}/categories`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(data),
          });
          return await response.json();
      } catch (error) {
          console.error("Error creating category:", error);
      }
  };

  const updateCategory = async (id, data) => {
      try {
          const response = await fetch(`${apiUrl}/categories/${id}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(data),
          });
          return await response.json();
      } catch (error) {
          console.error("Error updating category:", error);
      }
  };

  const deleteCategory = async (id) => {
      try {
          const response = await fetch(`${apiUrl}/categories/${id}`, {
              method: "DELETE",
          });
          return response.ok;
      } catch (error) {
          console.error("Error deleting category:", error);
      }
  };

  return { getCategories, getCategoryById, createCategory, updateCategory, deleteCategory };
}
