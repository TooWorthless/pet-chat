import React, { useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import OnlineUsers from './OnlineUsers';

interface Message {
    sender: string;
    content: string;
    timestamp: string;
    type?: string;
}

const Chat: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('token') || '';
        const newSocket = io('http://localhost:4000', {
            query: { token }
        });
        setSocket(newSocket);

        newSocket.on('chatMessage', (data: Message) => {
            
            setMessages(prev => [...prev, data]);
            console.log('messages :>> ', messages);

        });

        newSocket.on('userConnected', (data: { username: string }) => {
            setMessages(prev => [
                ...prev,
                { sender: 'system', content: `${data.username} вошёл в чат`, timestamp: new Date().toISOString() }
            ]);
        });

        newSocket.on('userDisconnected', (data: { username: string }) => {
            setMessages(prev => [
                ...prev,
                { sender: 'system', content: `${data.username} покинул чат`, timestamp: new Date().toISOString() }
            ]);
        });

        newSocket.on('onlineUsers', (users: string[]) => {
            setOnlineUsers(users);
        });

        return () => {
            newSocket.disconnect();
        };
    }, []);

    const sendMessage = (msg: string, type: string = 'text', fileUrl?: string) => {
        if (socket) {
            socket.emit('chatMessage', { message: msg, type, fileUrl });
            setMessages(prev => [
                ...prev,
                { sender: 'Вы', content: msg || fileUrl || '', timestamp: new Date().toISOString(), type }
            ]);
        }
    };

    return (
        <div className="chat-wrapper">
            <div className="chat-main">
                <MessageList messages={messages} />
                <MessageInput onSend={sendMessage} />
            </div>
            <OnlineUsers users={onlineUsers} />
        </div>
    );
};

export default Chat;
