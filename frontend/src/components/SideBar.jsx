/* eslint-disable no-unused-vars */
import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { HandCoins, LayoutDashboard, LogOut, WalletMinimal, TrendingDown, Menu, X } from "lucide-react"
import user from "../assets/user.png"
import useMoneyStore from '../store/MoneyStore'
import { useAuthStore } from '../store/useAuthStore'

const navLinks = [
  { to: '/',           icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/income',     icon: WalletMinimal,   label: 'Income'    },
  { to: '/expense',    icon: TrendingDown,    label: 'Expense'   },
  { to: '/borrowings', icon: HandCoins,       label: 'Borrow'    },
];

const SideBar = () => {
  const location        = useLocation();
  const { logout }      = useAuthStore();
  const { name }        = useMoneyStore();
  const [open, setOpen] = useState(false);

  const isActive = (to) =>
    location.pathname === to ||
    (to === '/borrowings' && location.pathname.startsWith('/borrowings'));

  const NavContent = () => (
    <div className="align-center flex flex-col text-black font-bold gap-y-3">
      <div className='self-center pb-4 flex justify-center flex-col w-30 overflow-hidden'>
        <img src={user} className="rounded-full w-30 h-30" alt="user" />
        <p className='self-center'>{name}</p>
      </div>

      {navLinks.map(({ to, icon: Icon, label }) => (
        <Link
          key={to}
          to={to}
          onClick={() => setOpen(false)}
          className={`px-14 py-2 rounded-xl shadow hover:shadow-md flex gap-x-3 ${
            isActive(to) ? 'bg-blue-800 text-white' : 'text-black'
          }`}
        >
          <Icon /> {label}
        </Link>
      ))}

      <button
        onClick={() => { logout(); setOpen(false); }}
        className="px-14 py-2 rounded-xl shadow hover:shadow-md cursor-pointer flex gap-x-3 text-black"
      >
        <LogOut /> Logout
      </button>
    </div>
  );

  return (
    <>
      {/* ── Desktop sidebar — unchanged ── */}
      <aside className="hidden lg:flex fixed top-16 left-0 w-80 h-[calc(100vh-4rem)] justify-center items-center text-black p-4 z-40 bg-white shadow-md">
        <NavContent />
      </aside>

      {/* ── Mobile hamburger ── */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
      >
        <Menu size={20} className="text-blue-900" />
      </button>

      {/* ── Mobile backdrop ── */}
      {open && (
        <div
          className="lg:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          onClick={() => setOpen(false)}
        />
      )}

      {/* ── Mobile drawer ── */}
      <aside
        className={`lg:hidden fixed top-0 left-0 h-full w-80 bg-white shadow-md z-50 flex justify-center items-center p-4 transition-transform duration-300 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
          onClick={() => setOpen(false)}
          aria-label="Close menu"
        >
          <X size={20} />
        </button>
        <NavContent />
      </aside>
    </>
  );
};

export default SideBar;