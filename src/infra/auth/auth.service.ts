import 'dotenv/config'
import { UserModel } from '../database/models/user.model'

export async function authService(
  userMail: string,
  apiKey: string
): Promise<boolean> {
  try {
    const user = await UserModel.findOne({ email: userMail }).exec()
    console.log('User found:', user)
    const auth = process.env.ACCESS_TOKEN === apiKey
    return user !== null && auth
  } catch (error) {
    return false
  }
}
