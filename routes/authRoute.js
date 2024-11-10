import express from 'express'
import { register, login } from '../controllers/authController.js'

const Route = express.Router()

Route.post('/login', login)
Route.post('/register', register)

export default Route;