import React, { createContext, useContext, useState, useEffect } from 'react';
import { Event } from '../types';

// Sample events data
const sampleEvents: Event[] = [
  {
    id: '1',
    title: 'Team Weekly Sync',
    description: 'Weekly team meeting to discuss project progress and blockers.',
    startTime: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
    endTime: new Date(Date.now() + 86400000 + 3600000).toISOString(), // Tomorrow + 1 hour
    createdBy: '1',
    participants: [
      { userId: '1', status: 'accepted' },
      { userId: '2', status: 'accepted' },
      { userId: '3', status: 'pending' },
    ],
    timeSlots: [
      { day: new Date(Date.now() + 86400000).toISOString().split('T')[0], startTime: '10:00', endTime: '11:00' },
      { day: new Date(Date.now() + 172800000).toISOString().split('T')[0], startTime: '14:00', endTime: '15:00' },
    ],
    availability: [
      { userId: '1', slots: { 0: 'available', 1: 'unavailable' } },
      { userId: '2', slots: { 0: 'available', 1: 'maybe' } },
    ],
    bestTime: {
      day: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      startTime: '10:00',
      endTime: '11:00',
      attendees: 2,
    },
  },
  {
    id: '2',
    title: 'Product Review',
    description: 'Review the latest product designs and provide feedback.',
    startTime: new Date(Date.now() + 172800000).toISOString(), // Day after tomorrow
    endTime: new Date(Date.now() + 172800000 + 3600000).toISOString(), // Day after tomorrow + 1 hour
    createdBy: '2',
    participants: [
      { userId: '1', status: 'pending' },
      { userId: '2', status: 'accepted' },
      { userId: '4', status: 'accepted' },
    ],
    timeSlots: [],
  },
];

// Context type definition
type EventContextType = {
  events: Event[];
  addEvent: (event: Event) => void;
  updateEvent: (event: Event) => void;
  deleteEvent: (eventId: string) => void;
  updateEventAvailability: (eventId: string, userId: string, slots: Record<string, 'available' | 'unavailable' | 'maybe'>) => void;
  calculateBestMeetingTime: (eventId: string) => void;
};

// Create the context
const EventContext = createContext<EventContextType | undefined>(undefined);

// Event Provider component
export function EventProvider({ children }: { children: React.ReactNode }) {
  const [events, setEvents] = useState<Event[]>([]);
  
  // Initialize with sample events
  useEffect(() => {
    const storedEvents = localStorage.getItem('events');
    if (storedEvents) {
      setEvents(JSON.parse(storedEvents));
    } else {
      setEvents(sampleEvents);
      localStorage.setItem('events', JSON.stringify(sampleEvents));
    }
  }, []);
  
  // Save events to localStorage when they change
  useEffect(() => {
    if (events.length > 0) {
      localStorage.setItem('events', JSON.stringify(events));
    }
  }, [events]);
  
  // Add a new event
  const addEvent = (event: Event) => {
    setEvents([...events, event]);
  };
  
  // Update an existing event
  const updateEvent = (updatedEvent: Event) => {
    setEvents(events.map(event => (event.id === updatedEvent.id ? updatedEvent : event)));
  };
  
  // Delete an event
  const deleteEvent = (eventId: string) => {
    setEvents(events.filter(event => event.id !== eventId));
  };
  
  // Update availability for an event
  const updateEventAvailability = (
    eventId: string,
    userId: string,
    slots: Record<string, 'available' | 'unavailable' | 'maybe'>
  ) => {
    setEvents(
      events.map(event => {
        if (event.id !== eventId) return event;
        
        // Create a new availability array or use the existing one
        const availability = event.availability || [];
        
        // Find the user's existing availability or create a new one
        const userAvailabilityIndex = availability.findIndex(a => a.userId === userId);
        
        if (userAvailabilityIndex >= 0) {
          // Update existing availability
          const updatedAvailability = [...availability];
          updatedAvailability[userAvailabilityIndex] = {
            userId,
            slots,
          };
          
          return {
            ...event,
            availability: updatedAvailability,
          };
        } else {
          // Add new availability
          return {
            ...event,
            availability: [...availability, { userId, slots }],
          };
        }
      })
    );
  };
  
  // Calculate the best meeting time for an event
  const calculateBestMeetingTime = (eventId: string) => {
    setEvents(
      events.map(event => {
        if (event.id !== eventId || !event.availability || !event.timeSlots) {
          return event;
        }
        
        // Count available and maybe responses for each time slot
        const slotCounts = event.timeSlots.map((slot, index) => {
          const availableCount = event.availability?.filter(a => a.slots[index] === 'available').length || 0;
          const maybeCount = event.availability?.filter(a => a.slots[index] === 'maybe').length || 0;
          
          return {
            index,
            day: slot.day,
            startTime: slot.startTime,
            endTime: slot.endTime,
            availableCount,
            maybeCount,
            totalScore: availableCount + maybeCount * 0.5, // Weight maybe as half of available
          };
        });
        
        // Sort by total score (available + 0.5*maybe) descending
        slotCounts.sort((a, b) => b.totalScore - a.totalScore);
        
        // If there are scores, set the best time
        if (slotCounts.length > 0 && slotCounts[0].totalScore > 0) {
          const bestSlot = slotCounts[0];
          
          return {
            ...event,
            bestTime: {
              day: bestSlot.day,
              startTime: bestSlot.startTime,
              endTime: bestSlot.endTime,
              attendees: Math.round(bestSlot.totalScore), // Round to nearest whole number
            },
          };
        }
        
        return event;
      })
    );
  };
  
  const value = {
    events,
    addEvent,
    updateEvent,
    deleteEvent,
    updateEventAvailability,
    calculateBestMeetingTime,
  };
  
  return <EventContext.Provider value={value}>{children}</EventContext.Provider>;
}

// Hook for using the event context
export function useEvents() {
  const context = useContext(EventContext);
  if (context === undefined) {
    throw new Error('useEvents must be used within an EventProvider');
  }
  return context;
}