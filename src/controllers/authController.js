//import bcrypt from 'bcryptjs'
//import jwebtoken from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'
import { registration } from '../services/authServices.js'



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
        return res.status(500).json({ error: "Internal Server Error"})
    }
    
}