import { useMutation } from '@tanstack/react-query';
import { userLogout } from '../api/api';
export const useLogout = () => {
  return useMutation({
    mutationFn: async ({ userId, token }) => {
      await userLogout({ userId, token });
    },
    onSuccess: () => {
      // Handle successful logout, e.g., redirecting or showing a success message
    },
    onError: (error) => {
      console.error('Error during logout:', error);
    },
  });
};
