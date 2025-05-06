
import { Activity } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { Calendar, CheckCircle } from 'lucide-react';
import { getStreakCount } from '@/utils/activityUtils';
import { cn } from '@/lib/utils';

interface ActivityCardProps {
  activity: Activity;
  onClick: () => void;
}

const ActivityCard = ({ activity, onClick }: ActivityCardProps) => {
  const streakCount = getStreakCount(activity.streaks);
  const lastWeekDays = 7;
  const today = new Date();
  
  // Get dates for the past 7 days
  const lastWeekDates = Array.from({ length: lastWeekDays }, (_, i) => {
    const date = new Date();
    date.setDate(today.getDate() - (lastWeekDays - 1 - i));
    return date.toISOString().split('T')[0];
  });

  return (
    <div className="activity-card cursor-pointer" onClick={onClick}>
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-semibold">{activity.name}</CardTitle>
            <CardDescription>
              Created {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
            </CardDescription>
          </div>
          <Badge style={{ backgroundColor: activity.color }} className="text-white">
            {streakCount} day streak
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <div className="flex justify-between mt-4">
          {lastWeekDates.map((date) => {
            const isCompleted = activity.streaks[date];
            return (
              <div key={date} className="flex flex-col items-center">
                <div 
                  className={cn(
                    "streak-dot",
                    isCompleted ? "streak-dot-completed" : "streak-dot-empty"
                  )}
                  style={isCompleted ? { backgroundColor: activity.color } : {}}
                >
                  {isCompleted && '✓'}
                </div>
                <span className="text-xs mt-1">
                  {new Date(date).toLocaleDateString('en', { weekday: 'short' }).charAt(0)}
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </div>
  );
};

export default ActivityCard;
