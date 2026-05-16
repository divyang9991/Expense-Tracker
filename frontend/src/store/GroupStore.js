// import { create } from "zustand"
// import axiosInstance from "../lib/axios.js"

// const useGroupStore=create((set)=>({
//     group:'',
//     groups:[],
    
//     getGroups:async()=>{
//         try {
//             const groupss=await axiosInstance.get('/group/get');
//             set({groups:groupss.data});
//         } catch (error) {
//             console.log(error.message);
//             set({groups:[]});
//         }
//     },

//     getUserName:async()=>{
//        //
//     },

//     getGroupByID:async(id)=>{
//         try {
//             const group=await axiosInstance.get(`/group/get/${id}`);
//             if(group){
//                 set({group:group.data});
//             }
//         } catch (error) {
//             console.log(error.message);
//         }
//     }
// }))
// export default useGroupStore;