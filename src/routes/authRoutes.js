import express from 'express'
import { reqValidator } from '../middleware/ authValidator.js'
import {test} from '../controllers/authController.js'

const router = express.Router()

//registration
router.post('/register', reqValidator, test)

//login
router.post('/login', (req, res)=>{
    
})

//logout
router.post('/logout', (req, res)=>{
    
})

export default router