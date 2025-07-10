import React from 'react'
import App from "./App.jsx";
import { useEffect } from 'react';
import { Routes, Route} from "react-router-dom";
import Income from "./components/Income.jsx";
import Expense from "./components/Expense.jsx";
import { useAuthStore } from './store/useAuthStore.js';
import {Loader} from 'lucide-react'
import { Navigate } from 'react-router-dom'
import SignUp from './components/SignUp.jsx';
import LogInPage from './components/LoginPage.jsx';
import WrongRoute from './WrongRoute.jsx';
import {Toaster} from 'react-hot-toast'

const Entry = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  useEffect(() => {
      checkAuth();
    }, [checkAuth]);
    
    if (isCheckingAuth && !authUser)
      return (
        <div className="flex items-center justify-center h-screen">
          <Loader className="size-10 animate-spin" />
        </div>
      );

  return (
    <div>
      <Routes>
        <Route path="/" element={authUser?<App />:<Navigate to='/login'/>} />
        <Route path="/income" element={authUser?<Income/>:<Navigate to='/login'/>} />
        <Route path="/expense" element={authUser?<Expense/>:<Navigate to='/login'/>} />
        <Route path='/signup' element={!authUser?<SignUp/>:<Navigate to='/'/>}/>
        <Route path='/login' element={!authUser?<LogInPage/>:<Navigate to='/'/>}/>
        <Route path="*" element={<WrongRoute/>} />
      </Routes>
      <Toaster/>
    </div>
  )
}

export default Entry
