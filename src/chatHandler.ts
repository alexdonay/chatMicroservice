import 'dotenv/config'
import { Server, Socket } from 'socket.io'
export class ChatHandler {
  private io: Server
  private socket: Socket
  private userList: string[]

  constructor(io: Server, socket: Socket, userList: string[]) {
    this.io = io
    this.socket = socket
    this.userList = userList

    this.registerEvents()
  }

  private registerEvents() {
    this.userList.push(this.socket.id)
    this.io.emit('userList', {
      userList: this.userList,
      thisUserId: this.socket.id
    })

    this.socket.on('privateMessage', (msg) => {
      msg = JSON.parse(msg)
      const apiKey = this.socket.handshake.headers['x-api-key']
      const userId = this.socket.handshake.headers['x-user-id']
      console.log(userId)
      if (apiKey === process.env['ACCESS_TOKEN']) {
        const recipientId = msg.recipientId
        const message = msg.message
        if (!this.userList.includes(recipientId)) {
          this.io.to(this.socket.id).emit('message', {
            from: 'server',
            message: 'Recipient not found' + recipientId
          })
        } else {
          this.io.to(recipientId).emit('message', {
            from: this.socket.id,
            message: message
          })
        }
      } else {
        console.log('Invalid token, disconnecting user')
        this.socket.disconnect(true)
      }
    })

    this.socket.on('disconnect', () => {
      const index = this.userList.indexOf(this.socket.id)
      if (index !== -1) {
        this.userList.splice(index, 1)
      }
      console.log(`User ${this.socket.id} disconnected`)
      this.io.emit('userList', { userList: this.userList })
    })
  }
}
