import React, { useState } from 'react';
import { Plus } from 'lucide-react';

type TimeSlotSelectorProps = {
  onAddTimeSlot: (slot: { day: string; startTime: string; endTime: string }) => void;
};

const TimeSlotSelector: React.FC<TimeSlotSelectorProps> = ({ onAddTimeSlot }) => {
  const [day, setDay] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  
  const handleAddSlot = () => {
    if (day && startTime && endTime) {
      onAddTimeSlot({ day, startTime, endTime });
      // Reset form
      setDay('');
      setStartTime('');
      setEndTime('');
    }
  };
  
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="day" className="block text-sm font-medium text-gray-700">
            Date
          </label>
          <input
            type="date"
            id="day"
            value={day}
            onChange={(e) => setDay(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        
        <div>
          <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">
            Start Time
          </label>
          <input
            type="time"
            id="startTime"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        
        <div>
          <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">
            End Time
          </label>
          <input
            type="time"
            id="endTime"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
      </div>
      
      <button
        type="button"
        onClick={handleAddSlot}
        disabled={!day || !startTime || !endTime}
        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        <Plus className="h-4 w-4 mr-1" />
        Add Time Slot
      </button>
    </div>
  );
};

export default TimeSlotSelector;