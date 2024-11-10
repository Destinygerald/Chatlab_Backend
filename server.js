import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import 'dotenv/config.js'

import { errorHandler, socketMiddleware } from './helpers/middleware.js'
import { joinRoom, newRoom, sendMessage, receiveMessage, readMessage, loggedIn, lastSeenTracker, handleDisconnect } from './events/chatEvents.js'
import authRoute from './routes/authRoute.js'
import userRoute from './routes/userRoute.js'
import chatRoute from './routes/chatRoute.js'

const app = express()

// export the http server
const httpServer = createServer(app)

const io = new Server(httpServer, {
	cors: { 
		origin: "*", 
		credentials: true 
	}
})

// Middlewares
app.use(express.json())
app.use(cors({
	origin: 'http://localhost:5173',
	credentials: true
}))
app.use(cookieParser())
io.use(socketMiddleware)

// Routes
app.use('/auth', authRoute)
app.use('/user', userRoute)
app.use('/chat', chatRoute)

// Error handler
app.use(errorHandler)

// Socket events
io.on('connection', (socket) => {
	
	joinRoom(socket)

	newRoom(socket)

	sendMessage(socket)

	receiveMessage(socket)
	
	readMessage(socket)
	
	loggedIn(socket)
	
	lastSeenTracker(socket)
	
	handleDisconnect(socket)
})

export default httpServer