import { Server } from 'socket.io'
import { HttpService } from './infra/http/http.service'
import { SocketService } from './infra/socket/socket.service'

class App {
  private io: Server
  private userList: string[] = []
  httpService: HttpService = new HttpService()

  constructor() {
    this.io = new Server(this.httpService.http)
    new SocketService(this.io, this.userList)
  }
}

const app = new App()
app.httpService.listen(3000, () => {
  console.log('Server running on port 3000')
})
