import { io } from "socket.io-client"

// const url = process.env.NODE_ENV === 'development' ? 'http://localhost:3333' : String(process.env.PRODUCTION_BASE_URL)
const url = 'http://3.85.142.172:3333'
const urlDevelopment = 'http://localhost:3333'

const socket = io(urlDevelopment, {
  transports: ["websocket"]
})

export default socket
