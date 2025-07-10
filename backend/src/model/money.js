import mongoose from "mongoose";

const moneySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    expenseType: {
      type: String,
      enum: ["income", "expense"],
      required: true,
    },
    category: {
      type: String,
      requierd: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    // ,
    // emoji:{
    //     type:String
    // }
  },
  { timestamps: true }
);

const Money = mongoose.model("Money", moneySchema);

Money.createIndexes({userId:1})
export default Money;
