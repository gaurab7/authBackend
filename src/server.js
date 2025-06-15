import express from 'express'
import authRoutes from '../src/routes/authRoutes.js'

const app = express()

app.use(express.json())

const PORT = process.env.PORT || 8848

//ROUTES
app.use('/', authRoutes)

//server start
app.listen(PORT, ()=>{
     console.log(`server started on PORT: ${PORT}`)
})