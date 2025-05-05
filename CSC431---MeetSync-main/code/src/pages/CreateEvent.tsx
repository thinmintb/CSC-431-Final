import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, Users } from 'lucide-react';
import { useEvents } from '../contexts/EventContext';
import UserSearchInput from '../components/UserSearchInput';
import TimeSlotSelector from '../components/TimeSlotSelector';

const CreateEvent = () => {
  const navigate = useNavigate();
  const { addEvent } = useEvents();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
  });
  const [invitedUsers, setInvitedUsers] = useState<{ id: string; name: string; email: string }[]>([]);
  const [timeSlots, setTimeSlots] = useState<{ day: string; startTime: string; endTime: string }[]>([]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleAddTimeSlot = (slot: { day: string; startTime: string; endTime: string }) => {
    setTimeSlots(prev => [...prev, slot]);
  };
  
  const handleRemoveTimeSlot = (index: number) => {
    setTimeSlots(prev => prev.filter((_, i) => i !== index));
  };
  
  const handleAddUser = (user: { id: string; name: string; email: string }) => {
    if (!invitedUsers.find(u => u.id === user.id)) {
      setInvitedUsers(prev => [...prev, user]);
    }
  };
  
  const handleRemoveUser = (userId: string) => {
    setInvitedUsers(prev => prev.filter(user => user.id !== userId));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const startTimeDate = new Date(`${formData.startDate}T${formData.startTime}`);
    const endTimeDate = new Date(`${formData.endDate}T${formData.endTime}`);
    
    const newEvent = {
      id: Date.now().toString(),
      title: formData.title,
      description: formData.description,
      startTime: startTimeDate.toISOString(),
      endTime: endTimeDate.toISOString(),
      createdBy: 'current-user-id',
      participants: invitedUsers.map(user => ({ userId: user.id, status: 'pending' })),
      timeSlots,
    };
    
    addEvent(newEvent);
    navigate(`/events/${newEvent.id}`);
  };
  
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Create New Event</h1>
      
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
        <div className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Event Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Team Meeting"
            />
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Discuss project updates and next steps..."
            ></textarea>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                <Calendar className="inline-block h-4 w-4 mr-1" />
                Start Date
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                required
                value={formData.startDate}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            
            <div>
              <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">
                <Clock className="inline-block h-4 w-4 mr-1" />
                Start Time
              </label>
              <input
                type="time"
                id="startTime"
                name="startTime"
                required
                value={formData.startTime}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            
            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                <Calendar className="inline-block h-4 w-4 mr-1" />
                End Date
              </label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                required
                value={formData.endDate}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            
            <div>
              <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">
                <Clock className="inline-block h-4 w-4 mr-1" />
                End Time
              </label>
              <input
                type="time"
                id="endTime"
                name="endTime"
                required
                value={formData.endTime}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Users className="inline-block h-4 w-4 mr-1" />
              Invite Participants
            </label>
            <UserSearchInput onSelectUser={handleAddUser} />
            
            {invitedUsers.length > 0 && (
              <div className="mt-2">
                <ul className="space-y-2">
                  {invitedUsers.map(user => (
                    <li key={user.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div>
                        <span className="font-medium">{user.name}</span>
                        <span className="text-sm text-gray-500 ml-2">{user.email}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveUser(user.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Add Time Slots for Polling
            </label>
            <TimeSlotSelector onAddTimeSlot={handleAddTimeSlot} />
            
            {timeSlots.length > 0 && (
              <div className="mt-2">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Added Time Slots:</h3>
                <ul className="space-y-2">
                  {timeSlots.map((slot, index) => (
                    <li key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div>
                        <span className="font-medium">{slot.day}</span>
                        <span className="text-sm text-gray-500 ml-2">
                          {slot.startTime} - {slot.endTime}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveTimeSlot(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-8 flex justify-end">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mr-4 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Create Event
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateEvent;