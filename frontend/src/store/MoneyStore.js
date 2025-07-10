import { create } from "zustand";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";

const useMoneyStore = create((set, get) => ({
  spent: 0,
  earned: 0,
  expense: [],
  income: [],
  recent: [],
  isGettingIncome: false,
  isGettingExpense: false,
  isGettingSpent: false,
  isGettingEarned: false,
  error: null,
  name: "",

  getExpense: async () => {
    set({ isGettingExpense: true });
    set({ isGettingSpent: true });
    const expenses = await axiosInstance
      .get("/money/expense")
      .then((res) => res.data)
      .catch((err) => {
        set({ error: err.message, spent: 0 });
      });
    if (expenses) {
      const moneySpent = expenses.reduce((sum, item) => sum + item.amount, 0);
      set({ expense: expenses });
      set({ spent: moneySpent });
    }
    set({ isGettingSpent: false });
    set({ isGettingExpense: false });
  },

  getIncome: async () => {
    set({ isGettingEarned: true, isGettingIncome: true });
    const incomes = await axiosInstance
      .get("/money/income")
      .then((res) => res.data)
      .catch((err) => {
        set({ error: err.message, earned: 0 });
      });
    if (incomes) {
      const moneyEarned = incomes.reduce((sum, item) => sum + item.amount, 0);
      set({ income: incomes, earned: moneyEarned });
    }
    set({ isGettingEarned: false, isGettingIncome: false });
  },

  getName: async () => {
    const name = await axiosInstance
      .get("/auth/user")
      .then((res) => res.data)
      .catch((err) => {
        set({ error: err.message, name: "User" });
      });
    if (name) {
      set({ name: name.fullName });
    } else {
      console.log("error in getting name");
    }
  },

  getRecent: async () => {
    const recent = await axiosInstance
      .get("/money/recent")
      .then((res) => res.data)
      .catch((err) => {
        console.log("error is ", err.message);
      });
    set({ recent: recent });
  },

  handleIncomeDelete: async (moneyId) => {
    try {
      const income = get().earned;
      const spent_temp = get().spent;
      const curr_amount = await axiosInstance.get(`/money/${moneyId}`);
      console.log(curr_amount.data.amount);
      if (income - curr_amount.data.amount < spent_temp) {
        console.log("cant delete beyond income");
        toast.error("Total Income cant be less than expense");
        return;
      } else {
        const res = await axiosInstance
          .delete(`/money/income/delete/${moneyId}`)
          .then((res) => res.data)
          .catch((err) => {
            console.log("error deleting the entry", err.message);
            toast.error("Error Deleting Income");
          });
        if (res) {
          set((state) => ({
            income: state.income.filter((item) => item._id !== moneyId),
          }));
          toast.success("Successfully deleted");
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  },

  handleExpenseDelete: async (moneyId) => {
    const res = await axiosInstance
      .delete(`/money/expense/delete/${moneyId}`)
      .then((res) => res.data)
      .catch((err) => {
        console.log("error deleting the entry", err.message);
        toast.error("Error Deleting Expense");
      });
    if (res) {
      set((state) => ({
        expense: state.expense.filter((item) => item._id !== moneyId),
      }));
      toast.success("Successfully deleted");
    }
  },

  addMoney: async (data) => {
    try {
      const res = await axiosInstance.post("/money/income/add", data);
      if (res) {
        set((state) => ({ income: [...state.income, res.data] }));
        console.log("entered successfully", res.data);
        toast.success("Income Added successfully");
      }
    } catch (error) {
      console.log("error adding money", error.message);
      toast.error("Error Adding Income");
    }
  },

  addExpense: async (data) => {
    try {
      const income = get().earned;
      const spent_temp = get().spent;
      const curr_amount = data.amount;
      if (income - curr_amount < spent_temp) {
        console.log("cant delete beyond income");
        toast.error("Total Income cant be less than expense");
      } else {
        const res = await axiosInstance.post("/money/expense/add", data);
        if (res) {
          set((state) => ({ expense: [...state.expense, res.data] }));
          console.log("entered expense successfully");
          toast.success("Expense Added successfully");
        }
      }
    } catch (error) {
      console.log("error adding expense", error.message);
      toast.error("Error Adding Expense");
    }
  },
}));

export default useMoneyStore;
