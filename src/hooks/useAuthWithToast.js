import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export const useAuthWithToast = () => {
  const auth = useAuth();
  const { toast } = useToast();

  const loginWithToast = (user, token) => {
    auth.login(user, token);
    toast({
      title: 'Login Successful!',
      description: `Welcome back, ${user.first_name || 'User'}!`,
    });
  };

  const logoutWithToast = () => {
    auth.logout();
    toast({
      title: 'Logged out',
      description: 'You have been logged out successfully.',
    });
  };

  return {
    ...auth,
    login: loginWithToast,
    logout: logoutWithToast,
  };
};