import express from "express"
import {signUp,logIn,profileUpdate,logOut, checkAuth} from "../controllers/authController.js"
import { protectRoute } from "../middlewares/authMiddleware.js";
const router=express();

router.post('/signup',signUp);
router.post('/login',logIn);
router.put('/profile-update',protectRoute,profileUpdate);
router.post('/logout',logOut);
router.get('/user',protectRoute,checkAuth);

export default router;