import { jwtVerify } from '../helpers/functions.js'
import { getUserProfile } from '../database/query.js'

export async function getProfile (req, res) {
	const { authtoken } = req.cookies

	if (!authtoken) {
		return res.status(404).json({
			status: 'Failed',
			message: 'Auth token not found'
		})
	}

	const tokenRes = await jwtVerify(authtoken)

	if (!tokenRes) {
		return res.status(400).json({
			status: 'Failed',
			message: 'Invalid token'
		})
	}

	const getUser = await getUserProfile(tokenRes.email)

	if (!getUser.rows[0]) {
		return res.status(404).json({
			status: 'Failed',
			message: 'Invalid credential'
		})
	}

	return res.status(200).json({
		status: 'Success',
		data: getUser.rows[0]
	})

}