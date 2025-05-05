import React from 'react';
import { Link } from 'react-router-dom';
import { getMonthDays, getWeekDays, formatTime } from '../utils/dateUtils';
import { Event } from '../types';

type CalendarGridProps = {
  date: Date;
  view: 'month' | 'week';
  events: Event[];
};

const CalendarGrid: React.FC<CalendarGridProps> = ({ date, view, events }) => {
  const weekDayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  const renderMonthView = () => {
    const days = getMonthDays(date);
    const currentMonth = date.getMonth();
    
    return (
      <div className="grid grid-cols-7 gap-1 h-full">
        {weekDayNames.map((day) => (
          <div key={day} className="text-center py-2 font-medium text-gray-500 text-sm">
            {day}
          </div>
        ))}
        
        {days.map((day, index) => {
          const isCurrentMonth = day.getMonth() === currentMonth;
          const isToday = day.toDateString() === new Date().toDateString();
          const dayEvents = events.filter(event => {
            const eventDate = new Date(event.startTime);
            return eventDate.toDateString() === day.toDateString();
          });
          
          return (
            <div
              key={index}
              className={`min-h-[100px] border rounded-md p-1 ${
                isCurrentMonth 
                  ? 'bg-white' 
                  : 'bg-gray-50 text-gray-400'
              } ${
                isToday ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              <div className="flex justify-between items-start">
                <span className={`text-sm font-medium ${isToday ? 'text-blue-600' : ''}`}>
                  {day.getDate()}
                </span>
                {isCurrentMonth && dayEvents.length > 0 && (
                  <span className="text-xs font-medium text-gray-500">{dayEvents.length} event{dayEvents.length !== 1 ? 's' : ''}</span>
                )}
              </div>
              <div className="mt-1 space-y-1 overflow-y-auto max-h-20">
                {isCurrentMonth && dayEvents.slice(0, 3).map(event => (
                  <Link 
                    key={event.id} 
                    to={`/events/${event.id}`}
                    className="block text-xs p-1 rounded truncate bg-blue-100 text-blue-800"
                  >
                    {formatTime(new Date(event.startTime))} {event.title}
                  </Link>
                ))}
                {isCurrentMonth && dayEvents.length > 3 && (
                  <div className="text-xs text-gray-500 pl-1">
                    +{dayEvents.length - 3} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };
  
  const renderWeekView = () => {
    const days = getWeekDays(date);
    const hours = Array.from({ length: 24 }, (_, i) => i);
    
    return (
      <div className="flex flex-col h-full">
        <div className="grid grid-cols-8 border-b">
          <div className="border-r p-2"></div>
          {days.map((day, index) => {
            const isToday = day.toDateString() === new Date().toDateString();
            return (
              <div 
                key={index} 
                className={`text-center p-2 ${isToday ? 'bg-blue-50' : ''}`}
              >
                <div className="font-medium">{weekDayNames[day.getDay()]}</div>
                <div className={`text-sm ${isToday ? 'text-blue-600 font-medium' : ''}`}>
                  {day.getDate()}
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-8 divide-x h-full">
            <div className="divide-y">
              {hours.map(hour => (
                <div key={hour} className="h-16 text-xs text-gray-500 text-right pr-2 pt-1">
                  {hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`}
                </div>
              ))}
            </div>
            
            {days.map((day, dayIndex) => {
              const dayEvents = events.filter(event => {
                const eventDate = new Date(event.startTime);
                return eventDate.toDateString() === day.toDateString();
              });
              
              return (
                <div key={dayIndex} className="relative divide-y">
                  {hours.map(hour => (
                    <div key={hour} className="h-16"></div>
                  ))}
                  
                  {dayEvents.map(event => {
                    const startTime = new Date(event.startTime);
                    const endTime = new Date(event.endTime);
                    const startHour = startTime.getHours() + startTime.getMinutes() / 60;
                    const endHour = endTime.getHours() + endTime.getMinutes() / 60;
                    const duration = endHour - startHour;
                    
                    return (
                      <Link
                        key={event.id}
                        to={`/events/${event.id}`}
                        style={{
                          top: `${startHour * 4}rem`,
                          height: `${duration * 4}rem`,
                        }}
                        className="absolute inset-x-1 bg-blue-100 border border-blue-300 rounded p-1 overflow-hidden text-xs"
                      >
                        <div className="font-medium text-blue-800">{event.title}</div>
                        <div className="text-blue-600">
                          {formatTime(startTime)} - {formatTime(endTime)}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="bg-white border rounded-lg shadow-sm h-full overflow-hidden">
      {view === 'month' ? renderMonthView() : renderWeekView()}
    </div>
  );
};

export default CalendarGrid;