// Format date into string
export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
};

// Format time into string (12-hour format with AM/PM)
export const formatTime = (date: Date): string => {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

// Format date and time
export const formatDateTime = (date: Date, timeOnly = false): string => {
  if (timeOnly) {
    return formatTime(date);
  }
  
  return `${formatDate(date)}, ${formatTime(date)}`;
};

// Get all days in a month for calendar view
export const getMonthDays = (date: Date): Date[] => {
  const year = date.getFullYear();
  const month = date.getMonth();
  
  // Get the first day of the month
  const firstDay = new Date(year, month, 1);
  // Get the day of the week for the first day (0 = Sunday, 6 = Saturday)
  const firstDayOfWeek = firstDay.getDay();
  
  // Get the last day of the month
  const lastDay = new Date(year, month + 1, 0);
  // Get the day of the week for the last day
  const lastDayOfWeek = lastDay.getDay();
  
  // Calculate days needed from previous month to start from Sunday
  const daysFromPrevMonth = firstDayOfWeek;
  
  // Calculate days needed from next month to end on Saturday
  const daysFromNextMonth = 6 - lastDayOfWeek;
  
  // Calculate total days to display
  const totalDays = daysFromPrevMonth + lastDay.getDate() + daysFromNextMonth;
  
  // Generate array of dates
  const days: Date[] = [];
  
  // Add days from previous month
  for (let i = 0; i < daysFromPrevMonth; i++) {
    const day = new Date(year, month, 1 - (daysFromPrevMonth - i));
    days.push(day);
  }
  
  // Add days from current month
  for (let i = 1; i <= lastDay.getDate(); i++) {
    const day = new Date(year, month, i);
    days.push(day);
  }
  
  // Add days from next month
  for (let i = 1; i <= daysFromNextMonth; i++) {
    const day = new Date(year, month + 1, i);
    days.push(day);
  }
  
  return days;
};

// Get days for a week view
export const getWeekDays = (date: Date): Date[] => {
  const days: Date[] = [];
  const currentDay = date.getDay(); // 0-6 (Sunday-Saturday)
  
  // Start from Sunday of the current week
  const sunday = new Date(date);
  sunday.setDate(date.getDate() - currentDay);
  
  // Add all 7 days of the week
  for (let i = 0; i < 7; i++) {
    const day = new Date(sunday);
    day.setDate(sunday.getDate() + i);
    days.push(day);
  }
  
  return days;
};