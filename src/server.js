import express from 'express'

const app = express()

app.use(express.json())

const PORT = process.env.PORT || 8848

//ROUTES
app.use('/register')
app.use('/login')
app.use('/logout')

//server start
app.listen(PORT, ()=>{
     console.log(`server started on PORT: ${PORT}`)
})