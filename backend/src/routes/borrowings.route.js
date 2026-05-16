import express from "express";
import { protectRoute } from "../middlewares/authMiddleware.js";

import {
  addBorrowing,
  getBorrowings,
  getBorrowingHistory,
  settleBorrowing,
  updateBorrowing,
  deleteBorrowing
} from "../controllers/borrowing.js";

const server = express();

server.post('/add', protectRoute, addBorrowing);

server.get('/', protectRoute, getBorrowings);

server.get('/history/:email', protectRoute, getBorrowingHistory);

server.post('/settle', protectRoute, settleBorrowing);

server.put('/update/:id', protectRoute, updateBorrowing);

server.delete('/delete/:id', protectRoute, deleteBorrowing);

export default server;