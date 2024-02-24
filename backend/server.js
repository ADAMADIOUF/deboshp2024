import cookieParser from 'cookie-parser'
import express from 'express'
import dotenv from 'dotenv'
import productRoutes from './routes/productsRoutes.js'
import userRoutes from './routes/userRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import connectDB from './config/db.js'
import { notFound, errorHandler } from './middleware/errorMiddleware.js'
dotenv.config()
connectDB()

const app = express()
const port = process.env.PORT || 5000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/products', productRoutes)
app.use('/api/users', userRoutes)
app.use('/api/orders', orderRoutes)
app.use(notFound)
app.use(errorHandler)
app.listen(port, () => console.log(`The server is running at port ${port}`))
