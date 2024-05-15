import { Schema, model, models, Document } from "mongoose";

export interface IMessage extends Document {
  role: string;
  parts: {
    text: string;
  }[];
  createdAt: Date;
}

export interface IChat extends Document {
  messages: IMessage[];
  user: string;
  createdAt: Date;
}

const MessageSchema = new Schema({
  role: {
    type: String,
    required: true,
  },
  parts: [
    {
      text: {
        type: String,
        required: true,
      },
    },
  ],
  createdAt: {
    type: Date,
    required: true,
  },
});

const ChatSchema = new Schema({
  messages: [MessageSchema],
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
  },
});

export const Chat = models.Chat || model<IChat>("Chat", ChatSchema);
export const Message = models.Message || model<IMessage>("Message", MessageSchema);