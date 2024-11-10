import { getFriends, getChats, getFriend, getFriendInfo, getAllMyChats, getAllUsers, addFriend } from '../database/query.js'
import { uuidGen } from '../helpers/functions.js'

export async function chats (req, res) {
	const { id } = req.params

	const db_query_friend = await getFriend(res.user.id, id)

	if (!db_query_friend.rows[0]) {
		return res.status(404).json({
			status: 'Failed',
			message: 'Not in friend list'
		})
	}

	const db_query_chat = await getChats(res.user.id, id)

	return res.status(200).json({
		status: 'Success',
		data: db_query_chat.rows
	})

}

export async function allChats (req, res) {
	const db_query = await getAllMyChats(res.user.id)

	return res.status(200).json({
		status: 'Success',
		data: db_query.rows
	})
}


// loop through all users to get their info
async function FriendsInfo (id) {
	const db_query = await getFriendInfo(id)

	if (!db_query.rows[0]) return;

	return db_query.rows[0]
}

export async function friends (req, res) {
	const db_query = await getFriends(res.user.email)

	if (!db_query.rows[0]) {
		return res.status(200).json({
			status: 'Success',
			data: db_query.rows
		})
	}

	const data_res = []

	db_query.rows.forEach(friend => {
		const friend_info = FriendsInfo(friend.friend_id)
		friend_info.room_id = friend.room_id

		data_res.push(friend_info)
	})


	return res.status(200).json({
		status: 'Success',
		// data: db_query.rows[0]
	})
}

export async function people (req, res) {
	const db_query = await getAllUsers(res.user.id)

	return res.status(200).json({
		status: 'Success',
		data: db_query.rows
	})
}

export async function addToFriend (req, res) {
	const db_query = await getFriends(res.user.id, req.friend_id)

	if (db_query.rows[0]) {
		return res.status(401).json({
			status: 'Failed',
			message: 'Already friends'
		})
	}

	const room_id = uuidGen()

	const db_mutate_1 = await addFriend(res.user.id, req.friend_id, room_id)

	const db_query2 = await getFriends(req.friend_id, res.user.id)

	if (db_query2.rows[0]) {
		return res.status(401).json({
			status: 'Failed',
			message: 'Already friends'
		})
	}

	const db_mutate_2 = await addFriend(req.friend_id, res.user.id, room_id)

	return res.status(200).json({
		status: 'Success',
		message: 'New friend added'
	})

 }