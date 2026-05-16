// // models/GroupExpense.js
// import mongoose from "mongoose";

// const PaymentStatusSchema = new mongoose.Schema({
//   user: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//     required: true
//   },
//   amountDue: {
//     type: Number,
//     required: true,
//     min: 0
//   },
//   isPaid: {
//     type: Boolean,
//     default: false
//   },
//   paidAt: {
//     type: Date
//   }
// }, { _id: false });

// const groupExpenseSchema = new mongoose.Schema({
//   group: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Group",
//     required: true,
//     index: true           // lets you quickly fetch all expenses for a group
//   },
//   paidBy: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//     required: true
//   },
//   category: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   totalAmount: {
//     type: Number,
//     required: true,
//     min: 0
//   },
//   splitAmong: [{
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//     required: true
//   }],
//   paymentStatus: [ PaymentStatusSchema ],
//   dueDate: {
//     type: Date,
//     required: true
//   },
//   description: {
//     type: String,
//     trim: true
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now
//   }
// });

// // // Automatically build `paymentStatus` array on create
// groupExpenseSchema.pre("validate", function(next) {
//   if (this.isNew) {
//     const share = this.totalAmount / this.splitAmong.length;
//     this.paymentStatus = this.splitAmong.map(userId => ({
//       user: userId,
//       amountDue: Math.round(share * 100) / 100,
//       isPaid: userId.equals(this.paidBy),
//       paidAt: userId.equals(this.paidBy) ? new Date() : null
//     }));
//   }
//   next();
// });

// export default mongoose.model("GroupExpense", groupExpenseSchema);
