import { create } from "zustand";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";

const useBorrowingStore = create((set, get) => ({
  borrowings: [],
  history: [],

  loading: false,
  historyLoading: false,
  error: null,

  // =========================
  // ➤ Get Borrowings (Grouped)
  // =========================
  getBorrowings: async () => {
    set({ loading: true });
    try {
      const data = await axiosInstance
        .get("/borrowings/")
        .then((res) => res.data)
        .catch((err) => {
          set({ error: err.message });
        });

      if (data) {
        set({ borrowings: data });
      }
    } catch (error) {
      console.log("error fetching borrowings", error.message);
    } finally {
      set({ loading: false });
    }
  },

  // =========================
  // ➤ Add Borrowing
  // =========================
  addBorrowing: async (formData) => {
    try {
      const res = await axiosInstance.post("/borrowings/add", formData);

      if (res) {
        toast.success("Borrowing added successfully");

        // 🔥 Instead of full refetch → just update UI quickly
        get().getBorrowings();
      }
    } catch (error) {
      console.log("error adding borrowing", error.message);
      toast.error("Error adding borrowing");
    }
  },

  // =========================
  // ➤ Get History
  // =========================
  getHistory: async (email) => {
    set({ historyLoading: true });

    try {
      const data = await axiosInstance
        .get(`/borrowings/history/${email}`)
        .then((res) => res.data)
        .catch((err) => {
          set({ error: err.message });
        });

      if (data) {
        set({ history: data });
      }
    } catch (error) {
      console.log("error fetching history", error.message);
    } finally {
      set({ historyLoading: false });
    }
  },

  // =========================
  // ➤ Settlement
  // =========================
  settleBorrowing: async (personEmail, amount) => {
    try {
      const res = await axiosInstance.post("/borrowings/settle", {
        personEmail,
        amount,
      });

      if (res) {
        toast.success("Settlement successful");

        // refresh both
        get().getBorrowings();
        get().getHistory(personEmail);
      }
    } catch (error) {
      console.log("error in settlement", error.message);
      toast.error("Settlement failed");
    }
  },

  // =========================
  // ➤ Update Borrowing
  // =========================
  updateBorrowing: async (id, formData, personEmail) => {
    try {
      const res = await axiosInstance.put(
        `/borrowings/update/${id}`,
        formData
      );

      if (res) {
        toast.success("Updated successfully");

        get().getBorrowings();
        if (personEmail) get().getHistory(personEmail);
      }
    } catch (error) {
      console.log("error updating borrowing", error.message);
      toast.error("Update failed");
    }
  },

  // =========================
  // ➤ Delete Borrowing
  // =========================
  deleteBorrowing: async (id, personEmail) => {
    try {
      const res = await axiosInstance.delete(
        `/borrowings/delete/${id}`
      );

      if (res) {
        toast.success("Deleted successfully");

        get().getBorrowings();
        if (personEmail) get().getHistory(personEmail);
      }
    } catch (error) {
      console.log("error deleting borrowing", error.message);
      toast.error("Delete failed");
    }
  },

  // =========================
  // ➤ Clear History
  // =========================
  clearHistory: () => set({ history: [] }),
}));

export default useBorrowingStore;