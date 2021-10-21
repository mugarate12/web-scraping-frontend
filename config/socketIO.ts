import { io } from "socket.io-client"

const url = process.env.NODE_ENV === 'development' ? 'http://localhost:3333' : String(process.env.PRODUCTION_BASE_URL)
const socket = io(url)

export default socket