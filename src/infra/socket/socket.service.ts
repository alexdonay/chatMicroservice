import { Server, Socket } from 'socket.io'
import { ChatHandler } from '../../chatHandler'
import { DbMongoService } from '../database/mongo.service'

function validateToken(token?: string): boolean {
  return token === process.env.ACCESS_TOKEN
}

export class SocketService {
  private io: Server
  private userList: Map<string | string[] | undefined, string>
  private dbservice: DbMongoService
  constructor(
    io: Server,
    userList: Map<string | string[] | undefined, string>
  ) {
    this.io = io
    this.userList = userList
    this.listenSocket()
    this.dbservice = DbMongoService.getInstance()
  }

  private async listenSocket() {
    this.io.use(async (socket, next) => {
      const token = socket.handshake.headers['x-api-key']?.toString()
      const userEmail = socket.handshake.headers['x-user-email']?.toString()
      const userEmailBd = await this.dbservice
        .getUserModel()
        .countDocuments({ email: userEmail })
      if (userEmailBd > 0) {
        return next()
      }
      console.log('Invalid token, disconnecting user')
      socket.disconnect(true)
    })

    this.io.on('connection', (socket: Socket) => {
      const userEmail = socket.handshake.headers['x-user-email']?.toString()
      this.userList.set(userEmail, socket.id)
      new ChatHandler(this.io, socket, this.userList)
    })
  }
}
