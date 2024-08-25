import 'dotenv/config'
import { Server, Socket } from 'socket.io'
export class ChatHandler {
  private io: Server
  private socket: Socket
  private userList: Map<string | string[] | undefined, string>

  constructor(
    io: Server,
    socket: Socket,
    userList: Map<string | string[] | undefined, string>
  ) {
    this.io = io
    this.socket = socket
    this.userList = userList

    this.registerEvents()
  }

  private registerEvents() {
    this.userList.set(
      this.socket.handshake.headers['x-user-id'],
      this.socket.id
    )
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
        const recipientEmail = msg.recipientEmail
        if (!this.userList.has(recipientEmail)) {
          this.io.to(this.socket.id).emit('message', {
            from: 'server',
            message: 'Recipient not found' + recipientEmail
          })
        } else {
          const recipientEmail = msg.recipientEmail
          const message = msg.message
          const recipientId = this.userList.get(recipientEmail)
          if (!recipientId) {
            this.io.to(this.socket.id).emit('privateMessage', {
              from: 'server',
              message: 'Recipient not found: ' + recipientEmail
            })
          } else {
            this.io.to(recipientId).emit('privateMessage', {
              from: this.socket.id,
              message: message
            })
          }
        }
      } else {
        console.log('Invalid token, disconnecting user')
        this.socket.disconnect(true)
      }
    })

    this.socket.on('disconnect', () => {
      const index = Array.from(this.userList.values()).indexOf(this.socket.id)
      if (index !== -1) {
        this.userList.delete(Array.from(this.userList.keys())[index])
      }
      console.log(`User ${this.socket.id} disconnected`)
      this.io.emit('userList', { userList: this.userList })
    })
  }
}
