// import Group from "../model/group.js";
// import User from "../model/user.js"

// export const createGroup = async (req, res) => {
//   const creater = req.user._id;
//   const { name, members ,createdDate} = req.body;

//   try {
//     const users = await User.find({ email: { $in: members } });
//     if (users.length !== members.length) {
//       console.log("Error creating group,wrong email(s)");
//       res.status(400).json({ message: "Some emails are wrong!" });
//     }
//     const newGroup = await Group.create({
//       name,
//       members: users.map((u) => u._id),
//       createdBy: creater,createdDate
//     });
//     res.status(201).json(newGroup);
//   } catch (error) {
//     console.log("Error occured",error.message);
//     res.status(500).json({message:error.message});
//   }
// };


// export const getGroups=async (req,res)=>{
//     const user=req.user._id;
//     try {
//         const groups=await Group.find({members:user}).populate('createdBy','fullName email');
//         res.status(200).json(groups);
//     } catch (error) {
//         console.log("error in getting groups");
//         res.status(500).json({message:error.message});
//     }
// }

// export const getGroupDetails=async(req,res)=>{
//     const user=req.user._id;
//     try {
//         const group=await Group.findOne({members:user,_id:req.params.id}).populate('createdBy','fullName email');
//         res.status(200).json(group);
//     } catch (error) {
//         console.log("error getting group with id");
//         res.status(500).json({message:error.message});
//     }
// }

// // export const addExpense=async(req,res)=>{
// //     const user=req.user._id;
// //     const {}
// //     try {
        
// //     } catch (error) {
        
// //     }
// // }