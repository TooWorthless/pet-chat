import React, { useState } from 'react';

interface RegisterProps {
    onAuth: () => void;
    onToggle: () => void;
}

const Register: React.FC<RegisterProps> = ({ onAuth, onToggle }) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string>('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:4000/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password })
            });
            const data = await res.json();
            if (res.ok) {
                if (data.token) {
                    localStorage.setItem('token', data.token);
                }
                onAuth();
            } else {
                setError(data.message || 'Ошибка регистрации');
            }
        } catch (err) {
            setError('Ошибка сервера');
        }
    };

    return (
        <div className="auth-form">
            <h2>Регистрация</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Имя пользователя"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    required
                />
                <input
                    type="email"
                    placeholder="Электронная почта"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Пароль"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Зарегистрироваться</button>
            </form>
            {error && <p className="error">{error}</p>}
            <p>
                Уже есть аккаунт? <button onClick={onToggle}>Войти</button>
            </p>
        </div>
    );
};

export default Register;
