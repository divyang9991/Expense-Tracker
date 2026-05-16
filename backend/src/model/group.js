// import mongoose from "mongoose";

// const groupSchema=new mongoose.Schema({
//     name:{
//         type:String,
//         required:true
//     },
//     members:{
//         type:[mongoose.Schema.Types.ObjectId],
//         ref:"User",
//         required:true
//     },
//     createdBy:{
//         type:mongoose.Schema.Types.ObjectId,
//         ref:"User",
//         require:true
//     },
//     expenses:{
//         type:[mongoose.Schema.Types.ObjectId],
//         ref:"Money"
//     },
//     createdDate:{
//         type:Date,
//         required:true
//     }
// })

// const Group=mongoose.model("Group",groupSchema);

// Group.createIndexes({members:1});
// export default Group;