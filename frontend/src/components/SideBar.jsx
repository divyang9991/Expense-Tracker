// import React, { useState,useEffect} from 'react'
import { Link ,useLocation} from 'react-router-dom'
import {Hand, HandCoins,LayoutDashboard,LogOut,WalletMinimal} from "lucide-react"
import user from "../assets/user.png"
import useMoneyStore from '../store/MoneyStore'
import { useAuthStore } from '../store/useAuthStore'


const SideBar = () => {
  const location=useLocation();
  const {logout}=useAuthStore();
  const {name}=useMoneyStore();
  return (
    <div>
      <aside className="fixed top-16 left-0 w-80 h-[calc(100vh-4rem)] flex justify-center items-center text-black p-4 z-40 bg-white shadow-md">
        <div className="align-center flex flex-col text-black font-bold gap-y-3">
            <div className='self-center pb-4 flex justify-center flex-col w-30 overflow-hidden'><img src={user} className="rounded-full w-30 h-30" /><p className='self-center'>{name}</p></div>
            <Link to='/'  className={`px-14 py-2 rounded-xl shadow hover:shadow-md flex gap-x-3 ${location.pathname==='/'?'bg-blue-800 text-white':'text-black'}`}><LayoutDashboard/>Dashboard</Link>
            <Link to='/income' className={`px-14 py-2 rounded-xl  shadow hover:shadow-md flex gap-x-3 ${location.pathname==='/income'?'bg-blue-800 text-white':'text-black'}`}><WalletMinimal/>Income</Link>
            <Link to='/expense' className={`px-14 py-2 rounded-xl  shadow hover:shadow-md flex gap-x-3 ${location.pathname==='/expense'?'bg-blue-800 text-white':'text-black'}`}><HandCoins />Expense</Link>
            <button  onClick={()=>logout()} className={`px-14 py-2 rounded-xl shadow hover:shadow-md cursor-pointer flex gap-x-3 ${location.pathname==='/logout'?'bg-blue-800 text-white':'text-black'}`}><LogOut/>Logout</button>
        </div>
      </aside>
    </div>
  )
}

export default SideBar
