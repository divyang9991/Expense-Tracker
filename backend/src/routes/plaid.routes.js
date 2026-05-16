import express from "express";
import { Configuration, PlaidApi, PlaidEnvironments } from "plaid";
import Money from "../model/money.js";
import { protectRoute } from "../middlewares/authMiddleware.js";

const router = express.Router();

const config = new Configuration({
  basePath: PlaidEnvironments[process.env.PLAID_ENV],
  baseOptions: {
    headers: {
      "PLAID-CLIENT-ID": process.env.PLAID_CLIENT_ID,
      "PLAID-SECRET": process.env.PLAID_SECRET,
    },
  },
});
const plaidClient = new PlaidApi(config);

const toINR = (usdAmount) => {
  return parseFloat((Math.abs(usdAmount) * 91).toFixed(2));
};

const incomeCategory = (plaidCategory) => {
  const cat = plaidCategory?.toLowerCase() || "";
  if (cat.includes("food") || cat.includes("restaurant")) return "Freelance";
  if (cat.includes("transport") || cat.includes("travel")) return "Salary";
  if (cat.includes("shop") || cat.includes("retail")) return "Business";
  if (cat.includes("entertainment")) return "Bonus";
  if (cat.includes("health") || cat.includes("medical")) return "Insurance";
  if (cat.includes("education")) return "Scholarship";
  if (cat.includes("utilities") || cat.includes("bills")) return "Salary";
  return "Salary";
};

router.post("/create-link-token", protectRoute, async (req, res) => {
  try {
    const response = await plaidClient.linkTokenCreate({
      user: { client_user_id: req.user._id.toString() },
      client_name: "Personal Finance Manager",
      products: ["transactions"],
      country_codes: ["US"],
      language: "en",
    });
    res.json({ link_token: response.data.link_token });
  } catch (err) {
    console.log("Link token error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

router.post("/exchange-token", protectRoute, async (req, res) => {
  try {
    const { public_token } = req.body;

    const exchangeRes = await plaidClient.itemPublicTokenExchange({ public_token });
    const access_token = exchangeRes.data.access_token;

    const txRes = await plaidClient.transactionsSync({ access_token });
    const plaidTxns = txRes.data.added;

    console.log("Plaid transactions found:", plaidTxns.length);

    if (plaidTxns.length === 0) {
      return res.json({ message: "No transactions found in sandbox" });
    }

    const transactions = [];

    plaidTxns.forEach((tx) => {
      const amountINR = toINR(tx.amount);
      const expenseCategory =
        tx.personal_finance_category?.primary ||
        tx.category?.[0] ||
        "General";
      const date = new Date(tx.date);

      transactions.push({
        userId: req.user._id,
        expenseType: "expense",
        category: expenseCategory,
        amount: amountINR,
        date: date,
      });

      transactions.push({
        userId: req.user._id,
        expenseType: "income",
        category: incomeCategory(expenseCategory),
        amount: parseFloat((amountINR * 1.3).toFixed(2)),
        date: date,
      });
    });

    // Duplicate check — skip any transaction that already exists
    const inserted = [];
    for (const tx of transactions) {
      const exists = await Money.findOne({
        userId: tx.userId,
        amount: tx.amount,
        date: tx.date,
        expenseType: tx.expenseType,
        category: tx.category,
      });
      if (!exists) inserted.push(tx);
    }

    if (inserted.length === 0) {
      return res.json({ message: "All transactions already exist, nothing new added" });
    }

    await Money.insertMany(inserted);
    console.log("Saved:", inserted.length, "Skipped:", transactions.length - inserted.length);

    res.json({
      message: `${inserted.length} new entries added, ${transactions.length - inserted.length} duplicates skipped`,
    });
  } catch (err) {
    console.log("Exchange error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

export default router;