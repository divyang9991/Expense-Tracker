import React from "react";
import { Trash2, TrendingDown, TrendingUp } from "lucide-react";
import { IndianRupee ,Download} from "lucide-react";
import useMoneyStore from "../store/MoneyStore";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const MoneyList = ({ list, title ,isDelete,isAddButton}) => {

   const {handleIncomeDelete,handleExpenseDelete,expense,income}=useMoneyStore();

   

const downloadExcel = (jsonData) => {
  // 1. Convert JSON to worksheet
  const filteredData = jsonData.map(({ amount,category,date}) => ({ amount,category,date}));

  const worksheet = XLSX.utils.json_to_sheet(filteredData);

  // 2. Create a workbook and add the worksheet
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Data");

  // 3. Generate Excel file buffer
  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  // 4. Save it as a .xlsx file
  const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
  saveAs(blob, "data.xlsx");
};


  return (
    <div>
      <div className="flex flex-row justify-between items-top ">
         <h1 className="text-dark font-bold text-2xl text-blue-950 pb-5 underline">{`List of All ${title}`}</h1>
         {isAddButton==="true"?<button className="rounded shadow-4xl bg-blue-700 px-5 py-2  mb-3 flex flex-row gap-x-1 items-center text-white hover:bg-blue-900 cursor-pointer" onClick={()=>title==="Income"?downloadExcel(income):downloadExcel(expense)}><Download/>Download Sheet</button>:''}
      </div>
      {list.map((ele) => (
        <div
          key={ele._id}
          className="flex items-center justify-between rounded-2xl shadow p-5 hover:shadow-xl mb-2"
        >
          <div className="text-gray-800 font-bold text-2xl ">{ele.category}<h6 className="text-gray-500 text-xs">at {ele.date.split("T")[0]}</h6></div>
          <div className="flex flex-row gap-x-5">
            <div className={`w-full ${ele.expenseType==="income"?"bg-green-300":"bg-red-300"} rounded-xl self-center p-1`}>
            <div className="text-blue-950 font-bold flex flex-row justify-around items-center text-xl"><IndianRupee/>{ele.amount}{ele.expenseType==="income"?<TrendingUp/>:<TrendingDown/>}</div>
            </div>
            {isDelete==="true" ? <Trash2 color="gray" className="w-10 h-10 hover:shadow cursor-pointer" onClick={()=>ele.expenseType==="income"?handleIncomeDelete(ele._id):handleExpenseDelete(ele._id)}/> :''}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MoneyList;
