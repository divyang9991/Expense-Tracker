import React from 'react'
import useMoneyStore from '../store/MoneyStore';
import { useState } from 'react';

const AddMoney = ({title,onSuccess}) => {

  const [formdata,setFormdata]=useState({
    amount:0,
    category:'',
    date:''
  });

  const {addMoney,addExpense}=useMoneyStore();


  const handleChange=(e)=>{
    setFormdata({...formdata,[e.target.name]:e.target.value});
  }
  
  const handleSubmit=(e)=>{
    e.preventDefault();
    const newData={...formdata,date:new Date(formdata.date)};
    if(title==="income"){
        addMoney(newData);
    }else{
        addExpense(newData);
    }
    setFormdata({amount:0,category:'',date:''});
    if (onSuccess) onSuccess(); 
  }
  return (
    
      
      <form onSubmit={handleSubmit} className=' absolute top-30 right-15 flex flex-col gap-4 p-4 rounded shadow-2xl z-30 bg-white border-2 border-blue-800'>
        <label htmlFor="Category" className='text-gray-900 font-bold'>Category</label>
        <input type="text" name='category' className="border-2xl border-2 border-blue-900 p-2 text-neutral-700" onChange={handleChange} value={formdata.category} required/>
        <label htmlFor="Amount" className='text-gray-900 font-bold'>Amount</label>
        <input type="number" name='amount' className="border-2xl border-2 border-blue-900 p-2 w-full text-neutral-700" onChange={handleChange} value={formdata.amount} required/>
        <label htmlFor="Amount" className='text-gray-900 font-bold'>Date</label>
        <input type='date' name='date' className="border-2 border-blue-900 p-2 text-neutral-700" onChange={handleChange} required/>
        <button type="submit" className='px-6 py-2 bg-blue-900 text-white'>Add</button>
      </form>
  )
}

export default AddMoney
