import React, { useState, useEffect, useRef } from 'react';
import { Send } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

type Message = {
  id: string;
  eventId: string;
  userId: string;
  userName: string;
  text: string;
  timestamp: string;
};

type EventChatProps = {
  eventId: string;
};

// Mock messages - in a real app, these would come from a database
const mockMessages: Message[] = [
  {
    id: '1',
    eventId: '1',
    userId: '1',
    userName: 'Alex Johnson',
    text: 'Hi everyone! Looking forward to our meeting.',
    timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
  },
  {
    id: '2',
    eventId: '1',
    userId: '2',
    userName: 'Sarah Williams',
    text: 'Me too! I have some great ideas to share.',
    timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
  },
  {
    id: '3',
    eventId: '1',
    userId: '3',
    userName: 'Michael Brown',
    text: 'Should we prepare anything specific before the meeting?',
    timestamp: new Date(Date.now() - 1800000).toISOString(), // 30 minutes ago
  },
];

const EventChat: React.FC<EventChatProps> = ({ eventId }) => {
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // In a real app, you would fetch messages from an API/database
  useEffect(() => {
    // Simulate loading messages
    setMessages(mockMessages.filter(msg => msg.eventId === eventId));
  }, [eventId]);
  
  // Scroll to bottom of messages when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !currentUser) return;
    
    const message: Message = {
      id: Date.now().toString(),
      eventId,
      userId: currentUser.uid,
      userName: currentUser.displayName || 'User',
      text: newMessage.trim(),
      timestamp: new Date().toISOString(),
    };
    
    setMessages(prev => [...prev, message]);
    setNewMessage('');
  };
  
  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    
    // If the message is from today, show only the time
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    }
    
    // If the message is from this year, show the month and day
    if (date.getFullYear() === now.getFullYear()) {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
    
    // Otherwise, show the full date
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };
  
  return (
    <div className="flex flex-col h-[500px] bg-gray-50 border rounded-lg overflow-hidden">
      <div className="p-4 bg-white border-b">
        <h2 className="text-lg font-medium text-gray-900">Event Chat</h2>
        <p className="text-sm text-gray-600">
          Discuss the event with other participants
        </p>
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-4">
          {messages.map(message => {
            const isCurrentUser = message.userId === currentUser?.uid;
            
            return (
              <div 
                key={message.id} 
                className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    isCurrentUser 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-white border border-gray-200 text-gray-800'
                  }`}
                >
                  {!isCurrentUser && (
                    <div className="font-medium text-sm mb-1">
                      {message.userName}
                    </div>
                  )}
                  <div>{message.text}</div>
                  <div 
                    className={`text-xs mt-1 text-right ${
                      isCurrentUser ? 'text-blue-100' : 'text-gray-500'
                    }`}
                  >
                    {formatMessageTime(message.timestamp)}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      <div className="p-4 bg-white border-t">
        <form onSubmit={handleSendMessage} className="flex">
          <input
            type="text"
            value={newMessage}
            onChange={e => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 border border-gray-300 rounded-l-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-400"
          >
            <Send className="h-5 w-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default EventChat;