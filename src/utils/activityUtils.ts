
import { format, isToday, subDays } from 'date-fns';

// Get current streak count
export const getStreakCount = (streaks: Record<string, boolean>): number => {
  let count = 0;
  const today = new Date();
  let currentDate = today;
  let continuous = true;
  
  // Check streak backward from today
  while (continuous) {
    const dateStr = format(currentDate, 'yyyy-MM-dd');
    if (streaks[dateStr]) {
      count++;
      currentDate = subDays(currentDate, 1);
    } else {
      continuous = false;
    }
  }
  
  return count;
};

// Toggle an activity streak for a specific date
export const toggleStreak = (
  streaks: Record<string, boolean>,
  dateStr: string
): Record<string, boolean> => {
  return {
    ...streaks,
    [dateStr]: !streaks[dateStr]
  };
};

// This function is kept for compatibility but may not be used anymore
export const generateDemoActivities = () => {
  const today = new Date();
  const activities = [
    {
      id: '1',
      name: 'Meditation',
      color: '#06b6d4',
      streaks: {},
      createdAt: new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '2',
      name: 'Exercise',
      color: '#8b5cf6',
      streaks: {},
      createdAt: new Date(today.getTime() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '3',
      name: 'Reading',
      color: '#f97316',
      streaks: {},
      createdAt: new Date(today.getTime() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    }
  ];
  
  // Add some random streaks for the past 60 days
  activities.forEach(activity => {
    for (let i = 0; i < 60; i++) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      const dateStr = format(date, 'yyyy-MM-dd');
      
      // Higher probability for recent days and for certain activities
      const probability = 
        (activity.id === '1') ? 0.8 :  // Meditation has high consistency
        (activity.id === '2') ? (i < 14 ? 0.7 : 0.4) :  // Exercise started strong recently
        (activity.id === '3' && i % 2 === 0) ? 0.65 : 0.3;  // Reading every other day
      
      activity.streaks[dateStr] = Math.random() < probability;
    }
  });
  
  return activities;
};
