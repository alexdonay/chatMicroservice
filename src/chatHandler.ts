import { Server, Socket } from 'socket.io'
import { MessageModel } from './infra/database/models/message.model'

export class ChatHandler {
  private io: Server
  private socket: Socket
  private connectedUsers: Map<string, string>

  constructor(io: Server, socket: Socket, connectedUsers: Map<string, string>) {
    this.io = io
    this.socket = socket
    this.connectedUsers = connectedUsers
    this.registerEvents()
  }

  private registerEvents() {
    this.socket.on('privateMessage', async (msg) => {
      try {
        // Parse the message
        const parsedMsg = JSON.parse(msg)
        const recipientEmail = parsedMsg.recipientEmail
        const message = parsedMsg.message

        // Get the sender's info from the handshake headers
        const userEmail = this.socket.handshake.headers[
          'x-user-email'
        ] as string

        if (!userEmail) {
          throw new Error(
            'User ID is missing from the socket handshake headers.'
          )
        }
        const recipientSocketId = this.connectedUsers.get(recipientEmail)
        if (recipientSocketId) {
          this.io.to(recipientSocketId).emit('privateMessage', {
            from: userEmail,
            message: message
          })

          const newMessage = new MessageModel({
            sender: userEmail,
            recipient: recipientEmail,
            message: message,
            timestamp: new Date()
          })

          await newMessage.save()
          console.log('Message saved to database:', newMessage)
        } else {
          this.io.to(this.socket.id).emit('message', {
            from: 'server',
            message: `User with email ${recipientEmail} is not connected.`
          })
        }
      } catch (error) {
        console.error('Error processing privateMessage:', error)
        this.io.to(this.socket.id).emit('message', {
          from: 'server',
          message: 'Error processing your message'
        })
      }
    })

    this.socket.on('disconnect', () => {
      console.log(`Usuário ${this.socket.id} desconectou`)
    })
  }
}
