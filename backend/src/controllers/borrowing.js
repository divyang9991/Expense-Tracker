import Borrowing from "../model/borrowings.js";
// ==========================
// ➤ 1. Add Borrowing
// ==========================
export const addBorrowing = async (req, res) => {
  const { personName, personEmail, type, amount, note, date } = req.body;
  const userId = req.user._id;

  try {
    if (!personName || !personEmail || !type || !amount || !date) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!["GIVEN", "BORROWED"].includes(type)) {
      return res.status(400).json({ message: "Invalid type" });
    }

    if (amount <= 0) {
      return res.status(400).json({ message: "Amount must be greater than 0" });
    }

    const newBorrowing = new Borrowing({
      userId,
      personName: personName.trim(),
      personEmail: personEmail.toLowerCase().trim(),
      type,
      amount: Number(amount),
      note: note || "",
      date,
    });

    if (!newBorrowing) {
      return res.status(400).json({ message: "Invalid borrowing data" });
    }

    await newBorrowing.save();
    res.status(200).json(newBorrowing);
  } catch (error) {
    console.log("error in adding borrowing", error.message);
    res.status(500).json({ message: "Internal server error in borrowing add" });
  }
};



// ==========================
// ➤ 2. Get All Borrowings (Grouped)
// ==========================
export const getBorrowings = async (req, res) => {
  const userId = req.user._id;

  try {
    const data = await Borrowing.aggregate([
      { $match: { userId } },

      {
        $group: {
          _id: "$personEmail",
          personName: { $first: "$personName" },

          totalGiven: {
            $sum: {
              $cond: [{ $eq: ["$type", "GIVEN"] }, "$amount", 0],
            },
          },

          totalBorrowed: {
            $sum: {
              $cond: [{ $eq: ["$type", "BORROWED"] }, "$amount", 0],
            },
          },
        },
      },

      {
        $project: {
          personName: 1,
          personEmail: "$_id",
          netBalance: { $subtract: ["$totalGiven", "$totalBorrowed"] },
        },
      },
    ]);

    res.status(200).json(data);
  } catch (error) {
    console.log("error in getting borrowings", error.message);
    res.status(500).json({ message: "Internal server error in borrowings" });
  }
};



// ==========================
// ➤ 3. Get History (per person)
// ==========================
export const getBorrowingHistory = async (req, res) => {
  const userId = req.user._id;
  const email = req.params.email.toLowerCase();

  try {
    const history = await Borrowing.find({
      userId,
      personEmail: email,
    }).sort({ date: -1 });

    res.status(200).json(history);
  } catch (error) {
    console.log("error in history", error.message);
    res.status(500).json({ message: "Error fetching history" });
  }
};



// ==========================
// ➤ 4. Settlement
// ==========================
export const settleBorrowing = async (req, res) => {
  const userId = req.user._id;
  const { personEmail, amount } = req.body;

  try {
    if (!personEmail || !amount) {
      return res.status(400).json({ message: "All fields required" });
    }

    const email = personEmail.toLowerCase();

    // 🔥 Calculate net balance
    const data = await Borrowing.aggregate([
      { $match: { userId, personEmail: email } },

      {
        $group: {
          _id: null,
          totalGiven: {
            $sum: {
              $cond: [{ $eq: ["$type", "GIVEN"] }, "$amount", 0],
            },
          },
          totalBorrowed: {
            $sum: {
              $cond: [{ $eq: ["$type", "BORROWED"] }, "$amount", 0],
            },
          },
        },
      },
    ]);

    if (!data.length) {
      return res.status(400).json({ message: "No transactions found" });
    }

    const net = data[0].totalGiven - data[0].totalBorrowed;

    if (Math.abs(amount) > Math.abs(net)) {
      return res.status(400).json({ message: "Amount exceeds balance" });
    }

    let type;

    if (net > 0) {
      type = "BORROWED"; // they paid you
    } else {
      type = "GIVEN"; // you paid them
    }

    const settlement = new Borrowing({
      userId,
      personName: "Settlement",
      personEmail: email,
      type,
      amount: Number(amount),
      isSettlement: true,
      date: new Date(),
    });

    await settlement.save();

    res.status(200).json({ message: "Settlement done", settlement });
  } catch (error) {
    console.log("error in settlement", error.message);
    res.status(500).json({ message: "Error in settlement" });
  }
};

export const updateBorrowing = async (req, res) => {
  const userId = req.user._id;
  const id = req.params.id;
  const { personName, personEmail, type, amount, note, date } = req.body;

  try {
    const borrowing = await Borrowing.findOne({ _id: id, userId });

    if (!borrowing) {
      return res.status(404).json({ message: "Borrowing not found" });
    }

    if (borrowing.isSettlement) {
      return res.status(400).json({ message: "Cannot edit settlement entries" });
    }

    if (type && !["GIVEN", "BORROWED"].includes(type)) {
      return res.status(400).json({ message: "Invalid type" });
    }

    if (amount && amount <= 0) {
      return res.status(400).json({ message: "Amount must be > 0" });
    }

    // update fields
    borrowing.personName = personName?.trim() || borrowing.personName;
    borrowing.personEmail = personEmail?.toLowerCase().trim() || borrowing.personEmail;
    borrowing.type = type || borrowing.type;
    borrowing.amount = amount ? Number(amount) : borrowing.amount;
    borrowing.note = note || borrowing.note;
    borrowing.date = date ? new Date(date) : borrowing.date;

    await borrowing.save();

    res.status(200).json(borrowing);
  } catch (error) {
    console.log("error updating borrowing", error.message);
    res.status(500).json({ message: "Error updating borrowing" });
  }
};

export const deleteBorrowing = async (req, res) => {
  const userId = req.user._id;
  const id = req.params.id;

  try {
    const borrowing = await Borrowing.findOne({ _id: id, userId });

    if (!borrowing) {
      return res.status(404).json({ message: "Borrowing not found" });
    }

    if (borrowing.isSettlement) {
      return res.status(400).json({ message: "Cannot delete settlement entries" });
    }

    await Borrowing.findByIdAndDelete(id);

    res.status(200).json({ message: "Borrowing deleted successfully" });
  } catch (error) {
    console.log("error deleting borrowing", error.message);
    res.status(500).json({ message: "Error deleting borrowing" });
  }
};