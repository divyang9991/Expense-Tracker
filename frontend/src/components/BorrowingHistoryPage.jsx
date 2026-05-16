import { useEffect, useState } from "react";
import { IndianRupee, ArrowLeft, Pencil, Trash2, X, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import useBorrowingStore from "../store/useBorrowingStore";
import Navbar from "./Navbar";
import SideBar from "./SideBar";
import { Skeleton } from "@mui/material";

const fmt     = (n) => Number(Math.abs(n)).toFixed(2);
const fmtDate = (d) => new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
const today   = () => new Date().toISOString().split("T")[0];

const Field = ({ label, children }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">{label}</label>
    {children}
  </div>
);

const inputCls = "w-full bg-gray-50 border-2 border-gray-200 focus:border-blue-900 outline-none rounded-lg px-3 py-2.5 text-sm text-gray-800 transition-colors placeholder:text-gray-300";

export default function BorrowingHistoryPage({ email, onBack }) {
  const {
    history, historyLoading, getHistory,
    updateBorrowing, deleteBorrowing, clearHistory, borrowings,
  } = useBorrowingStore();

  const person = borrowings.find(b => b.personEmail.toLowerCase() === email.toLowerCase());
  const net    = person?.netBalance ?? 0;

  const [editEntry,     setEditEntry]     = useState(null);
  const [editForm,      setEditForm]      = useState({});
  const [editErr,       setEditErr]       = useState("");
  const [editLoading,   setEditLoading]   = useState(false);
  const [deleteId,      setDeleteId]      = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    getHistory(email);
    return () => clearHistory();
  }, [email]);

  const openEdit = (entry) => {
    setEditEntry(entry);
    setEditErr("");
    setEditForm({
      personName:  entry.personName,
      personEmail: entry.personEmail,
      type:        entry.type,
      amount:      entry.amount,
      note:        entry.note || "",
      date:        entry.date?.split("T")[0] ?? today(),
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditErr("");
    if (!editForm.amount || Number(editForm.amount) <= 0) { setEditErr("Amount must be > 0."); return; }
    setEditLoading(true);
    try {
      await updateBorrowing(editEntry._id, { ...editForm, amount: Number(editForm.amount) }, email);
      setEditEntry(null);
    } catch {
      setEditErr("Update failed.");
    } finally {
      setEditLoading(false);
    }
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await deleteBorrowing(deleteId, email);
    } finally {
      setDeleteLoading(false);
      setDeleteId(null);
    }
  };

  return (
    <>
      <Navbar />
      <SideBar />

      <div className="pl-0 lg:pl-80 pr-4 pt-20 pb-15 bg-gray-100 min-h-screen">
        <div className="flex flex-col gap-4 px-4 pt-5">

          {/* ── Header card ── */}
          <div className="bg-white shadow-2xl rounded-xl px-4 sm:px-10 py-4 flex flex-wrap sm:flex-nowrap items-center gap-4">
            <button onClick={onBack}
              className="rounded shadow-xl bg-white font-extrabold text-blue-900 px-4 py-1.5 border-blue-900 border-2 flex items-center gap-1 cursor-pointer hover:bg-blue-50 text-sm shrink-0">
              <ArrowLeft size={15} /> Back
            </button>

            <div className="flex-1 min-w-0">
              <p className="text-blue-900 font-bold text-xl truncate">{person?.personName ?? email}</p>
              <p className="text-xs text-gray-400 truncate">{email}</p>
            </div>

            <div className="flex items-center gap-3 bg-gray-50 border-2 border-gray-100 rounded-xl px-5 py-3 shrink-0">
              {net === 0 ? (
                <span className="text-sm text-gray-500 font-semibold">All Settled</span>
              ) : (
                <div className="text-right">
                  <p className={`font-extrabold text-xl flex items-center justify-end ${net > 0 ? "text-green-600" : "text-red-500"}`}>
                    <IndianRupee size={18} />{fmt(net)}
                  </p>
                  <p className="text-xs text-gray-400">
                    {net > 0 ? `${person?.personName ?? "They"} owes you` : "You owe them"}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* ── Transaction list card ── */}
          <div className="bg-white shadow-2xl rounded-xl px-4 sm:px-10 py-6 flex flex-col">
            <h3 className="text-blue-900 font-bold text-lg mb-5">Transaction History</h3>

            {historyLoading ? (
              <div className="flex flex-col gap-3">
                {[1,2,3,4].map(i => (
                  <Skeleton key={i} variant="rectangular" height={64} animation="wave" style={{ borderRadius: 12 }} />
                ))}
              </div>
            ) : history.length === 0 ? (
              <div className="text-center py-10 text-gray-400 text-sm">No transactions found.</div>
            ) : (
              <div className="flex flex-col gap-3">
                {history.map((entry) => (
                  <div key={entry._id}
                    className="flex flex-wrap sm:flex-nowrap items-center gap-3 sm:gap-4 p-4 border-2 border-gray-100 rounded-xl hover:border-blue-200 hover:shadow-sm transition-all">

                    <div className="shrink-0">
                      {entry.isSettlement ? (
                        <span className="text-xs border border-gray-300 text-gray-500 rounded-full px-3 py-1">Settlement</span>
                      ) : entry.type === "GIVEN" ? (
                        <span className="text-xs bg-green-50 text-green-700 border border-green-200 rounded-full px-3 py-1">Given</span>
                      ) : (
                        <span className="text-xs bg-red-50 text-red-600 border border-red-200 rounded-full px-3 py-1">Borrowed</span>
                      )}
                    </div>

                    <p className={`font-extrabold flex items-center shrink-0 ${entry.type === "GIVEN" ? "text-green-600" : "text-red-500"}`}>
                      <IndianRupee size={14} />{fmt(entry.amount)}
                    </p>

                    <p className="flex-1 text-sm text-gray-400 truncate">{entry.note || "—"}</p>

                    <p className="text-xs text-gray-400 shrink-0">{fmtDate(entry.date)}</p>

                    {!entry.isSettlement && (
                      <div className="flex gap-2 shrink-0">
                        <button onClick={() => openEdit(entry)}
                          className="p-1.5 border-2 border-blue-900 text-blue-900 rounded hover:bg-blue-50">
                          <Pencil size={14} />
                        </button>
                        <button onClick={() => setDeleteId(entry._id)}
                          className="p-1.5 border-2 border-red-500 text-red-500 rounded hover:bg-red-50">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>

      {/* ══ EDIT MODAL ══ */}
      {editEntry && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4"
          onClick={() => setEditEntry(null)}>
          <div className="relative w-full max-w-[420px] bg-white rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}>

            <div className={`px-7 pt-6 pb-5 transition-colors duration-300 ${editForm.type === "GIVEN" ? "bg-green-600" : "bg-red-500"}`}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-white/70 text-xs font-semibold uppercase tracking-widest mb-1">Edit Entry</p>
                  <h2 className="text-white font-bold text-xl">
                    {editForm.type === "GIVEN" ? "I Gave Money" : "I Received Money"}
                  </h2>
                </div>
                <button type="button" onClick={() => setEditEntry(null)}
                  className="text-white/70 hover:text-white transition-colors mt-0.5">
                  <X size={20} />
                </button>
              </div>

              <div className="flex gap-2 mt-4">
                {["GIVEN", "BORROWED"].map((t) => (
                  <button key={t} type="button" onClick={() => setEditForm({ ...editForm, type: t })}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold border-2 transition-all ${
                      editForm.type === t
                        ? "bg-white border-white shadow-sm " + (t === "GIVEN" ? "text-green-600" : "text-red-500")
                        : "bg-transparent text-white border-white/40 hover:border-white/70"}`}>
                    {t === "GIVEN" ? <><ArrowUpRight size={15} /> I Gave</> : <><ArrowDownLeft size={15} /> I Received</>}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleEditSubmit} className="px-7 py-6 flex flex-col gap-4">

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field label="Person's Name">
                  <input type="text" className={inputCls}
                    value={editForm.personName ?? ""} onChange={(e) => setEditForm({ ...editForm, personName: e.target.value })} required />
                </Field>
                <Field label="Person's Email">
                  <input type="email" className={inputCls}
                    value={editForm.personEmail ?? ""} onChange={(e) => setEditForm({ ...editForm, personEmail: e.target.value })} required />
                </Field>
              </div>

              <Field label="Amount">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <IndianRupee size={15} />
                  </span>
                  <input type="text" inputMode="numeric" pattern="[0-9]*"
                    className={`${inputCls} pl-8 text-lg font-bold`}
                    placeholder="0"
                    value={editForm.amount ?? ""} onChange={(e) => setEditForm({ ...editForm, amount: e.target.value })} required />
                </div>
              </Field>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field label="Date">
                  <input type="date" className={inputCls}
                    value={editForm.date ?? ""} onChange={(e) => setEditForm({ ...editForm, date: e.target.value })} required />
                </Field>
                <Field label="Note (optional)">
                  <input type="text" className={inputCls} placeholder="For dinner..."
                    value={editForm.note ?? ""} onChange={(e) => setEditForm({ ...editForm, note: e.target.value })} />
                </Field>
              </div>

              {editErr && (
                <p className="text-red-500 text-xs font-medium bg-red-50 border border-red-200 rounded-lg px-3 py-2">{editErr}</p>
              )}

              <button type="submit" disabled={editLoading}
                className={`w-full py-3 rounded-xl font-bold text-white text-sm transition-all disabled:opacity-60 ${
                  editForm.type === "GIVEN" ? "bg-green-600 hover:bg-green-700" : "bg-red-500 hover:bg-red-600"}`}>
                {editLoading ? "Saving…" : "Save Changes"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ══ DELETE CONFIRM MODAL ══ */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4"
          onClick={() => setDeleteId(null)}>
          <div className="relative w-full max-w-[360px] bg-white rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}>

            <div className="bg-red-500 px-7 pt-6 pb-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-white/70 text-xs font-semibold uppercase tracking-widest mb-1">Confirm</p>
                  <h2 className="text-white font-bold text-xl">Delete Entry?</h2>
                </div>
                <button onClick={() => setDeleteId(null)} className="text-white/70 hover:text-white transition-colors mt-0.5">
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="px-7 py-6 flex flex-col gap-4">
              <p className="text-sm text-gray-500">This action cannot be undone.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteId(null)}
                  className="flex-1 px-4 py-2.5 border-2 border-blue-900 text-blue-900 rounded-xl hover:bg-blue-50 text-sm font-semibold">
                  Cancel
                </button>
                <button onClick={handleDelete} disabled={deleteLoading}
                  className="flex-1 px-4 py-2.5 bg-red-500 text-white rounded-xl hover:bg-red-600 text-sm font-semibold disabled:opacity-60">
                  {deleteLoading ? "Deleting…" : "Yes, Delete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}