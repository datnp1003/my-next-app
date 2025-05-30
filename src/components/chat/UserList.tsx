import { useState } from 'react';

interface User {
  id: number;
  name: string;
  lastMessage?: string;
  unreadCount: number;
  isOnline?: boolean;
  lastSeen?: Date;
}

interface UserListProps {
  users: User[];
  onSelectUser: (userId: number) => void;
  selectedUserId?: number | null;
}

export function UserList({ users, onSelectUser, selectedUserId }: UserListProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-72 border-r bg-white flex flex-col h-full">
      {/* Search bar */}
      <div className="p-3 border-b">
        <input
          type="text"
          placeholder="Tìm kiếm người dùng..."
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Users list */}
      <div className="flex-1 overflow-y-auto">
        {filteredUsers.map(user => (
          <button
            key={user.id}
            onClick={() => onSelectUser(user.id)}
            className={`w-full text-left p-3 border-b hover:bg-gray-50 flex items-start space-x-3 ${
              selectedUserId === user.id ? 'bg-sky-50' : ''
            }`}
          >
            {/* Avatar */}
            <div className="relative">
              <div className="w-10 h-10 bg-sky-100 rounded-full flex items-center justify-center">
                <span className="text-sky-600 font-medium">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
              {user.isOnline && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full">
                </div>
              )}
            </div>

            {/* User info */}
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start">
                <span className="font-medium truncate">{user.name}</span>
                {user.unreadCount > 0 && (
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    {user.unreadCount}
                  </span>
                )}
              </div>
              {user.lastMessage && (
                <p className="text-sm text-gray-500 truncate">
                  {user.lastMessage}
                </p>
              )}
              {user.lastSeen && !user.isOnline && (
                <p className="text-xs text-gray-400">
                  {user.lastSeen.toLocaleTimeString()}
                </p>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
