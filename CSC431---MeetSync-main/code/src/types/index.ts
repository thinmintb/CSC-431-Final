// Event types
export type Event = {
  id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  createdBy: string;
  participants: Participant[];
  timeSlots?: TimeSlot[];
  availability?: Availability[];
  bestTime?: {
    day: string;
    startTime: string;
    endTime: string;
    attendees: number;
  };
};

export type Participant = {
  userId: string;
  status: 'pending' | 'accepted' | 'declined';
};

export type TimeSlot = {
  day: string;
  startTime: string;
  endTime: string;
};

export type Availability = {
  userId: string;
  slots: Record<string, 'available' | 'unavailable' | 'maybe'>;
};

// User types
export type User = {
  id: string;
  name: string;
  email: string;
  profilePicture?: string;
};