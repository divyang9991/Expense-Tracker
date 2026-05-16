// import { X } from 'lucide-react';
// import React from 'react'
// import { ArrowRight } from 'lucide-react';
// import { Link } from 'react-router-dom';
// const GroupList = ({list}) => {
//   return (
//     <>
//         <div className='font-extrabold text-5xl p-4 m-2 text-blue-800 underline'>List of Groups</div>
//         <div className='flex flex-col gap-y-1.5'>
//         {
//             list.map((item)=>{
//                 return (
//                  <Link  to={`/details/${item._id}`} key={item._id}>
//                 <div className='flex justify-between rounded-2xl shaded-sm bg-white p-10 hover:shadow-md'>
//                     <div className='flex flex-col gap-y-1'><div className='font-extrabold text-2xl'>{item.name}</div><div className='text-gray-600 font-bold'>created at {new Date(item.createdDate).toISOString().split('T')[0]}</div></div>
//                     <div className='flex gap-x-3.5 flex-row self-center font-bold'><div className='text-gray-500 font-medium'>created by</div>{item.createdBy?.fullName}<ArrowRight/></div>
//                 </div></Link>
//                 );
//             })
//         }
//         </div>
//     </>
//   )
// }

// export default GroupList
