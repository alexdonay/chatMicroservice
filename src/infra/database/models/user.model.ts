import mongoose, { Document, Schema } from 'mongoose'

// Interface para o documento do usuário
export interface IUser extends Document {
  name: string
  email: string
  password: string
}

// Definindo o schema do usuário
const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
})

// Criando o modelo de usuário
export const UserModel = mongoose.model<IUser>('User', UserSchema)
