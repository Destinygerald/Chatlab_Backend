import { uuidGen } from '../helpers/functions.js'
import { getFriends, getFriend, addChat, receivedChat, readChat, toggleLogin, addFriend, friendOnline } from '../database/query.js'

// Last seen should be called on each event - for safety purpose


export async function joinRoom (socket) {
	

	// console.log('user id1 ', socket)

	// Fetch all the friends user has
	const friendList = await getFriends(socket?.handshake?.auth?.userId)

	// Join all friends rooms
	friendList.rows.forEach((friend) => {
		socket.join(friend.room_id)
	})

	//Join he user's own private room
	socket.join(socket?.handshake?.auth?.userId)

	// get all messages from the rooms
	// get new messages
	// get new messages and display the notification dot
}


export async function newRoom (socket) {
	
	socket.on('new_friend', async({ friend_id }) => {

		const already_friend = await getFriend(socket?.handshake?.auth?.userId, friend_id)

		if (already_friend?.rows[0]) {
			return;
		}

		const room_id = uuidGen()

		socket.join(room_id)

		const friend_online = await friendOnline(friend_id)
		const db_mutate_1 = await addFriend(socket?.handshake?.auth?.userId, friend_id, room_id)
		const db_mutate_2 = await addFriend(friend_id, socket?.handshake?.auth?.userId, room_id)

		if (!friendOnline?.rows[0]) {
			return;
		}

		// emit to the friend personal private room
		// when the user receive this event, he joins the room
		socket.broadcast.to(friend_id).emit('new_friend_added', { room_id, id: socket?.handshake?.auth?.userId })


		// friend_socket.join(room_id)
	})

	
}


export async function sendMessage (socket) {

	socket.on('send_message', async({ message, recipientId, roomId }) => {
		
		const senderId = socket?.handshake?.auth?.userId

		const messageId = uuidGen() 
		
		const receiver = await getFriend(senderId, recipientId)

		const newMessage = await addChat(senderId, recipientId, message, roomId, messageId)

		if (!receiver?.rows[0]) return

		socket.broadcast.to(roomId).emit('new_message', { message, senderId, messageId })
	})
}


export async function receiveMessage (socket) {

	// *********** send event to double tick ********************
	// check if the user is online before emitting the receive_message
	// this should be emitted when the user is online for new messages
	// but it should also be called when the user just logged in for
	// previous messages

	socket.on('receive_message', async({ messageId, roomId }) => {

		const db_mutate = await receivedChat(messageId)

		// make an emit to show that the receive end has gotten the message
		
		socket.broadcast.to(roomId).emit('message_received', { messageId, roomId })
	})
}

export async function readMessage (socket) {
	// *********** send event for blue double tick **************
	// check for unread messages when the user enters the chat
	// this is emitted for all the unread messages in that chat
	// For the case of the user alreay being in the room, there 
	// is a check fir which room the user is in and if the user is online

	socket.on('read_message', async({ messageId, roomId }) => {

		// emit a message read event 

		socket.broadcast.to(roomId).emit('message_read', { messageId, roomId })

		const db_mutate = await readChat(messageId)
		
	})
}

export async function loggedIn (socket) {
	// *********** Handles user login **********
	// Gets emtited when user logs in on the app
	// should be called on the topmost useEffect with
	// no dependency

	socket.on('connected', async() => {
		await toggleLogin(true, socket.handshake.auth.userId)
		console.log('user connected')
		// joinRoom()
	})
}

export async function lastSeenTracker (socket) {
	// ********* Heartbeat to handler Online, last_seen... *********
	// emitted when user receives some events or makes some uses some
	// service in the frontend like receive_message, send_message, read_message or 
	// when the user switches the room
	// Should record the time of last service { for last_seen }
	// last seen should be displayed when the user emits disconnect

	socket.on('last_seen', async() => {
		// record the users last seen
	})
} 


export async function handleDisconnect(socket) {
	// get a list of all friends and  emit to them
	// set last seen to the time of disconnection

	const friendList = await getFriends(socket?.handshake?.auth?.userId)

	socket.on('disconnect', async({ room_id }) => {
		await toggleLogin(false, socket?.handshake?.auth?.userId)
		lastSeenTracker()

		// emit a logout event to notify all friends
		friendList.rows.forEach((friend) => {
			socket.broadcast.to(room_id).emit('logged_out', { userId: socket.handshake.auth.userId })
		})
		
	})
}