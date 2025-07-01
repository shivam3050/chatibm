import mongoose, { Schema } from "mongoose";

const messageSchema = new Schema({
  sender: {
    type: String,
    required: true
  },
  receiver: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  createdAt: {
    type: String,
    required: true
  }
},
//  { timestamps: true }
);

export const Message = mongoose.model("Message", messageSchema);
