import { useState } from "react";
import { IndianRupee, X, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import useMoneyStore from "../store/MoneyStore";

const today = () => new Date().toISOString().split("T")[0];

const INIT = { amount: "", category: "", date: today() };

const Field = ({ label, children }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">{label}</label>
    {children}
  </div>
);

const inputCls =
  "w-full bg-gray-50 border-2 border-gray-200 focus:border-blue-900 outline-none rounded-lg px-3 py-2.5 text-sm text-gray-800 transition-colors placeholder:text-gray-300";

export default function AddMoney({ title, onSuccess, onClose }) {
  const [form, setForm]       = useState(INIT);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const { addMoney, addExpense } = useMoneyStore();

  const isIncome = title === "income";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const payload = { ...form, amount: Number(form.amount), date: new Date(form.date) };
      if (isIncome) await addMoney(payload);
      else          await addExpense(payload);
      setForm(INIT);
      if (onSuccess) onSuccess();
    } catch {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="relative w-[420px] bg-white rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header ── */}
        <div className={`px-7 pt-6 pb-5 ${isIncome ? "bg-green-600" : "bg-red-500"}`}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-white/70 text-xs font-semibold uppercase tracking-widest mb-1">
                New Entry
              </p>
              <h2 className="text-white font-bold text-xl flex items-center gap-2">
                {isIncome
                  ? <><ArrowUpRight size={20} /> Add Income</>
                  : <><ArrowDownLeft size={20} /> Add Expense</>}
              </h2>
            </div>
            <button type="button" onClick={onClose} className="text-white/70 hover:text-white transition-colors mt-0.5">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* ── Form ── */}
        <form onSubmit={handleSubmit} className="px-7 py-6 flex flex-col gap-4">

          <Field label="Amount">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <IndianRupee size={15} />
              </span>
              <input
                type="text" inputMode="numeric" pattern="[0-9]*"
                className={`${inputCls} pl-8 text-lg font-bold`}
                placeholder="0"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                required
              />
            </div>
          </Field>

          <Field label="Category">
            <input
              type="text"
              className={inputCls}
              placeholder={isIncome ? "Salary, Freelance..." : "Rent, Food..."}
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              required
            />
          </Field>

          <Field label="Date">
            <input
              type="date"
              className={inputCls}
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              required
            />
          </Field>

          {error && (
            <p className="text-red-500 text-xs font-medium bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit" disabled={loading}
            className={`w-full py-3 rounded-xl font-bold text-white text-sm transition-all disabled:opacity-60 ${
              isIncome ? "bg-green-600 hover:bg-green-700" : "bg-red-500 hover:bg-red-600"
            }`}
          >
            {loading ? "Saving..." : `Add ${isIncome ? "Income" : "Expense"} Entry`}
          </button>
        </form>
      </div>
    </div>
  );
}