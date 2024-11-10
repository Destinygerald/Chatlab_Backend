import { createServer } from 'http'
import httpServer from './server.js'
import { connectDatabase } from './database/schema.js'
import 'dotenv/config.js'

// Environment constants
const PORT = process.env.PORT 


connectDatabase()

httpServer.listen(PORT, () => {
	console.log('Listening to Port ', PORT)
})
