import prisma from "../lib/prisma.js";
import bcrypt from "bcrypt"
export const getUsers = async(req, res) =>{
    try{
        const users = await prisma.user.findMany();
        res.status(200).json(users)
    } catch(err) {
        console.log(err);
        res.status(500).json({message: "Failed to get users."})
    }
}
export const getUser = async(req,res)=> {
    const id=req.params.id
    try {
        const user = await prisma.user.findUnique({
            where: {id}
        })
        res.status(200).json(user)
    }catch(err) {
        console.log(err);
        res.status(500).json({message:"Failed to get user!"})
    }
}
export const updateUser = async(req,res)=> {
    const id = req.params.id
    const tokenUserId = req.userId;
    const {password, avatar, ...inputs} = req.body;
    
    if(id!==tokenUserId) {
        return res.status(403).json({message: "Not recognised!"})
    }
    try {
        let updatedPassword = null;
        if(password) {
            updatedPassword = await bcrypt.hash(password,10);
        }
        const updatedUser = await prisma.user.update({
            where: {id},
            data: {
                ...inputs,
                ...(updatedPassword && {password:updatedPassword}),
                ...(avatar && {avatar})
            },
        })
        const {password: userPassword, ...other} = updatedUser;
        // console.log(other);
        res.status(200).json(other)
    }catch(err) {
        console.log(err)
        res.status(500).json({message:"Failed to update user!"})
    }
}
export const deleteUser = async(req,res)=> {
    const id = req.params.id
    try {
        await prisma.user.delete({
            where: id
        })
        res.status(200).json({message:"User deleted"});
    }catch(err){
        console.log(err)
        res.status(500).json({message:"Unable to delete user!"})
    }
}