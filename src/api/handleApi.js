import { useToast } from '@/hooks/use-toast';

export const useHandleApi = () => {
  const { toast } = useToast();

  const handleApi = async (apiCall, { successMessage, silent = false } = {}) => {
    try {
      const res = await apiCall();

      if (res?.status === true) {
        if (successMessage && !silent) {
          toast({
            title: 'Success',
            description: successMessage,
          });
        }
        return res;
      } else {
        const msg = res?.message || 'Unexpected error occurred.';
        if (!silent) {
          toast({
            title: 'Request Failed',
            description: msg,
            variant: 'destructive',
          });
        }
        return null;
      }
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        'Something went wrong. Please try again.';

      if (!silent) {
        toast({
          title: 'Server Error',
          description: msg,
          variant: 'destructive',
        });
      }

      return null;
    }
  };

  return { handleApi };
};