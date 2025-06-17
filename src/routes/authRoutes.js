import express from 'express'
import { reqValidator } from '../middleware/ authValidator.js'
import { regCredVerification, logCredVerification } from '../controllers/authController.js'
import { login_limiter, reg_limiter, logout_limiter } from '../middleware/rate_limiter.js'
import { tokenVerification } from '../middleware/authMiddleware.js'
import { logout } from '../services/authServices.js'
const router = express.Router()

//registration
router.post('/register', reqValidator, reg_limiter, regCredVerification)

//login
router.post('/login', reqValidator, login_limiter,  logCredVerification)

//logout
router.post('/logout', logout_limiter, tokenVerification,  logout)

export default router