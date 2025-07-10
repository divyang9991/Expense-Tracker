import React, { useState } from "react";
import useMoneyStore from "../store/MoneyStore";
import BarGraph from "./BarGraph.jsx";
import MoneyList from "./MoneyList.jsx";
import { useEffect } from "react";
import Navbar from "./Navbar.jsx";
import SideBar from "./SideBar.jsx";
import { Plus } from "lucide-react";
import AddMoney from "./AddMoney.jsx";

const Expense = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const { expense } = useMoneyStore();
  const getExpense = useMoneyStore((state) => state.getExpense);
  useEffect(() => {
    (async () => {
      await getExpense();
    })();
  }, [expense, getExpense]);

  return (
    <>
      <Navbar />
      <SideBar />
      <div>
        <div className="grid relative grid-cols-1 grid-rows-1 pl-84 pr-4 pt-25 pb-15 gap-y-1.5 bg-gray-100">
          <div className="col-span-1 pt-10 px-10 bg-white shadow-2xl rounded-xl flex flex-col">
            <div className="p-2 self-end">
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="rounded shadow-md bg-white text-red-700 px-6 py-1 border-red-800 border-2 flex flex-row cursor-pointer"
              >
                <Plus className="mr-2" /> Add Expense
              </button>
            </div>
            {showAddForm && (
              <div className="mb-4">
                <AddMoney title="expense" onSuccess={() => setShowAddForm(false)} />
              </div>
            )}
            <BarGraph list={expense} title="Expense" height="300" />
          </div>
          <div className="col-span-1 p-10 bg-white shadow-2xl rounded-xl">
            <MoneyList
              list={expense}
              title="Expense"
              isDelete="true"
              isAddButton="true"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Expense;
