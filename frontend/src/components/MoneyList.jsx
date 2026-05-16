import React from "react";
import { Trash2, TrendingDown, TrendingUp, Download } from "lucide-react";
import { IndianRupee } from "lucide-react";
import useMoneyStore from "../store/MoneyStore";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { Skeleton } from "@mui/material";

const MoneyList = ({ list, title, isDelete, isAddButton, loading }) => {

  const { handleIncomeDelete, handleExpenseDelete, expense, income } = useMoneyStore();

  const downloadExcel = (jsonData) => {
    const filteredData = jsonData.map(({ amount, category, date }) => ({ amount, category, date }));
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Income Expense Data Sheet");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "data.xlsx");
  };

  return (
    <div>
      <div className="flex flex-row justify-between items-center pb-5">
        <h1 className="text-blue-900 font-bold text-lg">{`List of All ${title}`}</h1>
        {isAddButton === "true" && (
          <button
            className="rounded shadow-xl bg-white font-extrabold text-blue-900 px-4 py-1 border-blue-900 border-2 flex items-center gap-1 cursor-pointer hover:bg-blue-50 text-sm"
            onClick={() => title === "Income" ? downloadExcel(income) : downloadExcel(expense)}
          >
            <Download size={15} /> Download Sheet
          </button>
        )}
      </div>

      <div className="flex flex-col gap-3">
        {loading ? (
          [1, 2, 3].map((i) => (
            <Skeleton key={i} variant="rectangular" height={64} animation="wave" style={{ borderRadius: 12 }} />
          ))
        ) : list.map((ele) => (
          <div
            key={ele._id}
            className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 p-4 border-2 border-gray-100 rounded-xl hover:border-blue-200 hover:shadow-sm transition-all"
          >
            {/* ── Row 1: badge + amount + category + trend + date ── */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="shrink-0">
                {ele.expenseType === "income" ? (
                  <span className="text-xs bg-green-50 text-green-700 border border-green-200 rounded-full px-3 py-1">Income</span>
                ) : (
                  <span className="text-xs bg-red-50 text-red-600 border border-red-200 rounded-full px-3 py-1">Expense</span>
                )}
              </div>

              <p className={`font-extrabold flex items-center shrink-0 ${ele.expenseType === "income" ? "text-green-600" : "text-red-500"}`}>
                <IndianRupee size={14} />{ele.amount}
              </p>

              <p className="flex-1 text-sm text-gray-500 truncate">{ele.category}</p>

              <div className="shrink-0">
                {ele.expenseType === "income"
                  ? <TrendingUp size={18} className="text-green-500" />
                  : <TrendingDown size={18} className="text-red-400" />}
              </div>

              <p className="text-xs text-gray-400 shrink-0">{ele.date.split("T")[0]}</p>
            </div>

            {/* ── Row 2 on mobile / inline on desktop: delete ── */}
            {isDelete === "true" && (
              <button
                className="self-end sm:self-auto p-1.5 border-2 border-red-500 text-red-500 rounded hover:bg-red-50 shrink-0"
                onClick={() => ele.expenseType === "income" ? handleIncomeDelete(ele._id) : handleExpenseDelete(ele._id)}
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MoneyList;