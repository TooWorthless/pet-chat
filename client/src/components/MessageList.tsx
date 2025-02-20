import React from 'react';

interface Message {
    sender: string;
    content: string;
    timestamp: string;
    type?: string;
}

interface MessageListProps {
    messages: Message[];
}

const MessageList: React.FC<MessageListProps> = ({ messages }) => {
    return (
        <div className="message-list">
            {messages.map((msg, index) => (
                <div key={index} className={`message ${msg.sender === 'system' ? 'system' : ''}`}>
                    <div className="message-info">
                        <span className="message-user">{msg.sender}</span>
                        <span className="message-timestamp">{new Date(msg.timestamp).toLocaleTimeString()}</span>
                    </div>
                    <div className="message-content">
                        {msg.type === 'file' ? (
                            <a href={msg.content} target="_blank" rel="noopener noreferrer">Смотреть файл</a>
                        ) : (
                            msg.content
                        )}
                    </div>

                </div>
            ))}
        </div>
    );
};


export default MessageList;
