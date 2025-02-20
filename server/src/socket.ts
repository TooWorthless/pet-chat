import { Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import Message from './models/Message';

const onlineUsers: { [username: string]: number } = {};

export const socketHandler = (socket: Socket) => {
    const token = socket.handshake.query.token as string;
    if (!token) {
        socket.disconnect();
        return;
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        socket.data.user = decoded;
    } catch (err) {
        socket.disconnect();
        return;
    }

    const username = socket.data.user.username;
    onlineUsers[username] = (onlineUsers[username] || 0) + 1;

    socket.broadcast.emit('onlineUsers', Object.keys(onlineUsers));
    socket.emit('onlineUsers', Object.keys(onlineUsers));

    console.log(`User connected: ${username}`);
    socket.broadcast.emit('userConnected', { username });

    socket.on('chatMessage', async (data: { message: string; type?: string; fileUrl?: string }) => {
        console.log('message :>> ', data.message);
        console.log('type :>> ', data.type);
        console.log('fileUrl :>> ', data.fileUrl);

        const messageData = {
            sender: username,
            content: data.message,
            type: data.type || 'text'
        };
        if (data.fileUrl) {
            messageData.type = 'file';
            messageData.content = data.fileUrl;
        }

        const newMessage = new Message(messageData);
        await newMessage.save();
        
        socket.broadcast.emit('chatMessage', {
            ...messageData,
            timestamp: new Date().toISOString()
        });
    });

    socket.on('disconnect', () => {
        console.log(`User disconnected: ${username}`);
        if (onlineUsers[username]) {
            onlineUsers[username] -= 1;
            if (onlineUsers[username] <= 0) {
                delete onlineUsers[username];
            }
        }
        socket.broadcast.emit('onlineUsers', Object.keys(onlineUsers));
        socket.broadcast.emit('userDisconnected', { username });
    });
};
