import { reqValidator } from '../middleware/ authValidator.js'
import { jest } from '@jest/globals'


describe('Request Verification', ()=> {
    it('should call next if request is valid', ()=>{
        const req = { body: {"email" : "gaurab@gmail.com", "password" : "G@urav9861","username" : "gaurab7" } }
        const res = {}
        const next = jest.fn()
        reqValidator(req, res, next)
        expect(next).toHaveBeenCalled()
    })

    it('should return 400 if request is invalid', ()=>{
        const req = { body: {"email" : "gaura@hfaj.sj", "password" : "","username" : "gaurab7" } }
        const res = {
            status: jest.fn().mockReturnThis(),//mockreturn makes status return res which in this context has value 400, jest.fn tracks when its called
            json: jest.fn()
        }
        const next = jest.fn()
        reqValidator(req, res, next)
        expect(res.status).toHaveBeenCalledWith(400)
    })
})



