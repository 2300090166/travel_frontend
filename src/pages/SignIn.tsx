import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { LogIn, Plane } from 'lucide-react';
import Lottie from 'lottie-react';

const SignIn = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [animationData, setAnimationData] = useState(null);
  const { signIn, isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      // send admins to admin dashboard, others to user dashboard
      navigate(user?.isAdmin ? '/admin' : '/dashboard');
    }
  }, [isAuthenticated, navigate, user]);

  useEffect(() => {
    // Fetch the Lottie animation data
    fetch('/Login.json')
      .then(response => response.json())
      .then(data => setAnimationData(data))
      .catch(err => console.error('Error loading animation:', err));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all fields.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    const result = await signIn(username, password);
    setLoading(false);

    if (result.success) {
      toast({
        title: 'Welcome back!',
        description: 'Successfully signed in.',
        variant: 'success',
      });
      // navigate based on role
      navigate(user?.isAdmin ? '/admin' : '/dashboard');
    } else {
      toast({
        title: 'Sign In Failed',
        description: result.error || 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
      <div className="w-full max-w-5xl grid md:grid-cols-2 gap-6 items-center">
        {/* Left side - Lottie Animation */}
        <div className="hidden md:flex items-center justify-end pr-3">
          {animationData && (
            <Lottie 
              animationData={animationData} 
              loop={true}
              style={{ width: '100%', maxWidth: '450px' }}
            />
          )}
        </div>

        {/* Right side - Sign In Card */}
        <div className="pl-3">
        <Card className="w-full max-w-[400px] mx-auto p-6 sm:p-8 shadow-lg">
          <div className="flex flex-col items-center mb-6">
            <div className="bg-gradient-hero p-3 rounded-2xl mb-4">
              <Plane className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-center">Welcome Back</h1>
            <p className="text-muted-foreground text-center mt-2">Sign in to continue your journey</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                autoComplete="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                autoComplete="current-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-hero hover:opacity-90 transition-opacity"
              disabled={loading}
            >
              {loading ? (
                'Signing in...'
              ) : (
                <>
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign In
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">Don't have an account? </span>
            <Link to="/signup" className="text-primary font-semibold hover:underline">
              Sign Up
            </Link>
          </div>
        </Card>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
