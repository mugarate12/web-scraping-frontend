import { io } from "socket.io-client"

const url = 'http://localhost:3333'
const socket = io(url)

export default socket