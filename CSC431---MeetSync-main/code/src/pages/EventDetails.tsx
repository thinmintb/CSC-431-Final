import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Clock, MessageCircle, Users, ThumbsUp, ThumbsDown, Trash2 } from 'lucide-react';
import { useEvents } from '../contexts/EventContext';
import { useAuth } from '../contexts/AuthContext';
import AvailabilityPoll from '../components/AvailabilityPoll';
import EventChat from '../components/EventChat';
import { formatDateTime } from '../utils/dateUtils';

const EventDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { events, deleteEvent } = useEvents();
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'details' | 'poll' | 'chat'>('details');
  
  const event = events.find(e => e.id === id);
  
  if (!event) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Event not found</h2>
        <p className="mt-2 text-gray-600">The event you're looking for doesn't exist or has been deleted.</p>
        <button
          onClick={() => navigate('/calendar')}
          className="mt-4 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Back to Calendar
        </button>
      </div>
    );
  }
  
  const handleDeleteEvent = () => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      deleteEvent(event.id);
      navigate('/calendar');
    }
  };
  
  const isCreator = event.createdBy === currentUser?.uid;
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-start">
            <h1 className="text-2xl font-bold text-gray-900">{event.title}</h1>
            
            {isCreator && (
              <button
                onClick={handleDeleteEvent}
                className="text-red-500 hover:text-red-700"
                aria-label="Delete event"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            )}
          </div>
          
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center text-gray-700">
              <Calendar className="h-5 w-5 mr-2 text-gray-500" />
              <span>{formatDateTime(new Date(event.startTime))}</span>
            </div>
            
            <div className="flex items-center text-gray-700">
              <Clock className="h-5 w-5 mr-2 text-gray-500" />
              <span>
                {formatDateTime(new Date(event.startTime), true)} - {formatDateTime(new Date(event.endTime), true)}
              </span>
            </div>
          </div>
          
          <div className="mt-6">
            <p className="text-gray-700">{event.description}</p>
          </div>
          
          <div className="mt-6 flex border-b border-gray-200">
            <button
              className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'details'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('details')}
            >
              Details
            </button>
            <button
              className={`ml-8 pb-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'poll'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('poll')}
            >
              Availability Poll
            </button>
            <button
              className={`ml-8 pb-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'chat'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('chat')}
            >
              Chat
            </button>
          </div>
        </div>
        
        <div className="p-6 pt-0">
          {activeTab === 'details' && (
            <div className="mt-6">
              <h2 className="text-lg font-medium text-gray-900 mb-3">Participants</h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center mb-4">
                  <Users className="h-5 w-5 text-gray-500 mr-2" />
                  <span className="text-sm text-gray-700">
                    {event.participants.length} participant{event.participants.length !== 1 ? 's' : ''}
                  </span>
                </div>
                
                <div className="space-y-3">
                  {event.participants.map((participant, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-medium">
                          {/* In a real app, this would use the user's initials or profile picture */}
                          {participant.userId.charAt(0).toUpperCase()}
                        </div>
                        <span className="ml-2 text-sm font-medium text-gray-700">
                          {/* In a real app, this would use the user's name */}
                          User {participant.userId}
                        </span>
                      </div>
                      
                      <div className="flex items-center">
                        {participant.status === 'accepted' && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <ThumbsUp className="h-3 w-3 mr-1" />
                            Accepted
                          </span>
                        )}
                        {participant.status === 'declined' && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            <ThumbsDown className="h-3 w-3 mr-1" />
                            Declined
                          </span>
                        )}
                        {participant.status === 'pending' && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            Pending
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {event.bestTime && (
                <div className="mt-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-3">Best Meeting Time</h2>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <ThumbsUp className="h-5 w-5 text-green-500 mr-2" />
                      <span className="text-sm font-medium text-green-700">
                        The best time for this meeting is:
                      </span>
                    </div>
                    <div className="mt-2 text-green-800 font-medium">
                      {formatDateTime(new Date(event.bestTime.day))} at {event.bestTime.startTime}
                    </div>
                    <div className="mt-1 text-sm text-green-600">
                      {event.bestTime.attendees} of {event.participants.length} participants can attend at this time.
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'poll' && (
            <div className="mt-6">
              <AvailabilityPoll event={event} />
            </div>
          )}
          
          {activeTab === 'chat' && (
            <div className="mt-6">
              <EventChat eventId={event.id} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventDetails;