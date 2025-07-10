import express from "express"
import { protectRoute } from "../middlewares/authMiddleware.js";
import { addExpense ,addIncome,deleteIncomeMoney,deleteExpenseMoney,getAllExpense,getAllIncome,getRecent,getInfo} from "../controllers/moneyController.js";

const server=express();

server.post('/expense/add',protectRoute,addExpense);
server.post('/income/add',protectRoute,addIncome);
server.delete('/income/delete/:id',protectRoute,deleteIncomeMoney);
server.delete('/expense/delete/:id',protectRoute,deleteExpenseMoney);
server.get('/expense',protectRoute,getAllExpense);
server.get('/income',protectRoute,getAllIncome);
server.get('/recent',protectRoute,getRecent);
server.get('/:id',protectRoute,getInfo);
export default server;