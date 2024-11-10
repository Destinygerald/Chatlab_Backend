import pg from 'pg'
import 'dotenv/config.js'


export const client = new pg.Client({
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	host: process.env.DB_HOST,
	port: process.env.DB_PORT,
	database: process.env.DB_NAME,
})


function createSchema () {
	return new Promise((resolve, reject) => {
		client.query(`CREATE SCHEMA IF NOT EXISTS chatlab;`, (err, res) => {
			if (err) reject(err)
			resolve(res)
		})
	})
}

	
function dropSchema () {
	return new Promise((resolve, reject) => {
		client.query(`DROP SCHEMA chatlab CASCADE;`, (err, res) => {
			if (err) reject(err)
			resolve(res)
		})
	})
}

export async function connectDatabase () {
	client
		.connect()
		.then(() => {
			console.log('Connected to PostgreSQL database');
		})
		.catch((err) => {
			console.error('Error connecting to PostgreSQL database', err);
		});

	await dropSchema()
	await createSchema()

	client.query(`CREATE TABLE chatlab.user(
			id VARCHAR(50) PRIMARY KEY,
			name VARCHAR(50) NOT NULL,
			password TEXT NOT NULL,
			email VARCHAR(50) NOT NULL UNIQUE,
			last_seen TIMESTAMP,
			logged_in BOOLEAN DEFAULT false
			);`, 
		(err, res) => {
			if (err) {
				console.log('Failed to create table "user" ',err)
			} else {
				console.log('"user" Table Created ', res.rows)
			}
	})

	client.query(`CREATE TABLE chatlab.friend(
			id_key SERIAL,
			owner_id VARCHAR(50) NOT NULL,
			friend_id VARCHAR(50) NOT NULL,
			last_chat TIMESTAMP,
			room_id VARCHAR(50) NOT NULL UNIQUE,

			CONSTRAINT fk_owner_id FOREIGN KEY(owner_id) REFERENCES chatlab.user(id),
			CONSTRAINT fk_friend_id FOREIGN KEY(friend_id) REFERENCES chatlab.user(id)
		)`,
		(err, res) => {
			if (err) {
				console.log('Failed to create table "friend" ',err)
			} else {
				console.log('"friend" Table Created ', res.rows)
			}
	}) 
		

	client.query(`CREATE TABLE chatlab.message(
			message_id VARCHAR(50) PRIMARY KEY,
			sender VARCHAR(50) NOT NULL,
			receiver VARCHAR(50),
			room_id VARCHAR(50) NOT NULL,
			message TEXT,
			created TIMESTAMP DEFAULT now(),
			received BOOLEAN DEFAULT false,
			read BOOLEAN DEFAULT false,


			CONSTRAINT fk_sender FOREIGN KEY(sender) REFERENCES chatlab.user(id),
			CONSTRAINT fk_receiver FOREIGN KEY(receiver) REFERENCES chatlab.user(id),
			CONSTRAINT fk_room_id FOREIGN KEY(room_id) REFERENCES chatlab.friend(room_id)
		)`,
		(err, res) => {
			if (err) {
				console.log('Failed to create table "message" ',err)
			} else {
				console.log('"message" Table Created ', res.rows)
			}
	})

}