import React, { useState } from 'react';

interface LoginProps {
    onAuth: () => void;
    onToggle: () => void;
}

const Login: React.FC<LoginProps> = ({ onAuth, onToggle }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string>('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:4000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            const data = await res.json();
            if (res.ok) {
                localStorage.setItem('token', data.token);
                onAuth();
            } else {
                setError(data.message || 'Ошибка аутентификации');
            }
        } catch (err) {
            setError('Ошибка сервера');
        }
    };

    return (
        <div className="auth-form">
            <h2>Вход</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Имя пользователя"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Пароль"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Войти</button>
            </form>
            {error && <p className="error">{error}</p>}
            <p>
                Нет аккаунта? <button onClick={onToggle}>Зарегистрироваться</button>
            </p>
        </div>
    );
};

export default Login;
