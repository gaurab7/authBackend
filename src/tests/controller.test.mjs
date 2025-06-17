import { jest } from '@jest/globals'
import { regCredVerification, logCredVerification } from '../controllers/authController'
import { PrismaClient } from '@prisma/client'
import { registration, login } from '../services/authServices'

//so that we can change the return value of findFirst and Unique for the two tests required
const mockFindFirst = jest.fn()
const mockFindUnique = jest.fn()

//so that it doeent acccs real daatabase
 jest.mock('@prisma/client', () => {
  return {
    PrismaClient: jest.fn().mockImplementation(() => ({
      user: {
        findFirst: mockFindFirst,
        findUnique: mockFindUnique
      },
      $disconnect: jest.fn()
    }))
  }
})
//so that real register/login function is not called
jest.mock('../services/authServices.js', () => ({
  login: jest.fn().mockResolvedValue("fake-token"),
  registration: jest.fn().mockResolvedValue("fake-token")
}))

let prisma

describe('Credential Verification',  ()=>{  
    //so that each new test is fresh
    beforeEach(() => {
         prisma = new PrismaClient()
         mockFindFirst.mockReset()
         mockFindUnique.mockReset()
    })

    afterAll(async () => {
        await prisma.$disconnect(); // Cleanup
     })

    it('should return 409 if the username or email are already in use', async ()=>{
            mockFindFirst.mockResolvedValue({id:1})//find gives an obj if it exists
            mockFindUnique.mockResolvedValue({id:1})
            const req = { body: {"email" : "gaurab@gmail.com", "password" : "J41&fjgjawo","username" : "gaurab7" } }
            const res = {
                status: jest.fn().mockReturnThis(),//mockreturn makes status return res which in this context has value 400, jest.fn tracks when its called
                json: jest.fn()
            }
            //it takes the emai and username from req, directly db is not accesed, instead whenever prisma is used/called, it uses the mock values we set above
            await regCredVerification(req, res)
            expect(res.status).toHaveBeenCalledWith(409)
    })
        

    it('should return 200 if the username & email are not already in use', async ()=>{
      //if we dont do this the mock call returns value set before .i.e. gaurab@gmail.com and gaurab7, now it returns null which means no user with the given email and username
            mockFindFirst.mockResolvedValue(null)
            mockFindUnique.mockResolvedValue(null)
            //using same input values for multiple tests is not good, kept runnig into errors as mocks might retain state, internal logic of controller may still asume in the 2nd test that the vlaue is still taken
            const req = { body: {"email" : "gaura@gmail.com", "password" : "J41&fjwthl895gjawo","username" : "gaura" } }
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            }
            await regCredVerification(req, res)
            expect(res.status).toHaveBeenCalledWith(200)
    })


     it('should return 404 if the user doesnt exist', async ()=>{
            mockFindFirst.mockResolvedValue(null)//find gives an obj if it exists
            const req = { body: {"email" : "gaur6@gmail.com", "password" : "9u23iijfH&fjgjawo","username" : "gaur6" } }
            const res = {
                status: jest.fn().mockReturnThis(),//mockreturn makes status return res which in this context has value 400, jest.fn tracks when its called
                json: jest.fn()
            }
            //it takes the emai and username from req, directly db is not accesed, instead whenever prisma is used/called, it uses the mock values we set above
            await logCredVerification(req, res)
            expect(res.status).toHaveBeenCalledWith(404)
    })
        

    it('should return 200 if the user exists', async ()=>{
      //if we dont do this the mock call returns value set before .i.e. gaurab@gmail.com and gaurab7, now it returns null which means no user with the given email and username
            mockFindFirst.mockResolvedValue({id:1})
            //using same input values for multiple tests is not good, kept runnig into errors as mocks might retain state, internal logic of controller may still asume in the 2nd test that the vlaue is still taken
            const req = { body: {"email" : "gau@gmail.com", "password" : "J41&twioua89849","username" : "gau" } }
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            }
            await logCredVerification(req, res)
            expect(res.status).toHaveBeenCalledWith(200)
    })
})

