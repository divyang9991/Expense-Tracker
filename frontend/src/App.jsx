import "./App.css";
import "./index.css";
import { BadgeIndianRupee, WalletMinimal, HandCoins, IndianRupee } from "lucide-react";
import useMoneyStore from "./store/MoneyStore";
import { useEffect, useState } from "react";
import PieChartBalance from "./components/PieChartBalance";
import MoneyList from "./components/MoneyList";
import BarGraph from "./components/BarGraph";
import Navbar from "./components/Navbar";
import SideBar from "./components/SideBar";
import PlaidLink from "./components/PlaidLink";

function App() {
  const getExpense = useMoneyStore(state => state.getExpense);
  const getIncome  = useMoneyStore(state => state.getIncome);
  const getName    = useMoneyStore(state => state.getName);
  const getRecent  = useMoneyStore(state => state.getRecent);
  const { loading, spent, earned, recent } = useMoneyStore();

  const [balance, setBalance] = useState(0);

  useEffect(() => {
    (async () => {
      await getIncome();
      await getExpense();
      await getName();
      await getRecent();
    })();
  }, [getExpense, getIncome, getName, getRecent]);

  useEffect(() => {
    setBalance(earned - spent);
  }, [spent, earned]);

  const now = new Date();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(now.getDate() - 30);

  const last30Days  = recent.filter(txn => {
    const txnDate = new Date(txn.date);
    return txnDate >= thirtyDaysAgo && txnDate <= now;
  });

  const formatAmount = (num) => Number(num).toFixed(2);

  const incomeList  = last30Days.filter(txn => txn.expenseType === "income");
  const expenseList = last30Days.filter(txn => txn.expenseType === "expense");

  return (
    <>
      <Navbar />
      <SideBar />

      <div className="pl-0 lg:pl-80 pr-4 pt-20 pb-15 bg-gray-100 min-h-screen">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 px-4">

          {/* ── Stat cards ── */}
          <div className="bg-white rounded-xl shadow-md sm:col-span-1 lg:col-span-2">
            <div className="flex justify-around items-center py-4">
              <div className="rounded-full h-10 w-10 bg-green-600 flex items-center justify-center shadow-2xl">
                <WalletMinimal color="white" size={18} />
              </div>
              <h4 className="text-gray-600 font-medium text-xl">Income</h4>
              <h4 className="text-blue-900 font-extrabold text-xl flex items-center">
                <IndianRupee size={18} />{formatAmount(earned)}
              </h4>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md sm:col-span-1 lg:col-span-2">
            <div className="flex justify-around items-center py-4">
              <div className="rounded-full h-10 w-10 bg-red-500 flex items-center justify-center shadow-2xl">
                <HandCoins color="white" size={18} />
              </div>
              <h4 className="text-gray-600 font-medium text-xl">Expense</h4>
              <h4 className="text-blue-900 font-extrabold text-xl flex items-center">
                <IndianRupee size={18} />{formatAmount(spent)}
              </h4>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md sm:col-span-2 lg:col-span-2">
            <div className="flex justify-around items-center py-4">
              <div className="rounded-full h-10 w-10 bg-blue-900 flex items-center justify-center shadow-2xl">
                <BadgeIndianRupee color="white" size={18} />
              </div>
              <h4 className="text-gray-600 font-medium text-xl">Saving</h4>
              <h4 className="text-green-600 font-extrabold text-xl flex items-center">
                <IndianRupee size={18} />{formatAmount(balance)}
              </h4>
            </div>
          </div>

          {/* ── Plaid ── */}
          <div className="bg-white rounded-xl shadow-md col-span-1 sm:col-span-2 lg:col-span-6 flex justify-center items-center px-6 py-3">
            <PlaidLink />
          </div>

          {/* ── Recent transactions ── */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-3">
            <div className="bg-white p-6 rounded-2xl shadow-md w-full h-[400px] overflow-y-auto">
              <MoneyList list={recent} title="Recent Transaction" loading={loading} />
            </div>
          </div>

          {/* ── Pie chart ── */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-3">
            <div className="bg-white p-6 rounded-2xl shadow-md w-full h-[350px] flex justify-center items-center min-h-[280px]">
              <PieChartBalance income={earned} expense={spent} />
            </div>
          </div>

          {/* ── Bar charts ── */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-3">
            <div className="bg-white rounded-2xl px-4 pt-7 shadow-md h-[260px] flex flex-col">
              <BarGraph list={incomeList} title="Last 30 Days Income" height="230" />
            </div>
          </div>

          <div className="col-span-1 sm:col-span-2 lg:col-span-3">
            <div className="bg-white rounded-2xl px-4 pt-7 shadow-md h-[260px] flex flex-col">
              <BarGraph list={expenseList} title="Last 30 Days Expense" height="230" />
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

export default App;