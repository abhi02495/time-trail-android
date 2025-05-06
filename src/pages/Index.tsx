
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useEffect } from 'react';

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="px-4 py-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-teal-600">TimeTrail</h1>
        <div className="flex gap-4">
          <Button
            variant="outline"
            className="border-teal-600 text-teal-600 hover:bg-teal-50"
            onClick={() => navigate('/login')}
          >
            Log in
          </Button>
          <Button 
            className="bg-teal-600 hover:bg-teal-700" 
            onClick={() => navigate('/signup')}
          >
            Sign up
          </Button>
        </div>
      </header>
      
      <main className="flex-1 flex flex-col md:flex-row">
        <div className="md:w-1/2 flex flex-col justify-center px-6 py-12 md:px-12 lg:px-20">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Track your habits, <span className="text-teal-600">build better routines</span>
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            TimeTrail helps you build better habits through simple activity tracking.
            See your progress over time and stay motivated with streaks.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              className="bg-teal-600 hover:bg-teal-700 text-lg py-6 px-8" 
              onClick={() => navigate('/signup')}
            >
              Start Tracking Free
            </Button>
            <Button 
              variant="outline" 
              className="border-teal-600 text-teal-600 hover:bg-teal-50 text-lg py-6 px-8"
              onClick={() => navigate('/login')}
            >
              Learn More
            </Button>
          </div>
          <div className="mt-8 flex gap-8">
            <div>
              <p className="text-3xl font-bold text-teal-600">Simple</p>
              <p className="text-gray-600">Minimalistic tracking</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-teal-600">Visual</p>
              <p className="text-gray-600">See your progress</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-teal-600">Motivating</p>
              <p className="text-gray-600">Build streaks</p>
            </div>
          </div>
        </div>
        
        <div className="md:w-1/2 bg-gray-100 flex items-center justify-center p-6">
          <div className="relative w-full max-w-md">
            <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-cyan-500 transform rotate-3 rounded-2xl"></div>
            <div className="relative bg-white p-8 rounded-2xl shadow-xl">
              <div className="mb-6 flex justify-between items-center">
                <h3 className="text-lg font-semibold">Your Activities</h3>
                <span className="text-sm text-gray-500">May 2025</span>
              </div>
              
              {/* Demo Activity Cards */}
              <div className="space-y-4">
                {["Meditation", "Exercise", "Reading"].map((activity, index) => (
                  <div key={index} className="p-4 border rounded-xl bg-white shadow-sm">
                    <div className="flex justify-between items-start mb-3">
                      <p className="font-medium">{activity}</p>
                      <div className="px-2 py-1 bg-teal-100 text-teal-800 text-xs rounded-full">
                        {index === 0 ? '7' : index === 1 ? '3' : '5'} day streak
                      </div>
                    </div>
                    <div className="flex justify-between">
                      {[...Array(7)].map((_, i) => (
                        <div key={i} className={`w-5 h-5 rounded-full ${
                          // Random completed days for demo
                          Math.random() > 0.3 ? 'bg-teal-500' : 'bg-gray-100'
                        } flex items-center justify-center text-white text-xs`}>
                          {Math.random() > 0.3 && '✓'}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
