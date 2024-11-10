import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { v4 as uuidV4 } from 'uuid'
import 'dotenv/config.js'

export function hashPassword (password) {
	return new Promise((resolve, reject) => {
		bcrypt.hash(password, 10, (err, hash) => {
			if (err) reject(err)
			resolve(hash)
		})
	})
}

export async function comparePassword(password, hash) {
	const match = await bcrypt.compare(password, hash)
	return match
}

export async function jwtSign (info) {
	const sign = await jwt.sign(info, process.env.SECRET)
	return sign
}

export async function jwtVerify (token) {
	const result = await jwt.verify(token, process.env.SECRET)
	return result
}

export function validateField (value, regex, message) {
	try {
		if (!value) {
			return ({
				field,
				message: "Must not be empty"
			})
		}
		let exp = new RegExp(regex)

		if (!exp.test(value)) {
			return ({
				field,
				message
			})
		}
	} catch (err) {
		return 
	}
}


export function uuidGen () {
	let id = uuidV4()
	return id;
}


function sendVerificationEmail (email) {
	
}
