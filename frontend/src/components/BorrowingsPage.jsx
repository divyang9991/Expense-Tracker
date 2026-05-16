import { useEffect, useState } from "react";
import {
  HandCoins, IndianRupee, Plus, TrendingUp, TrendingDown,
  Clock, Users, ArrowUpRight, ArrowDownLeft, X,
} from "lucide-react";
import { BarChart } from "@mui/x-charts/BarChart";
import useBorrowingStore from "../store/useBorrowingStore";
import BorrowingHistoryPage from "./BorrowingHistoryPage";
import Navbar from "./Navbar";
import SideBar from "./SideBar";
import { Skeleton } from "@mui/material";

const fmt = (n) => Number(Math.abs(n)).toFixed(2);
const today = () => new Date().toISOString().split("T")[0];

const INIT = {
  personName: "", personEmail: "", type: "GIVEN",
  amount: "", note: "", date: today(),
};

const Field = ({ label, children }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">{label}</label>
    {children}
  </div>
);

const inputCls =
  "w-full bg-gray-50 border-2 border-gray-200 focus:border-blue-900 outline-none rounded-lg px-3 py-2.5 text-sm text-gray-800 transition-colors placeholder:text-gray-300";

// ── Custom tooltip for the borrowing charts ──
const BorrowTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const { name, amount } = payload[0].payload;
  return (
    <div className="bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-lg text-xs">
      <p className="font-bold text-blue-900 mb-0.5">{name}</p>
      <p className="text-gray-600 flex items-center gap-0.5">
        <span>₹</span>{Number(amount).toFixed(2)}
      </p>
    </div>
  );
};

// ── Per-person horizontal bar chart ──
function PersonBarChart({ data, color, emptyMsg }) {
  if (!data.length) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-300 gap-2">
        <HandCoins size={32} className="opacity-40" />
        <p className="text-xs">{emptyMsg}</p>
      </div>
    );
  }

  return (
    <BarChart
      dataset={data}
      yAxis={[{ scaleType: "band", dataKey: "name" }]}
      series={[{ dataKey: "amount", color, label: "Amount (₹)" }]}
      layout="horizontal"
      width={480}
      height={Math.max(180, data.length * 52 + 40)}
      margin={{ top: 8, right: 60, left: 100, bottom: 8 }}
      tooltip={{ trigger: "item" }}
      slotProps={{ legend: { hidden: true } }}
    />
  );
}

