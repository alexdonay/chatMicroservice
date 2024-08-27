import mongoose, { Document, Schema } from 'mongoose'

export interface IMessage extends Document {
  sender: string
  recipient: string
  message: string
  timestamp: Date
}

const MessageSchema: Schema = new Schema({
  sender: { type: String, required: true },
  recipient: { type: String, required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
})

export const MessageModel = mongoose.model<IMessage>('Message', MessageSchema)

export async function getMessagesBetweenUsers(userA: string, userB: string) {
  try {
    const messages = await MessageModel.aggregate([
      {
        $match: {
          $or: [
            { sender: userA, recipient: userB },
            { sender: userB, recipient: userA }
          ]
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'sender',
          foreignField: 'email',
          as: 'senderDetails'
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'recipient',
          foreignField: 'email',
          as: 'recipientDetails'
        }
      },
      {
        $unwind: '$senderDetails'
      },
      {
        $unwind: '$recipientDetails'
      },
      {
        $project: {
          message: 1,
          timestamp: 1,
          sender: '$senderDetails.name',
          recipient: '$recipientDetails.name'
        }
      },
      { $sort: { timestamp: 1 } }
    ]).exec()

    return messages
  } catch (error) {
    console.error('Error fetching messages:', error)
    return []
  }
}
