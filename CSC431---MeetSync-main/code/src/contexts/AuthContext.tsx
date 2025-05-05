import React, { createContext, useContext, useState, useEffect } from 'react';

// User type definition
type User = {
  uid: string;
  email: string | null;
  displayName: string | null;
};

// Context type definition
type AuthContextType = {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  updateProfile: (data: { displayName?: string; password?: string }) => Promise<void>;
};

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Test users for demo purposes
const testUsers = [
  {
    uid: '1',
    email: 'test@example.com',
    displayName: 'Test User',
    password: 'test123',
  },
  {
    uid: '2',
    email: 'demo@example.com',
    displayName: 'Demo User',
    password: 'demo123',
  },
];

// Auth Provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Simulate checking for existing user session
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);
  
  // Login function with test credentials
  const login = async (email: string, password: string) => {
    const user = testUsers.find(u => u.email === email && u.password === password);
    if (!user) {
      throw new Error('Invalid credentials');
    }
    
    const { password: _, ...userData } = user;
    setCurrentUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };
  
  // Logout function
  const logout = async () => {
    setCurrentUser(null);
    localStorage.removeItem('user');
  };
  
  // Register function (mock implementation)
  const register = async (email: string, password: string, name: string) => {
    // Check if user already exists
    if (testUsers.some(u => u.email === email)) {
      throw new Error('User already exists');
    }
    
    const newUser: User = {
      uid: Date.now().toString(),
      email,
      displayName: name,
    };
    
    setCurrentUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
  };
  
  // Update profile function (mock implementation)
  const updateProfile = async (data: { displayName?: string; password?: string }) => {
    if (!currentUser) return;
    
    const updatedUser = {
      ...currentUser,
      displayName: data.displayName || currentUser.displayName,
    };
    
    setCurrentUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };
  
  const value = {
    currentUser,
    login,
    logout,
    register,
    updateProfile,
  };
  
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

// Hook for using the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}