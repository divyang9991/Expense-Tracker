import React, { useState, useEffect } from "react";
import BarGraph from "./BarGraph.jsx";
import useMoneyStore from "../store/MoneyStore.js";
import MoneyList from "./MoneyList.jsx";
import Navbar from "./Navbar.jsx";
import SideBar from "./SideBar.jsx";
import { Plus } from "lucide-react";
import AddMoney from "./AddMoney.jsx";

const Income = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const { income } = useMoneyStore();
  const getIncome = useMoneyStore((state) => state.getIncome);

  useEffect(() => {
    (async () => {
      await getIncome();
    })();
  }, [income, getIncome]);

  return (
    <>
      <Navbar />
      <SideBar />
      <div className="grid relative grid-cols-1 grid-rows-1 pl-84 pr-4 pt-25 pb-15 gap-y-1.5 bg-gray-100">
        <div className="col-span-1 pt-10 px-10 bg-white shadow-2xl rounded-xl flex flex-col">
          <div className="p-2 self-end">
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="rounded shadow-md bg-white text-green-700 px-6 py-1 border-green-800 border-2 flex flex-row cursor-pointer"
            >
              <Plus className="mr-2" /> Add Income
            </button>
          </div>

          {/* Conditional form rendering */}
          {showAddForm && (
            <div className="mb-4">
              <AddMoney title="income" onSuccess={() => setShowAddForm(false)} />
            </div>
          )}

          <BarGraph list={income} title="Income" height="300" className="z-20"  />
        </div>

        <div className="col-span-1 p-10 bg-white shadow-2xl rounded-xl">
          <MoneyList list={income} title="Income" isDelete="true" isAddButton="true" />
        </div>
      </div>
    </>
  );
};

export default Income;
