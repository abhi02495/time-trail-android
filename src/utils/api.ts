
import { supabase } from '@/integrations/supabase/client';
import { Activity } from '@/types';
import { format } from 'date-fns';

// Activities API
export const fetchActivities = async () => {
  const { data, error } = await supabase
    .from('activities')
    .select('*')
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error('Error fetching activities:', error);
    throw error;
  }
  
  return data || [];
};

export const fetchActivityById = async (id: string) => {
  const { data, error } = await supabase
    .from('activities')
    .select('*')
    .eq('id', id)
    .single();
    
  if (error) {
    console.error('Error fetching activity:', error);
    throw error;
  }
  
  return data;
};

export const createActivity = async (activity: { name: string; color: string; icon?: string }) => {
  const { data, error } = await supabase
    .from('activities')
    .insert([activity])
    .select()
    .single();
    
  if (error) {
    console.error('Error creating activity:', error);
    throw error;
  }
  
  return data;
};

export const updateActivity = async (id: string, updates: { name?: string; color?: string; icon?: string }) => {
  const { data, error } = await supabase
    .from('activities')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
    
  if (error) {
    console.error('Error updating activity:', error);
    throw error;
  }
  
  return data;
};

export const deleteActivity = async (id: string) => {
  const { error } = await supabase
    .from('activities')
    .delete()
    .eq('id', id);
    
  if (error) {
    console.error('Error deleting activity:', error);
    throw error;
  }
};

// Streaks API
export const fetchStreaks = async (activityId: string) => {
  const { data, error } = await supabase
    .from('streaks')
    .select('*')
    .eq('activity_id', activityId)
    .order('date', { ascending: false });
    
  if (error) {
    console.error('Error fetching streaks:', error);
    throw error;
  }
  
  return data || [];
};

export const toggleStreak = async (activityId: string, date: string, completed: boolean) => {
  // Check if streak exists
  const { data: existing } = await supabase
    .from('streaks')
    .select('id, completed')
    .eq('activity_id', activityId)
    .eq('date', date)
    .maybeSingle();
    
  if (existing) {
    // Update existing streak
    const { data, error } = await supabase
      .from('streaks')
      .update({ completed })
      .eq('id', existing.id)
      .select()
      .single();
      
    if (error) {
      console.error('Error updating streak:', error);
      throw error;
    }
    
    return data;
  } else {
    // Create new streak
    const { data, error } = await supabase
      .from('streaks')
      .insert([{ 
        activity_id: activityId, 
        date, 
        completed 
      }])
      .select()
      .single();
      
    if (error) {
      console.error('Error creating streak:', error);
      throw error;
    }
    
    return data;
  }
};

// Converts streaks from database format to the format used in our UI
export const formatStreaksForActivity = (activity: any, streaksData: any[]): Activity => {
  const streaksMap: Record<string, boolean> = {};
  
  streaksData.forEach(streak => {
    streaksMap[streak.date] = streak.completed;
  });
  
  return {
    ...activity,
    streaks: streaksMap
  };
};
