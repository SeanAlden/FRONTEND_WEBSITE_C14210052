<template>
  <div class="max-w-5xl p-6 mx-auto">
    <h1 class="flex items-center gap-2 mb-6 text-3xl font-bold text-gray-800">
      <span class="inline-block p-2 text-blue-600 bg-blue-100 rounded-full"> 🔔 </span>
      Notifikasi
    </h1>

    <div v-if="loading" class="text-center text-gray-600">Memuat notifikasi...</div>

    <div v-else-if="notifications.length === 0" class="text-center text-gray-500">
      Tidak ada notifikasi saat ini.
    </div>

    <transition-group name="fade" tag="ul" class="space-y-4">
      <!-- <li
        v-for="notif in notifications"
        :key="notif.id"
        class="p-5 transition bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg"
      >
        <p class="font-medium text-gray-900">{{ notif.message }}</p>
        <div class="flex items-center justify-between mt-2 text-sm text-gray-500">
          <span>{{ formatDate(notif.notification_time) }}</span>
          <span :class="badgeClass(notif.notification_type)">
            {{ notif.notification_type }}
          </span>
        </div>
      </li> -->
      <li
        v-for="notif in notifications"
        :key="notif.id"
        class="p-5 transition bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg"
      >
        <!-- <li
        v-for="(notif: Notification) in notifications"
        :key="notif.id"
        class="p-5 transition bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg"
      > -->
        <div class="flex items-start justify-between">
          <p class="font-medium text-gray-900">{{ notif.message }}</p>
          <button
            @click="deleteNotification(notif.id)"
            class="text-sm text-red-500 hover:text-red-700"
            title="Hapus notifikasi"
          >
            🗑️
          </button>
        </div>

        <div class="flex items-center justify-between mt-2 text-sm text-gray-500">
          <span>{{ formatDate(notif.notification_time) }}</span>
          <span :class="badgeClass(notif.notification_type)">
            {{ notif.notification_type }}
          </span>
        </div>
      </li>
    </transition-group>
  </div>
</template>

<script setup lang="ts">
// import { ref, onMounted } from "vue";

definePageMeta({
  middleware: ["auth"],
});

interface Notification {
  id: number;
  message: string;
  notification_time: string;
  notification_type: string;
  created_at?: string;
  updated_at?: string;
}

const notifications = ref<Notification[]>([]);
const loading = ref(true);

onMounted(async () => {
  try {
    const res = await fetch(useApi("/api/notifications"));
    const data = await res.json();
    notifications.value = data;
  } catch (error) {
    console.error("Gagal memuat notifikasi:", error);
  } finally {
    loading.value = false;
  }
});

// const formatDate = (datetime: string) => {
//   return new Date(datetime).toLocaleString("id-ID", {
//     dateStyle: "medium",
//     timeStyle: "short",
//   });
// };

const formatDate = (datetime: string) => {
  const date = new Date(datetime);
  date.setHours(date.getHours() + 7); // Tambahkan 7 jam
  return date.toLocaleString("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

const badgeClass = (type: string) => {
  switch (type.toLowerCase()) {
    case "info":
      return "bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs font-semibold";
    case "warning":
      return "bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full text-xs font-semibold";
    case "error":
      return "bg-red-100 text-red-700 px-2 py-0.5 rounded-full text-xs font-semibold";
    case "success":
      return "bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-semibold";
    default:
      return "bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-xs font-semibold";
  }
};

const deleteNotification = async (id: number) => {
  const confirmDelete = confirm("Yakin ingin menghapus notifikasi ini?");
  if (!confirmDelete) return;

  try {
    const res = await fetch(useApi(`/api/notifications/${id}`), {
      method: "PUT",
    });

    if (!res.ok) {
      throw new Error("Gagal menghapus notifikasi.");
    }

    // Hapus dari list lokal setelah berhasil dihapus di backend
    notifications.value = notifications.value.filter(
      (notif: Notification) => notif.id !== id
    );
  } catch (error) {
    console.error("Error saat menghapus notifikasi:", error);
    alert("Terjadi kesalahan saat menghapus notifikasi.");
  }
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
