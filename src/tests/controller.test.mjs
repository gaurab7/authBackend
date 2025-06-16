import { regCredVerification } from '../controllers/authController'
import { PrismaClient } from '@prisma/client'
import { jest } from '@jest/globals'

jest.mock('@prisma/client', () => {
  return {
    PrismaClient: jest.fn(() => ({
      user: {
        findFirst: jest.fn(),
        findUnique: jest.fn()
      },
      $disconnect: jest.fn()
    }))
  }
})

let prisma

describe('Credential Verification', ()=>{  
    //so that each new test is fresh
    beforeEach(() => {
         prisma = new PrismaClient()
         jest.clearAllMocks()//clears data from previous test
    })

    afterAll(async () => {
        await prisma.$disconnect(); // Cleanup
     })

    it('should return 400 if the username & email are already in use', async ()=>{

           // Mock Prisma response--> these prsima functions will give out these responses when called for tests and not access the DB for real
            prisma.user.findFirst.mockResolvedValue({
                 username: "gaurab7"
             })
            prisma.user.findUnique.mockResolvedValue({
                email: "gaurab@gmail.com"
            })
            const req = { body: {"r_email" : "gaurab@gmail.com", "password" : "jgjawo","r_username" : "gaurab7" } }
            const res = {
                status: jest.fn().mockReturnThis(),//mockreturn makes status return res which in this context has value 400, jest.fn tracks when its called
                json: jest.fn()
            }
            const next = jest.fn()
            //it takes the emai and username from req, directly db is not accesed, instead whenever prisma is used/called, it uses the mock values we set above
            await regCredVerification(req, res, next)
            expect(res.status).toHaveBeenCalledWith(400)
    })
})