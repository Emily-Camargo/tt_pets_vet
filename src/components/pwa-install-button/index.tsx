import React from 'react';
import { Button } from '@mui/material';
import { GetApp as InstallIcon } from '@mui/icons-material';
import { usePWAInstall } from '../../hooks';

interface PWAInstallButtonProps {
  variant?: 'text' | 'outlined' | 'contained';
  size?: 'small' | 'medium' | 'large';
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';
  fullWidth?: boolean;
  sx?: any;
  children?: React.ReactNode;
}

const PWAInstallButton = ({
  variant = 'contained',
  size = 'medium',
  color = 'primary',
  fullWidth = false,
  sx,
  children = 'Instalar App'
}: PWAInstallButtonProps) => {
  const { isInstallable, installApp } = usePWAInstall();

  if (!isInstallable) {
    return null;
  }

  return (
    <Button
      variant={variant}
      size={size}
      color={color}
      fullWidth={fullWidth}
      startIcon={<InstallIcon />}
      onClick={installApp}
      sx={sx}
    >
      {children}
    </Button>
  );
};

export default PWAInstallButton;
