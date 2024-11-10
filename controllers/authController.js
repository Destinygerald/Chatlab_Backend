import { validateField, uuidGen, hashPassword, comparePassword, jwtSign } from '../helpers/functions.js'
import { addUser, getUserById, getUserByEmail, getUserProfile } from '../database/query.js'

// Register Controller
export async function register (req, res) {
	const { name, email, password } = req.body

	const NameRegex = `^[a-zA-Z0-9]{3,50}`
	const EmailRegex = `/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g`
	const PasswordRegex = `/^(?=.*[0-9])(?=.*[!@#$%^&*])(a-zA-Z0-9!@#$%^&*){6,16}$/`

	if ( !name || !email || !password ) {
		return res.status(401).json({
			status: 'Failed',
			message: 'Invalid Credentials'
		})
	}

	const checkName = validateField(name, NameRegex, 'Must contain 3 letters or more')
	const checkEmail = validateField(email, EmailRegex, 'Invalid email format')
	const checkPassword = validateField(password, PasswordRegex, 'Use a Strong password')


	if (checkName) {
		return res.status(401).json({
			status: 'Failed',
			message: checkName
		})
	}

	if (checkPassword) {
		return res.status(401).json({
			status: 'Failed',
			message: checkPassword
		})
	}

	if (checkEmail) {
		return res.status(401).json({
			status: 'Failed',
			message: checkEmail
		})
	}

	const id = uuidGen()

	const hashedPassword = await hashPassword(password)

	const db_check = await getUserByEmail(email.toLowerCase())

	if (db_check.rows[0]) {
		return res.status(400).json({
			status: 'Failed',
			message: 'Emial already exists'
		})
	}

	const db_insert = await addUser(id, name, hashedPassword, email.toLowerCase())

	const db_query = await getUserById(id)


	if (!db_query.rows[0]) {
		return res.status(400).json({
			status: 'Failed',
			message: 'Error Adding User'
		})
	}

	return res.status(201).json({
		status: 'Success',
		data: db_query.rows[0]
	})

}

// Login Controller
export async function login (req, res) {
	const { email, password } = req.body

	if (!email || !password) {
		return res.status(401).json({
			status: 'Failed',
			message: 'Invalid Credentials'
		})
	}

	const db_query = await getUserByEmail(email)

	if (!db_query.rows[0]) {
		return res.status(404).json({
			status: 'Failed',
			message: 'User not found'
		})
	}

	const confirmPassword = await comparePassword(password, db_query.rows[0].password)

	if (!confirmPassword) {
		return res.status(401).json({
			status: 'Failed',
			message: 'Invalid Credentials'
		})
	}

	const db_user = await getUserProfile(email)

	const authtoken = await jwtSign(db_user.rows[0])

	if (!authtoken) {
		return res.status(400).json({
			status: 'Failed',
			message: 'Failed to sign token'
		})
	}

	return res.status(200).cookie('authtoken', authtoken, { expires: new Date(Date.now() + (24 * 3600000))} ).json({
		status: 'Success',
		authtoken: authtoken,
		data: db_user.rows[0]
	})
}
