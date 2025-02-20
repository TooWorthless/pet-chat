import React, { useState } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import Chat from './components/Chat';

const App: React.FC = () => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!localStorage.getItem('token'));
    const [showRegister, setShowRegister] = useState<boolean>(false);

    if (!isAuthenticated) {
        return (
            <div className="auth-container">
                {showRegister ? (
                    <Register onAuth={() => setIsAuthenticated(true)} onToggle={() => setShowRegister(false)} />
                ) : (
                    <Login onAuth={() => setIsAuthenticated(true)} onToggle={() => setShowRegister(true)} />
                )}
            </div>
        );
    }

    return <Chat />;
};

export default App;
