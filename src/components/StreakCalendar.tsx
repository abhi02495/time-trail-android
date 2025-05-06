
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, TimeView, DateRange } from '@/types';
import { cn } from '@/lib/utils';
import { format, eachDayOfInterval, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, isSameDay } from 'date-fns';

interface StreakCalendarProps {
  activity: Activity;
  view: TimeView;
}

const StreakCalendar = ({ activity, view }: StreakCalendarProps) => {
  const getDateRange = (): DateRange => {
    const today = new Date();
    
    switch (view) {
      case 'week':
        return {
          start: startOfWeek(today, { weekStartsOn: 1 }),
          end: endOfWeek(today, { weekStartsOn: 1 })
        };
      case 'month':
        return {
          start: startOfMonth(today),
          end: endOfMonth(today)
        };
      case 'year':
        return {
          start: startOfYear(today),
          end: endOfYear(today)
        };
      default:
        return {
          start: startOfWeek(today, { weekStartsOn: 1 }),
          end: endOfWeek(today, { weekStartsOn: 1 })
        };
    }
  };

  const dateRange = getDateRange();
  const days = eachDayOfInterval({ start: dateRange.start, end: dateRange.end });
  
  // For week view, show a single week with days
  if (view === 'week') {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            Week of {format(dateRange.start, "MMM d")} - {format(dateRange.end, "MMM d, yyyy")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between">
            {days.map((day) => {
              const dateStr = format(day, 'yyyy-MM-dd');
              const isCompleted = activity.streaks[dateStr];
              
              return (
                <div key={dateStr} className="flex flex-col items-center">
                  <div 
                    className={cn(
                      "streak-dot",
                      isCompleted ? "streak-dot-completed" : "streak-dot-empty"
                    )}
                    style={isCompleted ? { backgroundColor: activity.color } : {}}
                  >
                    {isCompleted && '✓'}
                  </div>
                  <span className="text-xs mt-1">{format(day, 'EEE')}</span>
                  <span className="text-xs">{format(day, 'd')}</span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // For month view, show a grid calendar
  if (view === 'month') {
    // Create a grid layout for the month
    const weekStartsOn = 1; // Monday
    const firstDayOfMonth = startOfMonth(dateRange.start);
    const startDate = startOfWeek(firstDayOfMonth, { weekStartsOn });
    
    const daysInCalendar: Date[][] = [];
    let currentDay = startDate;
    
    for (let week = 0; week < 6; week++) {
      const weekDays: Date[] = [];
      for (let day = 0; day < 7; day++) {
        weekDays.push(new Date(currentDay));
        currentDay.setDate(currentDay.getDate() + 1);
      }
      daysInCalendar.push(weekDays);
    }
    
    const weekDayLabels = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
    
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{format(dateRange.start, "MMMM yyyy")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid-calendar">
            <div className="grid grid-cols-7 gap-1 mb-2">
              {weekDayLabels.map((dayLabel) => (
                <div key={dayLabel} className="text-center text-xs font-medium text-gray-500">
                  {dayLabel}
                </div>
              ))}
            </div>
            {daysInCalendar.map((week, weekIndex) => (
              <div key={weekIndex} className="grid grid-cols-7 gap-1 mb-1">
                {week.map((day) => {
                  const dateStr = format(day, 'yyyy-MM-dd');
                  const isCompleted = activity.streaks[dateStr];
                  const isCurrentMonth = day.getMonth() === dateRange.start.getMonth();
                  
                  return (
                    <div 
                      key={dateStr} 
                      className="flex flex-col items-center"
                    >
                      <div 
                        className={cn(
                          "streak-dot flex-shrink-0",
                          isCompleted ? "streak-dot-completed" : "streak-dot-empty",
                          !isCurrentMonth && "opacity-30"
                        )}
                        style={isCompleted ? { backgroundColor: activity.color } : {}}
                      >
                        <span className={cn(
                          "text-xs",
                          isCompleted ? "text-white" : "text-gray-700"
                        )}>
                          {format(day, 'd')}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // For year view, show month blocks with completion rates
  if (view === 'year') {
    const monthsInYear = Array.from({ length: 12 }, (_, i) => {
      const date = new Date();
      date.setMonth(i);
      date.setDate(1);
      return date;
    });
    
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{format(dateRange.start, "yyyy")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            {monthsInYear.map((month) => {
              const monthStart = startOfMonth(month);
              const monthEnd = endOfMonth(month);
              const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
              
              // Calculate completion percentage for the month
              let completedDays = 0;
              daysInMonth.forEach((day) => {
                const dateStr = format(day, 'yyyy-MM-dd');
                if (activity.streaks[dateStr]) {
                  completedDays++;
                }
              });
              
              const completionPercentage = Math.round((completedDays / daysInMonth.length) * 100);
              
              return (
                <div key={month.getTime()} className="text-center p-2 border rounded-lg">
                  <div className="font-medium">{format(month, 'MMM')}</div>
                  <div 
                    className="w-full h-2 bg-gray-100 rounded-full mt-2 overflow-hidden"
                  >
                    <div 
                      className="h-full rounded-full"
                      style={{ 
                        width: `${completionPercentage}%`,
                        backgroundColor: activity.color
                      }}
                    />
                  </div>
                  <div className="text-xs mt-1 text-gray-600">{completionPercentage}%</div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return null;
};

export default StreakCalendar;
