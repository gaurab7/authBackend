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
        return res.status(500).json({ error: "Internal Server Error"})
    }
}