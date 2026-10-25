import React, { ReactNode } from 'react';
import { useSessionTimeout } from '../../hooks/useSessionTimeout';
import { toast } from 'react-toastify';

interface SessionTimeoutProviderProps {
  children: ReactNode;
}

export const SessionTimeoutProvider: React.FC<SessionTimeoutProviderProps> = ({ children }) => {
  useSessionTimeout({
    timeoutMinutes: 30,
    onTimeout: () => {
      toast.error('Sessão expirada! Faça login novamente.');
    }
  });

  return <>{children}</>;
};
