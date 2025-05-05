import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import CalendarGrid from '../components/CalendarGrid';
import EventCard from '../components/EventCard';
import { useEvents } from '../contexts/EventContext';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState<'month' | 'week'>('month');
  const { events } = useEvents();
  
  const goToPreviousPeriod = () => {
    const newDate = new Date(currentDate);
    if (currentView === 'month') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setDate(newDate.getDate() - 7);
    }
    setCurrentDate(newDate);
  };
  
  const goToNextPeriod = () => {
    const newDate = new Date(currentDate);
    if (currentView === 'month') {
      newDate.setMonth(newDate.getMonth() + 1);
    } else {
      newDate.setDate(newDate.getDate() + 7);
    }
    setCurrentDate(newDate);
  };
  
  const goToToday = () => {
    setCurrentDate(new Date());
  };
  
  const formatDateHeader = () => {
    if (currentView === 'month') {
      return currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    } else {
      const startOfWeek = new Date(currentDate);
      startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
      
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      
      return `${startOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
    }
  };
  
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-gray-900">Calendar</h1>
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setCurrentView('month')}
              className={`px-3 py-1 text-sm font-medium rounded ${
                currentView === 'month' ? 'bg-white shadow-sm' : 'text-gray-600'
              }`}
            >
              Month
            </button>
            <button
              onClick={() => setCurrentView('week')}
              className={`px-3 py-1 text-sm font-medium rounded ${
                currentView === 'week' ? 'bg-white shadow-sm' : 'text-gray-600'
              }`}
            >
              Week
            </button>
          </div>
        </div>
        
        <Link
          to="/events/create"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Event
        </Link>
      </div>
      
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">{formatDateHeader()}</h2>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={goToPreviousPeriod}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-600"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          
          <button
            onClick={goToToday}
            className="px-3 py-1 text-sm font-medium rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Today
          </button>
          
          <button
            onClick={goToNextPeriod}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-600"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-hidden">
        <CalendarGrid 
          date={currentDate} 
          view={currentView} 
          events={events}
        />
      </div>
      
      <div className="mt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-3">Upcoming Events</h3>
        <div className="space-y-3">
          {events.slice(0, 3).map(event => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Calendar;