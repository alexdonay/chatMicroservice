import { HttpService } from './infra/http/http.service'
import { SocketService } from './infra/socket/socket.service'

class App {
  httpService: HttpService = new HttpService()

  constructor() {
    new SocketService(this.httpService)
  }
}
const app = new App()
app.httpService.listen(3000, () => {
  console.log('Server running on port 3000')
})
