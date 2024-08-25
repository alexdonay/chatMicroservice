import express from 'express'
import http from 'http'
export class HttpService {
  private app: express.Application
  http: http.Server
  routess: any
  constructor() {
    this.app = express()
    this.app.use(express.json())
    this.http = http.createServer(this.app)
    this.setRoutes()
  }
  public listen(port: number, callback: () => void) {
    this.http.listen(port, callback)
  }
  public setRoutes() {
    this.app.get('/', (req, res) => {
      res.send('Hello World')
    })
  }
}
