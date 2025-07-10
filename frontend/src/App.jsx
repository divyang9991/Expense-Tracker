import "./App.css";
import "./index.css";
import { BadgeIndianRupee,WalletMinimal,HandCoins,IndianRupee} from "lucide-react";
import useMoneyStore from "./store/MoneyStore";
import { useEffect, useState } from "react";
import PieChartBalance from "./components/PieChartBalance";
import MoneyList from "./components/MoneyList";
import BarGraph from "./components/BarGraph";
import Navbar from "./components/Navbar";
import SideBar from "./components/SideBar";


function App() {
  const getExpense=useMoneyStore(state=>state.getExpense);
  const getIncome=useMoneyStore(state=>state.getIncome);
  const getName=useMoneyStore(state=>state.getName);  
  const getRecent=useMoneyStore(state=>state.getRecent);
  useEffect(() => {
      (async () => {
      await getIncome();
      await getExpense();
      await getName();
      await getRecent();
    })();
  },[getExpense,getIncome,getName,getRecent]);

    const {spent,earned,recent}=useMoneyStore();
    const [balance,setBalance]=useState(0);

     useEffect(()=>{
      console.log(spent);
      console.log(earned);
      setBalance(earned-spent);
     },[spent,earned]);

     const now = new Date();
const thirtyDaysAgo = new Date();
thirtyDaysAgo.setDate(now.getDate() - 30);

// Filter last 30 days only
const last30Days = recent.filter(txn => {
  const txnDate = new Date(txn.date);
  return txnDate >= thirtyDaysAgo && txnDate <= now;
});

// Separate into income and expense
const incomeList = last30Days.filter(txn => txn.expenseType === "income");
const expenseList = last30Days.filter(txn => txn.expenseType === "expense");

  return (
    <>
    <Navbar/>
      <SideBar/>
    <div>
      <div className="relative grid grid-rows-11 grid-cols-6 gap-6 pl-84 pr-5 pt-24 pb-15 bg-gray-100 overflow-hidden h-max">
        <div className="bg-white rounded-xl shadow-md col-span-2">
          <div className="flex justify-around items-center py-4">
            <div className="rounded-full h-10 w-10 bg-pink-600 flex items-center shadow-2xl">
              <BadgeIndianRupee color="white" className="relative left-2" />
            </div>
            <h4 className="text-gray-600 font-medium text-xl">Balance</h4>
            <h4 className="text-blue-900 font-extrabold text-xl flex flex-row items-center"><IndianRupee />{balance}</h4>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md col-span-2">
          <div className="flex justify-around items-center py-4">
            <div className="rounded-full h-10 w-10 bg-violet-800 flex items-center shadow-2xl">
              <WalletMinimal color="white" className="relative left-2" />
            </div>
            <h4 className="text-gray-600 font-medium text-xl">Income</h4>
            <h4 className="text-blue-900 font-extrabold text-xl flex flex-row items-center"><IndianRupee />{earned}</h4>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md col-span-2">
          <div className="flex justify-around items-center py-4">
            <div className="rounded-full h-10 w-10 bg-cyan-800 flex items-center shadow-2xl">
              <HandCoins color="white" className="relative left-2" />
            </div>
            <h4 className="text-gray-600 font-medium text-xl">Expense</h4>
            <h4 className="text-blue-900 font-extrabold text-xl flex flex-row items-center"><IndianRupee />{spent}</h4>
          </div>
        </div>

        <div className="col-span-3 row-span-9">
          <div className="bg-white p-6 rounded-2xl shadow-md w-full h-210 overflow-hidden"><MoneyList list={recent} title="Recent Transaction"/></div>
        </div>
        <div className="col-span-3 row-span-3">
          <div className="bg-white p-6 rounded-2xl shadow-md w-full h-64 overflow-hidden"><PieChartBalance income={earned} expense={spent} /></div>
        </div>
        <div className="col-span-3 row-span-3">
          <div className="bg-white rounded-2xl p-2 shadow-md h-65 overflow-hidden"><BarGraph list={incomeList} title="Last 30 Days Income" height="230"/></div>
        </div>
        <div className="col-span-3 row-span-3">
          <div className="bg-white rounded-2xl p-2 shadow-md h-65 overflow-hidden"><BarGraph list={expenseList} title="Last 30 Days Expense" height="230"/></div>
        </div>
      </div>
      </div>
    </>
  );
}

export default App;
