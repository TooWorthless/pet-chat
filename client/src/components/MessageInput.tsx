import React, { useState, ChangeEvent } from 'react';
import EmojiPicker from './EmojiPicker';

interface MessageInputProps {
    onSend: (message: string, type?: string, fileUrl?: string) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSend }) => {
    const [message, setMessage] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (message.trim()) {
            onSend(message);
            setMessage('');
        }
    };

    const handleEmojiSelect = (emoji: string) => {
        setMessage(prev => prev + emoji);
    };

    const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('http://localhost:4000/api/upload', {
                method: 'POST',
                body: formData,
            });
            const data = await res.json();
            if (res.ok && data.fileUrl) {
                onSend('', 'file', data.fileUrl);
            }
        } catch (err) {
            console.error('File upload error:', err);
        }
    };

    return (
        <div className="message-input-wrapper">
            <form onSubmit={handleSubmit} className="message-input-form">
                <input
                    type="text"
                    placeholder="Введите сообщение..."
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                />
                <button type="submit">Отправить</button>
            </form>
            <div className="input-actions">
                <EmojiPicker onSelect={handleEmojiSelect} />
                <label className="file-upload-label">
                    📎
                    <input type="file" onChange={handleFileChange} style={{ display: 'none' }} />
                </label>
            </div>
        </div>
    );
};

export default MessageInput;
