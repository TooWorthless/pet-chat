import React from 'react';

interface OnlineUsersProps {
  users: string[];
}

const OnlineUsers: React.FC<OnlineUsersProps> = ({ users }) => {
  return (
    <div className="online-users">
      <h3>Онлайн пользователи</h3>
      <ul>
        {users.map((user, index) => (
          <li key={index}>{user}</li>
        ))}
      </ul>
    </div>
  );
};

export default OnlineUsers;
