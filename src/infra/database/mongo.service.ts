import mongoose from 'mongoose'
import { UserModel } from './models/user.model'

export class DbMongoService {
  private static instance: DbMongoService
  private dbUrl: string

  // Construtor privado para evitar instância direta
  private constructor() {
    this.dbUrl = process.env.DB_URL || 'mongodb://127.0.0.1:27017/webchat'
    this.connect()
  }

  // Método estático para obter a instância única
  public static getInstance(): DbMongoService {
    if (!DbMongoService.instance) {
      DbMongoService.instance = new DbMongoService()
    }
    return DbMongoService.instance
  }

  private async connect() {
    await mongoose
      .connect(this.dbUrl)
      .then(() => {
        console.log('Connected to database')
      })
      .catch((err) => {
        console.error('Error connecting to database:', err)
      })
  }

  public connection() {
    console.log('Returning connection')
    return mongoose.connection
  }

  public getUserModel() {
    return UserModel
  }
}
