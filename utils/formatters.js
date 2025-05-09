// utils/formatters.js

export function formatCurrency(value) {
    if (typeof value !== "number") return "-";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(value);
  }
  
  export function formatDate(date) {
    if (!date) return "-";
    const d = new Date(date);
    return d.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  }
  