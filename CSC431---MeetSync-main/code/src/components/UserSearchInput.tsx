import React, { useState } from 'react';
import { Search } from 'lucide-react';

// Mock user data - in a real app, this would come from an API
const mockUsers = [
  { id: '1', name: 'Alex Johnson', email: 'alex@example.com' },
  { id: '2', name: 'Sarah Williams', email: 'sarah@example.com' },
  { id: '3', name: 'Michael Brown', email: 'michael@example.com' },
  { id: '4', name: 'Emily Davis', email: 'emily@example.com' },
  { id: '5', name: 'David Miller', email: 'david@example.com' },
];

type User = {
  id: string;
  name: string;
  email: string;
};

type UserSearchInputProps = {
  onSelectUser: (user: User) => void;
};

const UserSearchInput: React.FC<UserSearchInputProps> = ({ onSelectUser }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<User[]>([]);
  const [showResults, setShowResults] = useState(false);
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (value.trim() === '') {
      setResults([]);
      return;
    }
    
    // Simple client-side search
    const filteredUsers = mockUsers.filter(
      user => 
        user.name.toLowerCase().includes(value.toLowerCase()) || 
        user.email.toLowerCase().includes(value.toLowerCase())
    );
    
    setResults(filteredUsers);
    setShowResults(true);
  };
  
  const handleSelectUser = (user: User) => {
    onSelectUser(user);
    setSearchTerm('');
    setResults([]);
    setShowResults(false);
  };
  
  return (
    <div className="relative">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          onFocus={() => setShowResults(true)}
          onBlur={() => setTimeout(() => setShowResults(false), 200)}
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder="Search users by name or email"
        />
      </div>
      
      {showResults && results.length > 0 && (
        <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md py-1 max-h-60 overflow-auto">
          {results.map(user => (
            <div
              key={user.id}
              onClick={() => handleSelectUser(user)}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
            >
              <div className="font-medium">{user.name}</div>
              <div className="text-sm text-gray-500">{user.email}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserSearchInput;