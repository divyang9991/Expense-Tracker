import jwt from "jsonwebtoken";
import User from "../model/user.js";

export const protectRoute = async (req, res, next) => {
  try {
    const cookie = req.cookies.jwt;
    if (!cookie) {
      res.status(400).json({ message: "Dont have a jwt cookie" });
    }
    const verify = jwt.verify(cookie, process.env.JWT_SECRET);
    if (!verify) {
      res.status(400).json({ message: "not a valid jwt cookie" });
    } else {
      const user = await User.findById(verify.userId).select("-password");
      if (!user) {
        res.status(400).json({ message: "not a valid user with id" });
      } else {
        req.user = user;
        next();
      }
    }
  } catch (error) {
    console.log("error in protecting route", error.message);
    res.status(500).json({ message: "error occured in middleware auth" });
  }
};
