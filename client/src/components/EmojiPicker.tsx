import React, { useState, useRef, useEffect } from 'react';

interface EmojiPickerProps {
    onSelect: (emoji: string) => void;
}

const emojis = ['😀', '😂', '😍', '👍', '🎉', '😎', '😢', '🙌', '🤔', '🤩'];

const EmojiPicker: React.FC<EmojiPickerProps> = ({ onSelect }) => {
    const [visible, setVisible] = useState(false);
    const pickerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
                setVisible(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => { document.removeEventListener('mousedown', handleClickOutside); };
    }, []);

    return (
        <div className="emoji-picker-container" ref={pickerRef}>
            <button onClick={() => setVisible(!visible)} className="emoji-toggle-button">
                😊
            </button>
            {visible && (
                <div className="emoji-dropdown">
                    {emojis.map((emoji, index) => (
                        <span
                            key={index}
                            className="emoji-item"
                            onClick={() => { onSelect(emoji); setVisible(false); }}
                        >
                            {emoji}
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
};

export default EmojiPicker;
