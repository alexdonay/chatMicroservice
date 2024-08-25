import { Server, Socket } from 'socket.io'
import { ChatHandler } from '../../chatHandler'

function validateToken(token?: string): boolean {
  return token === process.env.ACCESS_TOKEN
}

export class SocketService {
  private io: Server
  private userList: string[]

  constructor(io: Server, userList: string[]) {
    this.io = io
    this.userList = userList
    this.listenSocket()
  }

  private listenSocket() {
    this.io.use((socket, next) => {
      const token = socket.handshake.headers['x-api-key']?.toString()
      if (validateToken(token)) {
        return next()
      }
      console.log('Invalid token, disconnecting user')
      socket.disconnect(true)
    })

    this.io.on('connection', (socket: Socket) => {
      const userId = socket.handshake.headers['x-user-id']
      console.log(userId)
      new ChatHandler(this.io, socket, this.userList)
    })
  }
}
