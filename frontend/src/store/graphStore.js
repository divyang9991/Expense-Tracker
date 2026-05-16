import { create } from "zustand";
import axios from "axios";

export const useChartStore = create((set) => ({
  data: [],
  loading: true,
  error: null,

  fetchData: async () => {
  set({ loading: true, error: null });

  try {
    const res = await axios.get("/api/transactions");

    console.log("API RESPONSE:", res.data);

    const normalizedData =
      Array.isArray(res.data)
        ? res.data
        : res.data.transactions || res.data.data || [];

    set({ data: normalizedData, loading: false });
  } catch (err) {
    set({ error: err.message, loading: false });
  }
}
}));