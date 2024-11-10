import { jwtVerify } from './functions.js'
import {  getUserProfile } from '../database/query.js'


// Use this instead of the try-catch block
export async function errorHandler (err, req, res, next) {
	console.log(err.stack)
	res.status(500).json({
		status: 'Server Error',
		message: err.message
	})
}

// Authenticate user to protect route
export async function authUser (req, res, next) {

	const allowedRoutes = []

	const { authtoken } = req.cookies;

	if (!authtoken) {
		return res.status(401).json({
			status: 'Failed',
			message: 'Invalid Credentials'
		})
	}
	
	const decryptToken = await jwtVerify(authtoken)

	if (!decryptToken) {
		return res.status(401).json({
			status: 'Failed',
			message: 'Invalid token, login again'
		})
	}

	// check if user is on our database
	const db_query = await getUserProfile(decryptToken.email)

	// console.log(decryptToken)

	if (!db_query.rows[0]) {
		return res.status(404).json({
			status: 'Failed',
			message: 'Not found across database'
		})	
	}

	res.user = decryptToken
	
	next()
	
}

export function socketMiddleware(socket, next) {
	const userId = socket.handshake.auth.userId;

	if (!userId) { 
		return next( new Error('Invalid Credentials, Login again') ) 
	}

	//********* Add to Frontend *********
	// socket.auth = {  userId -- userId should be gotten after login or signup }
    // socket.connect();

    next()
}