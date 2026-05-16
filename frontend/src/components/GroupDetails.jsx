// import React, { useEffect } from "react";
// import { useParams } from "react-router-dom";
// import useGroupStore from "../store/GroupStore.js";
// import Navbar from "./Navbar.jsx";
// import SideBar from "./SideBar.jsx";

// const GroupDetails = () => {
//   const { id } = useParams();
//   const getGroupByID = useGroupStore((state) => state.getGroupByID);
//   const { group } = useGroupStore();
//   useEffect(() => {
//     getGroupByID(id);
//   }, []);
//   console.log(group);
//   return (
//     <>
//       <Navbar />
//       <SideBar />
//       <div>
//         <div className="relative pl-84 pr-5 pt-24 h-screen bg-gray-100 text-black overflow-hidden">
//           <div className="font-extrabold text-5xl p-4 m-2 text-blue-800 underline">
//             Group Detail
//           </div>
//           <div className="flex flex-col gap-y-1.5 text-xl bg-white rounded-2xl shadow-md p-10">
//             <div>
//             <div className="flex flex-row justify-between text-black font-bold ">
//                <div className="text-gray-500 font-light">Group Name: <div className="text-black font-bold">{group.name}</div></div>
//                <div className="text-gray-500 font-light">Created by<div className="text-black font-bold">{group.createdBy?.fullName}</div></div>
//             </div>
//             <div className="flex flex-col pt-4">
//                 <div className="text-gray-500 font-light">Group Members:</div>
//             </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default GroupDetails;
