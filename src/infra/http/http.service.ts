import express from 'express'
import http from 'http'
import { getMessagesBetweenUsers } from '../database/models/message.model'
import { DbMongoService } from '../database/mongo.service'
export class HttpService {
  private app: express.Application
  http: http.Server
  routes: any
  dbservice: DbMongoService
  constructor() {
    this.app = express()
    this.app.use(express.json())
    this.http = http.createServer(this.app)
    this.setRoutes()
    this.dbservice = DbMongoService.getInstance()
  }
  public listen(port: number, callback: () => void) {
    this.http.listen(port, callback)
  }
  public setRoutes() {
    this.app.post('/register', (req, res) => {
      if (req.headers['x-api-key'] === process.env.ACCESS_TOKEN) {
        const { name, email, password } = req.body
        this.dbservice
          .getUserModel()
          .create({ name, email, password })
          .then(() => {
            res.status(201).send('User created')
          })
          .catch((err) => {
            res.status(500).send('Error creating user')
          })
      } else {
        res.status(401).send('Invalid token')
      }
    })
    this.app.get('/personalMessages', (req, res) => {
      if (req.headers['x-api-key'] === process.env.ACCESS_TOKEN) {
        const { emailA, emailB } = req.body
        if (!emailA || !emailB) {
          return res.status(400).send('Both emailA and emailB are required')
        }
        this.dbservice
          .getUserModel()
          .findOne({ email: emailA })
          .then((userA) => {
            if (!userA) {
              res.status(404).send('User A not found')
              return Promise.reject('User A not found')
            }
            return getMessagesBetweenUsers(emailA as string, emailB as string)
          })
          .then((messages) => {
            res.status(200).json(messages)
          })
          .catch((err) => {
            console.error('Error fetching messages:', err)
            res.status(500).send('Error fetching messages')
          })
      } else {
        res.status(401).send('Invalid token')
      }
    })
  }
}
