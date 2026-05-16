import React, { useState, useEffect } from "react";
import useMoneyStore from "../store/MoneyStore";
import BarGraph from "./BarGraph.jsx";
import MoneyList from "./MoneyList.jsx";
import Navbar from "./Navbar.jsx";
import SideBar from "./SideBar.jsx";
import { Plus } from "lucide-react";
import AddMoney from "./AddMoney.jsx";
import { Skeleton } from "@mui/material";

const Expense = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const { expense, loading } = useMoneyStore();
  const getExpense = useMoneyStore((state) => state.getExpense);

  useEffect(() => {
    getExpense();
  }, []);

  return (
    <>
      <Navbar />
      <SideBar />
      <div className="pl-0 lg:pl-80 pr-4 pt-20 pb-15 bg-gray-100 min-h-screen">
        <div className="grid grid-cols-1 gap-4 px-4 pt-5">

          <div className="col-span-1 pt-6 px-4 sm:px-10 bg-white shadow-2xl rounded-xl flex flex-col">
            <div className="p-2 self-end">
              <button
                onClick={() => setShowAddForm(true)}
                className="rounded shadow-xl bg-white font-extrabold text-red-500 px-4 py-1 border-red-500 border-2 flex items-center gap-1 cursor-pointer hover:bg-red-50"
              >
                <Plus size={16} /> Add Expense
              </button>
            </div>

            {showAddForm && (
              <AddMoney
                title="expense"
                onSuccess={() => setShowAddForm(false)}
                onClose={() => setShowAddForm(false)}
              />
            )}

            <div style={{ height: 350 }}>
              {loading ? (
                <Skeleton variant="rectangular" width="100%" height="90%" animation="wave" />
              ) : (
                <BarGraph list={expense} title="Expense" height="300" />
              )}
            </div>
          </div>

          <div className="col-span-1 p-4 sm:p-10 bg-white shadow-2xl rounded-xl">
            <MoneyList
              list={expense}
              title="Expense"
              isDelete="true"
              isAddButton="true"
              loading={loading}
            />
          </div>

        </div>
      </div>
    </>
  );
};

export default Expense;