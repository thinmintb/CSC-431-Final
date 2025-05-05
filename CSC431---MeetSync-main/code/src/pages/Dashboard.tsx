import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, Plus, User } from 'lucide-react';
import { useEvents } from '../contexts/EventContext';
import { useAuth } from '../contexts/AuthContext';
import EventCard from '../components/EventCard';

const Dashboard = () => {
  const { events } = useEvents();
  const { currentUser } = useAuth();
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);
  const [pendingResponses, setPendingResponses] = useState<any[]>([]);
  
  useEffect(() => {
    // Filter for upcoming events
    const now = new Date();
    const upcoming = events
      .filter(event => new Date(event.startTime) > now)
      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
      .slice(0, 3);
    
    setUpcomingEvents(upcoming);
    
    // Filter for events with pending responses
    const pending = events.filter(event => {
      const participant = event.participants.find(p => p.userId === currentUser?.uid);
      return participant && participant.status === 'pending';
    });
    
    setPendingResponses(pending);
  }, [events, currentUser]);
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        
        <Link
          to="/events/create"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Event
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <div className="ml-5">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Upcoming Events</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Your next scheduled events
                </p>
              </div>
            </div>
            
            <div className="mt-6 space-y-4">
              {upcomingEvents.length > 0 ? (
                upcomingEvents.map(event => (
                  <EventCard key={event.id} event={event} />
                ))
              ) : (
                <p className="text-gray-500 text-sm py-4">
                  You don't have any upcoming events. 
                  <Link to="/events/create" className="text-blue-600 hover:text-blue-800 ml-1">
                    Create one now
                  </Link>
                </p>
              )}
              
              {upcomingEvents.length > 0 && (
                <div className="pt-2">
                  <Link
                    to="/calendar"
                    className="text-sm font-medium text-blue-600 hover:text-blue-800"
                  >
                    View all events
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-purple-500 rounded-md p-3">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <div className="ml-5">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Pending Responses</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Events that need your response
                </p>
              </div>
            </div>
            
            <div className="mt-6 space-y-4">
              {pendingResponses.length > 0 ? (
                pendingResponses.map(event => (
                  <div key={event.id} className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h4 className="font-medium text-yellow-800">{event.title}</h4>
                    <p className="text-sm text-yellow-700 mt-1">
                      Your response is needed for this event
                    </p>
                    <div className="mt-3">
                      <Link
                        to={`/events/${event.id}`}
                        className="text-sm font-medium text-yellow-800 hover:text-yellow-900"
                      >
                        Respond to invitation
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm py-4">
                  You have no pending event invitations.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
              <User className="h-6 w-6 text-white" />
            </div>
            <div className="ml-5">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Activity Summary</h3>
              <p className="mt-1 text-sm text-gray-500">
                Your recent event activity
              </p>
            </div>
          </div>
          
          <div className="mt-6">
            <dl className="grid grid-cols-1 gap-5 sm:grid-cols-3">
              <div className="bg-gray-50 overflow-hidden rounded-lg px-4 py-5 sm:p-6">
                <dt className="text-sm font-medium text-gray-500 truncate">Total Events</dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">{events.length}</dd>
              </div>
              
              <div className="bg-gray-50 overflow-hidden rounded-lg px-4 py-5 sm:p-6">
                <dt className="text-sm font-medium text-gray-500 truncate">Created By You</dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">
                  {events.filter(e => e.createdBy === currentUser?.uid).length}
                </dd>
              </div>
              
              <div className="bg-gray-50 overflow-hidden rounded-lg px-4 py-5 sm:p-6">
                <dt className="text-sm font-medium text-gray-500 truncate">Upcoming</dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">{upcomingEvents.length}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;