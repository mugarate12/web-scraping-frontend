import { io } from "socket.io-client"

// const url = process.env.NODE_ENV === 'development' ? 'http://localhost:3333' : String(process.env.PRODUCTION_BASE_URL)
const url = 'http://18.212.169.51:3333'
const socket = io(url)

export default socket