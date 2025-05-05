import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, Users } from 'lucide-react';
import { Event } from '../types';
import { formatTime } from '../utils/dateUtils';

type EventCardProps = {
  event: Event;
};

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const startTime = new Date(event.startTime);
  const endTime = new Date(event.endTime);
  
  const formattedDate = startTime.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
  
  return (
    <Link 
      to={`/events/${event.id}`}
      className="block bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow p-4"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-medium text-gray-900 truncate">{event.title}</h3>
          
          <div className="mt-2 space-y-1">
            <div className="flex items-center text-sm text-gray-600">
              <Calendar className="h-4 w-4 mr-2 text-gray-400" />
              <span>{formattedDate}</span>
            </div>
            
            <div className="flex items-center text-sm text-gray-600">
              <Clock className="h-4 w-4 mr-2 text-gray-400" />
              <span>
                {formatTime(startTime)} - {formatTime(endTime)}
              </span>
            </div>
            
            <div className="flex items-center text-sm text-gray-600">
              <Users className="h-4 w-4 mr-2 text-gray-400" />
              <span>
                {event.participants.length} participant{event.participants.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>
        
        <div className="ml-4 flex-shrink-0">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex flex-col items-center justify-center text-blue-800">
            <span className="text-sm font-bold">{startTime.toLocaleDateString('en-US', { month: 'short' })}</span>
            <span className="text-xl font-bold leading-none">{startTime.getDate()}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;