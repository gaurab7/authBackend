import express from 'express'

const router = express.Router()

//registration
router.post('/register', authValidator, authController)

//login
router.post('/login', (req, res)=>{
    
})

//logout
router.post('/logout', (req, res)=>{
    
})

export default router