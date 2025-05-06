
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Activity, TimeView } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { generateDemoActivities, toggleStreak } from '@/utils/activityUtils';
import StreakCalendar from '@/components/StreakCalendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const ActivityDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [activity, setActivity] = useState<Activity | null>(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<TimeView>('week');
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    const loadActivity = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        const activities = generateDemoActivities();
        const found = activities.find(act => act.id === id);
        
        if (found) {
          setActivity(found);
        } else {
          toast({
            title: "Not found",
            description: "Activity not found",
            variant: "destructive",
          });
          navigate('/dashboard');
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load activity",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadActivity();
  }, [id, user, navigate, toast]);
  
  const handleToggleToday = () => {
    if (activity) {
      const today = format(new Date(), 'yyyy-MM-dd');
      const updatedStreaks = toggleStreak(activity.streaks, today);
      
      setActivity({
        ...activity,
        streaks: updatedStreaks
      });
      
      toast({
        title: updatedStreaks[today] ? "Completed" : "Marked as not done",
        description: `${activity.name} for today has been updated`,
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-t-teal-500 border-gray-200 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading activity details...</p>
        </div>
      </div>
    );
  }

  if (!activity) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-800">Activity not found</p>
          <Button className="mt-4" onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const today = format(new Date(), 'yyyy-MM-dd');
  const isCompletedToday = activity.streaks[today];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <Button 
              variant="ghost"
              size="sm"
              onClick={() => navigate('/dashboard')}
              className="mr-4"
            >
              ← Back
            </Button>
            <h1 className="text-2xl font-bold">{activity.name}</h1>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center">
                <div 
                  className="w-4 h-4 rounded-full mr-2"
                  style={{ backgroundColor: activity.color }} 
                />
                <h2 className="text-xl font-bold">{activity.name}</h2>
              </div>
              <p className="text-gray-600 mt-1">
                Started {new Date(activity.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <Button
                className={cn(
                  isCompletedToday 
                    ? "bg-green-600 hover:bg-green-700" 
                    : "bg-teal-600 hover:bg-teal-700"
                )}
                onClick={handleToggleToday}
              >
                {isCompletedToday ? '✓ Completed Today' : 'Mark Complete for Today'}
              </Button>
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Progress Overview</h3>
              <div className="flex bg-gray-100 rounded-lg p-1">
                {(['week', 'month', 'year'] as TimeView[]).map((viewOption) => (
                  <button
                    key={viewOption}
                    className={`px-3 py-1 text-sm rounded-md ${
                      view === viewOption 
                        ? 'bg-white shadow-sm' 
                        : 'text-gray-600'
                    }`}
                    onClick={() => setView(viewOption)}
                  >
                    {viewOption.charAt(0).toUpperCase() + viewOption.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            
            <StreakCalendar activity={activity} view={view} />
          </div>
        </div>
        
        <div className="grid gap-6 md:grid-cols-3">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Current Streak</h3>
            <p className="text-3xl font-bold">
              {Object.entries(activity.streaks)
                .filter(([date, completed]) => completed)
                .length} days
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-1">This Month</h3>
            <p className="text-3xl font-bold">
              {Object.entries(activity.streaks)
                .filter(([date, completed]) => {
                  const month = new Date().getMonth();
                  return completed && new Date(date).getMonth() === month;
                })
                .length} days
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Total Completions</h3>
            <p className="text-3xl font-bold">
              {Object.values(activity.streaks).filter(Boolean).length}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ActivityDetail;
