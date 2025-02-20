import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage extends Document {
    sender: string;
    content: string;
    type: 'text' | 'image' | 'file' | 'emoji';
    createdAt: Date;
}

const MessageSchema: Schema = new Schema({
    sender: { type: String, required: true },
    content: { type: String, required: true },
    type: { type: String, enum: ['text', 'image', 'file', 'emoji'], default: 'text' }
}, { timestamps: true });

export default mongoose.model<IMessage>('Message', MessageSchema);
