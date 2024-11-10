import express from 'express'
import { authUser } from '../helpers/middleware.js'
import { chats, friends, allChats, people } from '../controllers/chatController.js'

const Route = express.Router()

Route.use(authUser)

Route.get('/friends', friends)
Route.get('/chats/:id', chats)
Route.get('/all', allChats)
Route.get('/people', people)

export default Route