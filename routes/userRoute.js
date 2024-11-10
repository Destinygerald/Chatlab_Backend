import express from 'express'
import { getProfile } from '../controllers/userController.js'

const Route = express.Router()

Route.get('/', getProfile)

export default Route