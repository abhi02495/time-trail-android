
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Activity, TimeView } from '@/types';
import { useAuth } from '@/context/AuthContext';
import StreakCalendar from '@/components/StreakCalendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { fetchActivityById, fetchStreaks, toggleStreak, updateActivity, deleteActivity } from '@/utils/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const ActivityDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [view, setView] = useState<TimeView>('week');
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Ensure user is authenticated
  React.useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);
  
  // Fetch activity details
  const { 
    data: activity, 
    isLoading: loadingActivity, 
    error: activityError 
  } = useQuery({
    queryKey: ['activity', id],
    queryFn: () => id ? fetchActivityById(id) : null,
    enabled: !!id && !!user
  });
  
  // Fetch streaks for this activity
  const { 
    data: streaks = [], 
    isLoading: loadingStreaks 
  } = useQuery({
    queryKey: ['streaks', id],
    queryFn: () => id ? fetchStreaks(id) : [],
    enabled: !!id && !!user
  });
  
  // Map streaks data to daily completion status
  const streaksMap: Record<string, boolean> = {};
  streaks.forEach((streak: any) => {
    streaksMap[streak.date] = streak.completed;
  });
  
  // Create complete activity object with streaks
  const completeActivity = activity ? {
    ...activity,
    streaks: streaksMap
  } : null;
  
  // Mutations
  const toggleStreakMutation = useMutation({
    mutationFn: ({ date, completed }: { date: string, completed: boolean }) => 
      toggleStreak(id!, date, completed),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['streaks', id] });
    },
    onError: (error) => {
      toast({
        title: "Error updating streak",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    }
  });
  
  const deleteActivityMutation = useMutation({
    mutationFn: () => deleteActivity(id!),
    onSuccess: () => {
      toast({
        title: "Activity deleted",
        description: "Activity has been successfully deleted",
      });
      navigate('/dashboard');
    },
    onError: (error) => {
      toast({
        title: "Error deleting activity",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    }
  });
  
  const handleToggleToday = () => {
    if (id) {
      const today = format(new Date(), 'yyyy-MM-dd');
      const isCompleted = streaksMap[today] || false;
      
      toggleStreakMutation.mutate({ 
        date: today, 
        completed: !isCompleted 
      });
      
      toast({
        title: !isCompleted ? "Completed" : "Marked as not done",
        description: `${activity?.name} for today has been updated`,
      });
    }
  };
  
  const handleDeleteActivity = () => {
    if (confirm("Are you sure you want to delete this activity? This action cannot be undone.")) {
      deleteActivityMutation.mutate();
    }
  };

  if (loadingActivity || loadingStreaks) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-t-teal-500 border-gray-200 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading activity details...</p>
        </div>
      </div>
    );
  }

  if (activityError || !activity) {
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
  const isCompletedToday = streaksMap[today] || false;

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
                Started {new Date(activity.created_at).toLocaleDateString()}
              </p>
            </div>
            <div className="mt-4 sm:mt-0 flex gap-2">
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
              <Button
                variant="outline"
                className="border-red-600 text-red-600 hover:bg-red-50"
                onClick={handleDeleteActivity}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
        
        {completeActivity && (
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
              
              <StreakCalendar activity={completeActivity} view={view} />
            </div>
          </div>
        )}
        
        <div className="grid gap-6 md:grid-cols-3">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Current Streak</h3>
            <p className="text-3xl font-bold">
              {(() => {
                let count = 0;
                let date = new Date();
                let continuous = true;
                
                while (continuous) {
                  const dateStr = format(date, 'yyyy-MM-dd');
                  if (streaksMap[dateStr]) {
                    count++;
                    date.setDate(date.getDate() - 1);
                  } else {
                    continuous = false;
                  }
                }
                
                return count;
              })()} days
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-1">This Month</h3>
            <p className="text-3xl font-bold">
              {Object.entries(streaksMap)
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
              {Object.values(streaksMap).filter(Boolean).length}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ActivityDetail;
