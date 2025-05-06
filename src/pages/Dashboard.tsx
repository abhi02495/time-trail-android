
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';
import ActivityCard from '@/components/ActivityCard';
import NewActivityDialog from '@/components/NewActivityDialog';
import { Activity } from '@/types';
import { generateDemoActivities } from '@/utils/activityUtils';
import { format } from 'date-fns';

const Dashboard = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    // Demo data
    const loadData = async () => {
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        setActivities(generateDemoActivities());
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load activities",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [user, navigate, toast]);
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  const handleActivityClick = (id: string) => {
    navigate(`/activity/${id}`);
  };
  
  const handleAddActivity = (name: string, color: string) => {
    const newActivity: Activity = {
      id: Date.now().toString(),
      name,
      color,
      streaks: {},
      createdAt: new Date().toISOString()
    };
    
    setActivities([newActivity, ...activities]);
    
    toast({
      title: "Activity added",
      description: `${name} has been added to your activities`,
    });
  };
  
  const handleToggleToday = (activityId: string) => {
    setActivities(activities.map(activity => {
      if (activity.id === activityId) {
        const today = format(new Date(), 'yyyy-MM-dd');
        return {
          ...activity,
          streaks: {
            ...activity.streaks,
            [today]: !activity.streaks[today]
          }
        };
      }
      return activity;
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-t-teal-500 border-gray-200 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your activities...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-teal-600">TimeTrail</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">Hi, {user?.name}</span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              Log out
            </Button>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Your Activities</h2>
            <p className="text-gray-600 mt-1">
              Track your daily habits and build consistent routines
            </p>
          </div>
          <div className="mt-4 sm:mt-0 sm:w-auto">
            <NewActivityDialog onSave={handleAddActivity} />
          </div>
        </div>
        
        {activities.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
            <h3 className="text-xl font-medium text-gray-900">No activities yet</h3>
            <p className="mt-2 text-gray-600">Add your first activity to start tracking</p>
            <div className="mt-6 max-w-xs mx-auto">
              <NewActivityDialog onSave={handleAddActivity} />
            </div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {activities.map(activity => (
              <ActivityCard
                key={activity.id}
                activity={activity}
                onClick={() => handleActivityClick(activity.id)}
              />
            ))}
          </div>
        )}
        
        <div className="mt-12">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <p className="text-gray-600 mb-4">Log today's activities:</p>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {activities.map(activity => {
                const today = format(new Date(), 'yyyy-MM-dd');
                const isCompleted = activity.streaks[today];
                
                return (
                  <Button
                    key={activity.id}
                    variant={isCompleted ? "default" : "outline"}
                    className={`justify-start ${
                      isCompleted 
                        ? "bg-teal-600 hover:bg-teal-700" 
                        : "border-teal-600 text-teal-600 hover:bg-teal-50"
                    }`}
                    onClick={() => handleToggleToday(activity.id)}
                  >
                    {isCompleted ? '✓ ' : ''}{activity.name}
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
