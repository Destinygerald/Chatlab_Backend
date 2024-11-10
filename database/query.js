import { client } from './schema.js'

// USER QUERY

export function addUser (id, name, password, email) {
	return new Promise((resolve, reject) => {
		client.query(`INSERT INTO 
						chatlab.user(id, name, password, email) 
						VALUES($1, $2, $3, $4)`, [id, name, password, email], 
		(err, res) => {
			if (err) reject(err)
			resolve(res)
		})
	})
}

export function getUserByEmail (email) {
	return new Promise((resolve, reject) => {
		client.query(`SELECT * FROM chatlab.user WHERE email=$1`, [email], (err, res) => {
			if (err) reject(err)
			resolve(res)
		})
	})
}

export function getUserById (id) {
	return new Promise((resolve, reject) => {
		client.query(`SELECT * FROM chatlab.user WHERE id=$1`, [id], (err, res) => {
			if (err) reject(err)
			resolve(res)
		})
	})
}

export function toggleLogin (loggedIn, id) {
	return new Promise((resolve, reject) => {
		client.query(`UPDATE chatlab.user SET logged_in=$1 WHERE id=$2`, [loggedIn, id], (err, res) => {
			if (err) reject(err);
			resolve(res)
		})
	})
}

export function getUserProfile (email) {
	return new Promise((resolve, reject) => {
		client.query(`SELECT id, name, email, logged_in FROM chatlab.user WHERE email=$1`, [email], (err, res) => {
			if (err) reject(err)
			resolve(res)
		})
	})
}

// FRIEND QUERY

export function getFriends (id) {
	return new Promise((resolve, reject) => {
		client.query(`SELECT * FROM chatlab.friend WHERE owner_id=$1`, [id], (err, res) => {
			if (err) reject(err)
			resolve(res)
		})
	})
}

export function getFriend (id, friendId) {
	return new Promise((resolve, reject) => {
		client.query(`SELECT * FROM chatlab.friend WHERE owner_id=$1 AND friend_id=$2`, [id, friendId], (err, res) => {
			if (err) reject(err)
			resolve(res)
		})
	})
}

export function getFriendInfo (id) {
	return new Promise((resolve, reject) => {
		client.query(`SELECT id, name, email, last_seen FROM chatlab.user WHERE id=$1`, [id], (err, res) => {
			if (err) reject(err)
			resolve(res)
		})
	})
}

export function friendOnline (friendId) {
	return new Promise((resolve, reject) => {
		client.query(`SELECT logged_in FROM chatlab.user WHERE id=$1`, [friendId], (err, res) => {
			if (err) reject(err);
			resolve(res)
		})
	})
}

export function getAllUsers (id) {
	return new Promise((resolve, reject) => {
		client.query(`SELECT id, name, email, logged_in, last_seen FROM chatlab.user WHERE id!=$1`, [id], (err, res) => {
			if (err) reject;
			resolve(res)
		})
	})
}


export function getChats (id, friendId) {
	return new Promise((resolve, reject) => {
		client.query(`SELECT * FROM chatlab.message WHERE sender=$1 AND receiver=$2`, [id, friendId], (err, res) => {
			if (err) reject(err)
			resolve(res)
		})
	})
}

export function getAllMyChats (id) {
	return new Promise((resolve, reject) => {
		client.query(`SELECT * FROM chatlab.message WHERE sender=$1 OR receiver=$1`, [id], (err, res) => {
			if (err) reject(err)
			resolve(res)
		})
	})
}

function getChatNotification (from, to) {
	
}

function findFriend (id) {

}

export function addFriend (id, friendId, roomId) {
	return new Promise((resolve, reject) => {
		client.query(`INSERT INTO 
			chatlab.friend(owner_id, friend_id, room_id) 
			VALUES($1, $2, $3)`, [id, friendId, roomId], 
			(err, res) => {
				if (err) reject (err)
				resolve(res)
			})
	})
}

// CHATS QUERY

export function addChat (from, to, message, roomId, messageId) {
	return new Promise((resolve, reject) => {
		client.query(`INSERT INTO chatlab.message(sender, receiver, room_id, message, message_id) VALUES($1, $2, $3, $4, $5)`, [from, to, roomId, message, messageId], (err, res) => {
			if (err) reject(err);
			resolve(res)
		})
	})
}

export function receivedChat (id) {
	return new Promise((resolve, reject) => {
		client.query(`UPDATE chatlab.message SET received=$1 WHERE message_id=$2`, [true, id], (err, res) => {
			if (err) reject(err);
			resolve(res)
		})
	})
}

export function readChat (id) {
	return new Promise((resolve, reject) => {
		client.query(`UPDATE chatlab.message SET read=$1 WHERE message_id=$2`, [true, id], (err, res) => {
			if (err) reject(err);
			resolve(res)
		})
	})
}

function clearChat (from, to, date) {

}