export default function BorrowingsPage() {
  const { borrowings, loading, getBorrowings, addBorrowing, settleBorrowing } =
    useBorrowingStore();

  const [selectedEmail, setSelectedEmail] = useState(null);
  const [showAdd, setShowAdd]             = useState(false);
  const [form, setForm]                   = useState(INIT);
  const [formErr, setFormErr]             = useState("");
  const [formLoading, setFormLoading]     = useState(false);
  const [settleTarget, setSettleTarget]   = useState(null);
  const [settleAmt, setSettleAmt]         = useState("");
  const [settleErr, setSettleErr]         = useState("");
  const [settleLoading, setSettleLoading] = useState(false);
  const [search, setSearch]               = useState("");
  const [filter, setFilter]               = useState("ALL");

  useEffect(() => { getBorrowings(); }, []);

  if (selectedEmail) {
    return <BorrowingHistoryPage email={selectedEmail} onBack={() => setSelectedEmail(null)} />;
  }

  const totalOwed = borrowings.filter(b => b.netBalance > 0).reduce((s, b) => s + b.netBalance, 0);
  const totalOwe  = borrowings.filter(b => b.netBalance < 0).reduce((s, b) => s + Math.abs(b.netBalance), 0);
  const net       = totalOwed - totalOwe;

  // Chart data: one bar per person, amount = absolute netBalance
  const owedToMeData = borrowings
    .filter(b => b.netBalance > 0)
    .map(b => ({ name: b.personName, amount: b.netBalance }))
    .sort((a, b) => b.amount - a.amount);

  const iOweData = borrowings
    .filter(b => b.netBalance < 0)
    .map(b => ({ name: b.personName, amount: Math.abs(b.netBalance) }))
    .sort((a, b) => b.amount - a.amount);

  // Dynamic chart height: min 180, grow with entries
  const owedChartH = Math.max(180, owedToMeData.length * 52 + 40);
  const oweChartH  = Math.max(180, iOweData.length  * 52 + 40);

  const visible = borrowings.filter(b => {
    const matchSearch =
      b.personName.toLowerCase().includes(search.toLowerCase()) ||
      b.personEmail.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === "ALL" ||
      (filter === "OWED" && b.netBalance > 0) ||
      (filter === "OWE"  && b.netBalance < 0);
    return matchSearch && matchFilter;
  });

  const handleAdd = async (e) => {
    e.preventDefault();
    setFormErr("");
    setFormLoading(true);
    try {
      await addBorrowing({ ...form, amount: Number(form.amount) });
      setForm(INIT);
      setShowAdd(false);
    } catch {
      setFormErr("Something went wrong.");
    } finally {
      setFormLoading(false);
    }
  };

  const handleSettle = async (e) => {
    e.preventDefault();
    setSettleErr("");
    if (!settleAmt || Number(settleAmt) <= 0) { setSettleErr("Enter a valid amount."); return; }
    setSettleLoading(true);
    try {
      await settleBorrowing(settleTarget.personEmail, Number(settleAmt));
      setSettleTarget(null);
      setSettleAmt("");
    } catch {
      setSettleErr("Settlement failed.");
    } finally {
      setSettleLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <SideBar />

      <div className="pl-0 lg:pl-80 pr-4 pt-20 pb-15 bg-gray-100 min-h-screen">
        <div className="grid grid-cols-1 gap-4 px-4 pt-5">

          {/* ── Stat Cards ── */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl shadow-md">
              <div className="flex justify-around items-center py-4">
                <div className="rounded-full h-10 w-10 bg-green-600 flex items-center justify-center shadow-2xl">
                  <TrendingUp color="white" size={18} />
                </div>
                <h4 className="text-gray-600 font-medium text-xl">Owed to Me</h4>
                <h4 className="text-blue-900 font-extrabold text-xl flex items-center">
                  <IndianRupee size={18} />{fmt(totalOwed)}
                </h4>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md">
              <div className="flex justify-around items-center py-4">
                <div className="rounded-full h-10 w-10 bg-red-500 flex items-center justify-center shadow-2xl">
                  <TrendingDown color="white" size={18} />
                </div>
                <h4 className="text-gray-600 font-medium text-xl">I Owe</h4>
                <h4 className="text-blue-900 font-extrabold text-xl flex items-center">
                  <IndianRupee size={18} />{fmt(totalOwe)}
                </h4>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md">
              <div className="flex justify-around items-center py-4">
                <div className="rounded-full h-10 w-10 bg-blue-900 flex items-center justify-center shadow-2xl">
                  <HandCoins color="white" size={18} />
                </div>
                <h4 className="text-gray-600 font-medium text-xl">Net Balance</h4>
                <h4 className={`font-extrabold text-xl flex items-center ${net >= 0 ? "text-green-600" : "text-red-500"}`}>
                  <IndianRupee size={18} />{fmt(net)}
                </h4>
              </div>
            </div>
          </div>

          {/* ── Charts ── */}
          <div className="pt-7 px-4 sm:px-10 pb-6 bg-white shadow-2xl rounded-xl flex flex-col">
            <h3 className="text-blue-900 font-bold text-base mb-1">Borrowing Overview</h3>
            <p className="text-xs text-gray-400 mb-5">Net balance per person</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">

              {/* Owed to Me */}
              <div className="flex flex-col">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-3 h-3 rounded-full bg-green-500 inline-block" />
                  <span className="text-sm font-semibold text-gray-700">Owed to Me</span>
                  <span className="ml-auto text-xs text-green-600 font-bold">+₹{fmt(totalOwed)}</span>
                </div>
                {loading ? (
                  <Skeleton variant="rectangular" width="100%" height={180} animation="wave" style={{ borderRadius: 8 }} />
                ) : (
                  <div style={{ height: owedChartH }}>
                    <PersonBarChart
                      data={owedToMeData}
                      color="#16a34a"
                      emptyMsg="No one owes you"
                    />
                  </div>
                )}
              </div>

              {/* I Owe */}
              <div className="flex flex-col">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-3 h-3 rounded-full bg-red-500 inline-block" />
                  <span className="text-sm font-semibold text-gray-700">I Owe</span>
                  <span className="ml-auto text-xs text-red-500 font-bold">-₹{fmt(totalOwe)}</span>
                </div>
                {loading ? (
                  <Skeleton variant="rectangular" width="100%" height={180} animation="wave" style={{ borderRadius: 8 }} />
                ) : (
                  <div style={{ height: oweChartH }}>
                    <PersonBarChart
                      data={iOweData}
                      color="#ef4444"
                      emptyMsg="You don't owe anyone"
                    />
                  </div>
                )}
              </div>

            </div>
          </div>

          {/* ── People list ── */}
          <div className="pt-6 px-4 sm:px-10 pb-8 bg-white shadow-2xl rounded-xl flex flex-col">

            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Users size={18} className="text-blue-900" />
                <h3 className="text-blue-900 font-bold text-lg">People</h3>
                <span className="text-xs bg-blue-100 text-blue-900 font-semibold px-2 py-0.5 rounded-full">
                  {borrowings.length}
                </span>
              </div>

              <div className="flex flex-wrap gap-2 items-center">
                {[["ALL","All"],["OWED","Owed to Me"],["OWE","I Owe"]].map(([val, label]) => (
                  <button key={val} onClick={() => setFilter(val)}
                    className={`px-3 py-1 rounded text-xs font-semibold border-2 transition-colors ${
                      filter === val
                        ? "bg-blue-900 border-blue-900 text-white"
                        : "border-blue-900 text-blue-900 bg-white hover:bg-blue-50"}`}>
                    {label}
                  </button>
                ))}

                <input
                  className="border-2 border-blue-900 rounded px-3 py-1 text-sm text-neutral-700 outline-none w-full sm:w-auto"
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />

                <button onClick={() => setShowAdd(true)}
                  className="rounded shadow-xl bg-white font-extrabold text-blue-900 px-4 py-1 border-blue-900 border-2 flex items-center gap-1 cursor-pointer hover:bg-blue-50">
                  <Plus size={16} /> Add Entry
                </button>
              </div>
            </div>

            {/* List */}
            <div className="mt-4">
              {loading ? (
                <div className="flex flex-col gap-3">
                  {[1,2,3].map(i => (
                    <Skeleton key={i} variant="rectangular" height={64} animation="wave" style={{ borderRadius: 12 }} />
                  ))}
                </div>
              ) : visible.length === 0 ? (
                <div className="text-center py-16 text-gray-400">
                  <HandCoins size={40} className="mx-auto mb-3 opacity-30" />
                  <p className="text-sm">No records found.</p>
                  <button onClick={() => setShowAdd(true)}
                    className="mt-4 px-5 py-2 bg-blue-900 text-white rounded hover:bg-blue-700 text-sm font-semibold">
                    Add First Entry
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {visible.map((b) => {
                    const isOwed  = b.netBalance > 0;
                    const isOwe   = b.netBalance < 0;
                    const settled = b.netBalance === 0;
                    return (
                      <div key={b.personEmail}
                        className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 p-4 border-2 border-gray-100 rounded-xl hover:border-blue-200 hover:shadow-sm transition-all cursor-pointer"
                        onClick={() => setSelectedEmail(b.personEmail)}>

                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0 ${isOwed ? "bg-green-500" : isOwe ? "bg-red-500" : "bg-gray-400"}`}>
                            {b.personName?.[0]?.toUpperCase() ?? "?"}
                          </div>

                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-blue-900 truncate">{b.personName}</p>
                            <p className="text-xs text-gray-400 truncate">{b.personEmail}</p>
                          </div>

                          {settled ? (
                            <span className="text-xs text-gray-400 border border-gray-200 rounded-full px-3 py-1 shrink-0">Settled</span>
                          ) : (
                            <div className="flex items-center gap-2 shrink-0">
                              <span className={`text-xs font-semibold border rounded-full px-3 py-1 ${isOwed ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-600 border-red-200"}`}>
                                {isOwed ? "owes you" : "you owe"}
                              </span>
                              <p className={`font-extrabold flex items-center ${isOwed ? "text-green-600" : "text-red-500"}`}>
                                <IndianRupee size={14} />{fmt(b.netBalance)}
                              </p>
                            </div>
                          )}
                        </div>

                        <div className="flex gap-2 sm:shrink-0" onClick={(e) => e.stopPropagation()}>
                          <button
                            className="flex-1 sm:flex-none flex items-center justify-center gap-1 px-3 py-1 text-xs border-2 border-blue-900 text-blue-900 rounded hover:bg-blue-50 font-semibold"
                            onClick={() => setSelectedEmail(b.personEmail)}>
                            <Clock size={12} /> History
                          </button>
                          {!settled && (
                            <button
                              className="flex-1 sm:flex-none px-3 py-1 text-xs bg-blue-900 text-white rounded hover:bg-blue-700 font-semibold"
                              onClick={() => { setSettleTarget(b); setSettleAmt(""); setSettleErr(""); }}>
                              Settle
                            </button>
                          )}
                        </div>

                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* ══ ADD MODAL ══ */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4"
          onClick={() => { setShowAdd(false); setForm(INIT); setFormErr(""); }}>
          <div className="relative w-full max-w-[420px] bg-white rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}>

            <div className={`px-7 pt-6 pb-5 transition-colors duration-300 ${form.type === "GIVEN" ? "bg-green-600" : "bg-red-500"}`}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-white/70 text-xs font-semibold uppercase tracking-widest mb-1">New Entry</p>
                  <h2 className="text-white font-bold text-xl">
                    {form.type === "GIVEN" ? "I Gave Money" : "I Received Money"}
                  </h2>
                </div>
                <button type="button"
                  onClick={() => { setShowAdd(false); setForm(INIT); setFormErr(""); }}
                  className="text-white/70 hover:text-white transition-colors mt-0.5">
                  <X size={20} />
                </button>
              </div>

              <div className="flex gap-2 mt-4">
                <button type="button" onClick={() => setForm({ ...form, type: "GIVEN" })}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold border-2 transition-all ${
                    form.type === "GIVEN"
                      ? "bg-white text-green-600 border-white shadow-sm"
                      : "bg-transparent text-white border-white/40 hover:border-white/70"}`}>
                  <ArrowUpRight size={15} /> I Gave
                </button>
                <button type="button" onClick={() => setForm({ ...form, type: "BORROWED" })}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold border-2 transition-all ${
                    form.type === "BORROWED"
                      ? "bg-white text-red-500 border-white shadow-sm"
                      : "bg-transparent text-white border-white/40 hover:border-white/70"}`}>
                  <ArrowDownLeft size={15} /> I Received
                </button>
              </div>
            </div>

            <form onSubmit={handleAdd} className="px-7 py-6 flex flex-col gap-4">
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field label="Person's Name">
                  <input type="text" className={inputCls} placeholder="Rahul"
                    value={form.personName} onChange={(e) => setForm({ ...form, personName: e.target.value })} required />
                </Field>
                <Field label="Person's Email">
                  <input type="email" className={inputCls} placeholder="rahul@email.com"
                    value={form.personEmail} onChange={(e) => setForm({ ...form, personEmail: e.target.value })} required />
                </Field>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field label="Date">
                  <input type="date" className={inputCls}
                    value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
                </Field>
                <Field label="Note (optional)">
                  <input type="text" className={inputCls} placeholder="For dinner..."
                    value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} />
                </Field>
              </div>

              {formErr && (
                <p className="text-red-500 text-xs font-medium bg-red-50 border border-red-200 rounded-lg px-3 py-2">{formErr}</p>
              )}

              <button type="submit" disabled={formLoading}
                className={`w-full py-3 rounded-xl font-bold text-white text-sm transition-all disabled:opacity-60 ${
                  form.type === "GIVEN" ? "bg-green-600 hover:bg-green-700" : "bg-red-500 hover:bg-red-600"}`}>
                {formLoading ? "Saving..." : `Add ${form.type === "GIVEN" ? "Given" : "Borrowed"} Entry`}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ══ SETTLE MODAL ══ */}
      {settleTarget && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4"
          onClick={() => setSettleTarget(null)}>
          <div className="relative w-full max-w-[360px] bg-white rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}>

            <div className="bg-blue-900 px-7 pt-6 pb-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-white/70 text-xs font-semibold uppercase tracking-widest mb-1">Settle Up</p>
                  <h2 className="text-white font-bold text-xl">{settleTarget.personName}</h2>
                  <p className="text-white/60 text-xs mt-0.5">{settleTarget.personEmail}</p>
                </div>
                <button type="button" onClick={() => setSettleTarget(null)} className="text-white/70 hover:text-white transition-colors mt-0.5">
                  <X size={20} />
                </button>
              </div>
              <div className={`mt-4 inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-bold ${settleTarget.netBalance > 0 ? "bg-green-500/20 text-green-300" : "bg-red-400/20 text-red-300"}`}>
                <IndianRupee size={13} />
                {fmt(settleTarget.netBalance)}
                <span className="font-normal text-xs ml-1 opacity-80">
                  {settleTarget.netBalance > 0 ? "they owe you" : "you owe them"}
                </span>
              </div>
            </div>

            <form onSubmit={handleSettle} className="px-7 py-6 flex flex-col gap-4">
              <Field label="Settlement Amount">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <IndianRupee size={15} />
                  </span>
                  <input type="text" inputMode="numeric" pattern="[0-9]*"
                    className={`${inputCls} pl-8 text-lg font-bold`}
                    placeholder="0"
                    value={settleAmt} onChange={(e) => setSettleAmt(e.target.value)} autoFocus required />
                </div>
              </Field>

              {settleErr && (
                <p className="text-red-500 text-xs font-medium bg-red-50 border border-red-200 rounded-lg px-3 py-2">{settleErr}</p>
              )}

              <button type="submit" disabled={settleLoading}
                className="w-full py-3 rounded-xl font-bold text-white text-sm bg-blue-900 hover:bg-blue-800 transition-all disabled:opacity-60">
                {settleLoading ? "Settling..." : "Confirm Settlement"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}