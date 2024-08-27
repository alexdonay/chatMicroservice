import { Server, Socket } from 'socket.io'
import { ChatHandler } from '../../chatHandler'
import { authService } from '../auth/auth.service'
import { HttpService } from '../http/http.service'

export class SocketService {
  private readonly httpService: HttpService
  private readonly io: Server
  private readonly connectedUsers: Map<string, string> = new Map()

  constructor(httpService: HttpService) {
    this.httpService = httpService
    this.io = new Server(this.httpService.http)
    this.listenSocket()
  }

  private async listenSocket() {
    this.io.use(async (socket, next) => {
      try {
        const userEmail = socket.handshake.headers['x-user-email'] as string
        const apiKey = socket.handshake.headers['x-api-key'] as string
        const isAuthenticated = await authService(userEmail, apiKey)
        if (isAuthenticated) {
          return next()
        } else {
          console.log('Autenticação falhou para o email:', userEmail)
          return socket.disconnect(true)
        }
      } catch (error) {
        console.error('Erro durante a autenticação:', error)
        return socket.disconnect(true)
      }
    })

    this.io.on('connection', (socket: Socket) => {
      const userEmail = socket.handshake.headers['x-user-email'] as string
      this.connectedUsers.set(userEmail, socket.id)
      new ChatHandler(this.io, socket, this.connectedUsers)
      this.io.emit('userList', Array.from(this.connectedUsers.keys()))
      socket.on('disconnect', () => {
        this.connectedUsers.delete(userEmail)
        this.io.emit('userList', Array.from(this.connectedUsers.keys()))
      })
    })
  }
}
