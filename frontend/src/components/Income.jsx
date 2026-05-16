import React, { useState, useEffect } from "react";
import BarGraph from "./BarGraph.jsx";
import useMoneyStore from "../store/MoneyStore.js";
import MoneyList from "./MoneyList.jsx";
import Navbar from "./Navbar.jsx";
import SideBar from "./SideBar.jsx";
import { Plus } from "lucide-react";
import AddMoney from "./AddMoney.jsx";
import { Skeleton } from "@mui/material";

const Income = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const { income, loading } = useMoneyStore();
  const getIncome = useMoneyStore((state) => state.getIncome);

  useEffect(() => {
    getIncome();
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
                onClick={() => setShowAddForm(!showAddForm)}
                className="rounded shadow-xl bg-white font-extrabold text-green-600 px-4 py-1 border-green-600 border-2 flex items-center gap-1 cursor-pointer hover:bg-green-50"
              >
                <Plus size={16} /> Add Income
              </button>
            </div>

            {showAddForm && (
              <div className="mb-4">
                <AddMoney
                  title="income"
                  onSuccess={() => setShowAddForm(false)}
                  onClose={() => setShowAddForm(false)}
                />
              </div>
            )}

            <div style={{ height: 350 }}>
              {loading ? (
                <Skeleton variant="rectangular" width="100%" height="100%" animation="wave" />
              ) : (
                <BarGraph list={income} title="Income" height={300} />
              )}
            </div>
          </div>

          <div className="col-span-1 p-4 sm:p-10 bg-white shadow-2xl rounded-xl">
            <MoneyList
              list={income}
              title="Income"
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

export default Income;