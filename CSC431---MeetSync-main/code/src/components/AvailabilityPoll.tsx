import React, { useState } from 'react';
import { Check, X } from 'lucide-react';
import { Event } from '../types';
import { useEvents } from '../contexts/EventContext';
import { useAuth } from '../contexts/AuthContext';

type AvailabilityPollProps = {
  event: Event;
};

const AvailabilityPoll: React.FC<AvailabilityPollProps> = ({ event }) => {
  const { updateEventAvailability, calculateBestMeetingTime } = useEvents();
  const { currentUser } = useAuth();
  const [selectedSlots, setSelectedSlots] = useState<Record<string, 'available' | 'unavailable' | 'maybe'>>({});
  
  if (!event.timeSlots || event.timeSlots.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-gray-600">No time slots have been added for this event.</p>
      </div>
    );
  }
  
  const handleAvailabilityChange = (slotIndex: number, availability: 'available' | 'unavailable' | 'maybe') => {
    setSelectedSlots(prev => ({
      ...prev,
      [slotIndex]: availability,
    }));
  };
  
  const handleSubmitAvailability = () => {
    if (Object.keys(selectedSlots).length === 0) {
      alert('Please select your availability for at least one time slot.');
      return;
    }
    
    updateEventAvailability(event.id, currentUser!.uid, selectedSlots);
    calculateBestMeetingTime(event.id);
    alert('Your availability has been submitted!');
  };
  
  // Get existing availability for the current user
  const existingAvailability = event.availability?.find(a => a.userId === currentUser?.uid);
  
  return (
    <div>
      <div className="mb-4">
        <h2 className="text-lg font-medium text-gray-900">Availability Poll</h2>
        <p className="text-sm text-gray-600 mt-1">
          Select your availability for each proposed time slot.
        </p>
      </div>
      
      <div className="bg-white border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Time
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Your Availability
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Group Availability
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {event.timeSlots.map((slot, index) => {
                const date = new Date(slot.day);
                const formattedDate = date.toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                });
                
                // Get the current availability value for this slot
                const currentAvailability = selectedSlots[index] || 
                  (existingAvailability?.slots[index] || 'unavailable');
                
                // Get group availability for this slot
                const totalResponses = event.availability?.filter(a => a.slots[index])?.length || 0;
                const availableCount = event.availability?.filter(a => a.slots[index] === 'available')?.length || 0;
                const maybeCount = event.availability?.filter(a => a.slots[index] === 'maybe')?.length || 0;
                
                return (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formattedDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {slot.startTime} - {slot.endTime}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={() => handleAvailabilityChange(index, 'available')}
                          className={`p-2 rounded-full ${
                            currentAvailability === 'available'
                              ? 'bg-green-100 text-green-700 ring-2 ring-green-600'
                              : 'bg-gray-100 text-gray-700 hover:bg-green-50 hover:text-green-700'
                          }`}
                          title="Available"
                        >
                          <Check className="h-5 w-5" />
                        </button>
                        
                        <button
                          type="button"
                          onClick={() => handleAvailabilityChange(index, 'unavailable')}
                          className={`p-2 rounded-full ${
                            currentAvailability === 'unavailable'
                              ? 'bg-red-100 text-red-700 ring-2 ring-red-600'
                              : 'bg-gray-100 text-gray-700 hover:bg-red-50 hover:text-red-700'
                          }`}
                          title="Unavailable"
                        >
                          <X className="h-5 w-5" />
                        </button>
                        
                        <button
                          type="button"
                          onClick={() => handleAvailabilityChange(index, 'maybe')}
                          className={`p-2 rounded-full ${
                            currentAvailability === 'maybe'
                              ? 'bg-yellow-100 text-yellow-700 ring-2 ring-yellow-600'
                              : 'bg-gray-100 text-gray-700 hover:bg-yellow-50 hover:text-yellow-700'
                          }`}
                          title="Maybe"
                        >
                          <span className="text-sm font-medium">?</span>
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {totalResponses > 0 ? (
                        <div className="text-sm">
                          <div className="flex items-center">
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                              <div 
                                className="bg-green-600 h-2.5 rounded-full" 
                                style={{ width: `${(availableCount / event.participants.length) * 100}%` }}
                              ></div>
                            </div>
                            <span className="ml-2 text-xs text-gray-600">
                              {availableCount}/{event.participants.length}
                            </span>
                          </div>
                          <div className="mt-1 text-xs text-gray-500">
                            {availableCount} available, {maybeCount} maybe
                          </div>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-500">No responses yet</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="mt-6 flex justify-end">
        <button
          type="button"
          onClick={handleSubmitAvailability}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Submit Availability
        </button>
      </div>
    </div>
  );
};

export default AvailabilityPoll;