import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function registration(email, password, username) {
    try{
        const hpw = await bcrypt.hash(password, 10);
        const created = new Date(Date.now())
        const newUser = await prisma.user.create({
            data: { email, username, password: hpw, createdAt: created}
        })
        if(!process.env.JWT_SECRET_KEY) { throw new ErrorI("JWT KEY not set in enviroment variables")}
        const token =  jwt.sign({ id: newUser.id}, process.env.JWT_SECRET_KEY, { expiresIn: '1h' })
        const tokenExp = new Date(Date.now() + 60 * 60 * 1000)
        const tokenGen = await prisma.session.create({
            data: { userId: newUser.id, token, createdAt: created, expiresAt: tokenExp }
        })
        return token

    }catch(err)
    {
        console.log(err)
        throw new Error(err.message || "Internal Server Error")
    }
}

export async function login(user, password) {
    try{
        const match = await bcrypt.compare(password, user.password)//it hashes the pw user provides and compares wiht the hashed pw from DB. Returns true or false
        if(match) { 
                if(!process.env.JWT_SECRET_KEY) { throw new Error("JWT KEY not set in enviroment variables")}
                const log_token =  jwt.sign({ id: user.id}, process.env.JWT_SECRET_KEY, { expiresIn: '1h' })
                const log_tokenGen = await prisma.session.create({
                     data: { userId: user.id, token: log_token, createdAt: new Date(Date.now()), expiresAt: new Date(Date.now() + 60 * 60 * 1000) }
                    })
                console.log("User Logged In")
                return log_token
               
            }
        else{
            throw new Error(" Password Incorrect")
        }
    }catch(err){
        console.log(err)
        throw new Error(err.message || "Internal Server Error")
    }
}