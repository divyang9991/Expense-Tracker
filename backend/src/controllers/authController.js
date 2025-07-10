import cloudinary from "../lib/cloudinary.js"
import { generateToken } from "../lib/jwt.js";
import User from "../model/user.js"
import bcrypt from "bcrypt"

export const signUp=async (req,res)=>{
    const {email,fullName,password}=req.body;
     try {
        
        if(!email || !fullName ||!password){
            res.status(400).json({message:"All fields are required"})
         }
         if(password.length<7){
            res.status(400).json({message:"password length should be minimum 7"});
         }
         //check already registered
         const findMail=await User.findOne({email});
         if(findMail){
            res.status(400).json({message:"email already exist"});
         }
         
         const salt=await bcrypt.genSalt(10);
         const  hashedPassword=await bcrypt.hash(password,salt);

         const newUser=new User({fullName,email,password:hashedPassword})
    
         if(newUser){
                //generate jwt token
                generateToken(newUser._id,res);
                await newUser.save();

                res.status(201).json({
                    _id:newUser._id,
                    fullName:newUser.fullName,
                    email:newUser.email,
                    profilePic:newUser.profilePic
                })

         }else{
            res.status(400).json({message:"bad data in sign up"});
         }
     } catch (error) {
        console.log("error in signing up",error.message);
        res.status(500).json({message:"internal server error occured"});
     }
}


export const logIn=async (req,res)=>{
    const {email,password}=req.body;
    try {
        if(!email || !password){
            res.status(400).json({message:"All fields are required"});
        }
        const findMail=await User.findOne({email});
        if(!findMail){
            res.status(400).json({message:"Sign up required, email does not exists"});
        }
        
        const match=await bcrypt.compare(password,findMail.password);
        if(match){
             generateToken(findMail._id,res);
             res.status(200).json({
                _id:findMail._id,
                email:findMail.email,
                profilePic:findMail.pic,
                fullName:findMail.fullName
             })
        }else{
            res.status(400).json({message:"Incorrect Password"});
        }
    } catch (error) {
        console.log("Error in logging in",error.message);
        res.status(500).json({message:"Internal server error"});
    }

}

export const logOut=async (req,res)=>{
    try {
        res.cookie("jwt",'',{maxAge:0});
        res.status(200).json({message:"logout successfully"});
    } catch (error) {
        console.log("error occured in logout :",error.message);
        res.status(500).json({message:"Internal server Error"});
    }
}

export const checkAuth=(req,res)=>{
    try {
        res.status(200).json(req.user);
    } catch (error) {
        res.status(500).json({message:"internal server error"});
    }
}

export const profileUpdate=async (req,res)=>{
    const {profilePic}=req.body;
    try {
        const userId=req.user._id;
        if(!profilePic){
            res.status(400).json({message:"please enter correct pic"});
        }
        const cloudinaryResponse=await cloudinary.uploader.upload(profilePic);
        const updatedUser=await User.findByIdAndUpdate(userId,{profilePic:cloudinaryResponse.secure_url},{new:true});
        res.status(201).json(updatedUser);
    } catch (error) {
        console.log("profile update error",error.message);
        res.status(500).json({message:"internal server error in profileupdate"});
    }
}