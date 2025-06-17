//import bcrypt from 'bcryptjs'
//import jwebtoken from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'
import { registration, login } from '../services/authServices.js'



const prisma = new PrismaClient()

export async function regCredVerification(req, res) {
    try{
        const { email, password, username} = req.body
         if(await prisma.user.findUnique( {where: { email : email }}))
             {
                    return res.status(409).json({ error: "Email already in use!"})
                  }
         else if(await prisma.user.findFirst( { where: { username: username}})){
                     return res.status(409).json({ error: "Username already in use!"})
                  }
         else{
                      const token = await registration(email, password, username)
                      return res.status(200).json({ token })
                  }

    } catch(err) {
        console.log(err)
        return res.status(500).json({ error: err.message || "Internal Server Error"})
    }
    
}

export async function logCredVerification(req, res) {
    try{
        const { email, password, username} = req.body
        const user = await prisma.user.findFirst({where: { AND: [{ email , username }]}})//finds the user with the given email and  username and returns all info
        if(user){ 
            const log_token = await login(user, password)
            return res.status(200).json({ log_token })
        }
        else if(!user){
            return res.status(404).json({error: "User Does Not Exist "})
        }
    }catch(err){
        console.log(err)
        return res.status(500).json({ error: err.message || "Internal Server Error"})
    }
    
}