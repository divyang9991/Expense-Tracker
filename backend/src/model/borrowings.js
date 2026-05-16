import mongoose from "mongoose";

const borrowingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    personName: {
      type: String,
      required: true,
    },

    personEmail: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      enum: ["GIVEN", "BORROWED"],
      required: true,
    },


    amount: {
      type: Number,
      required: true,
      min: 1,
    },

    note: {
      type: String,
      default: "",
    },

    date: {
      type: Date,
      required: true,
    },

    isSettlement: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);


borrowingSchema.index({ userId: 1, personEmail: 1 });

const Borrowing = mongoose.model("Borrowing", borrowingSchema);

export default Borrowing;