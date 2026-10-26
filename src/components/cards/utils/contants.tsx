import { Box, Card, styled } from "@mui/material";

export const StyledCard = styled(Card)(() => ({
  borderRadius: '16px',
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  transition: 'all 0.3s ease',
  cursor: 'pointer',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '-100%',
    left: '-100%',
    width: '300%',
    height: '300%',
    background: 'linear-gradient(25deg, transparent 40%, rgba(255, 255, 255, 0.5) 50%, transparent 60%)',
    transform: 'translateX(-150%) translateY(-50%)',
    transition: 'transform 1.2s ease-in-out',
    zIndex: 1,
    pointerEvents: 'none',
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: '16px',
    border: '2px solid transparent',
    background: 'linear-gradient(45deg, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.1)) border-box',
    mask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
    maskComposite: 'xor',
    opacity: 0,
    transition: 'opacity 0.3s ease',
    pointerEvents: 'none',
    zIndex: 2,
  },
  '&:hover': {
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    animation: 'pulse 2s infinite',
    '&::before': {
      transform: 'translateX(150%) translateY(50%)',
    },
    '&::after': {
      opacity: 1,
    },
  },
  '@keyframes pulse': {
    '0%': {
      transform: 'scale(1)',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    },
    '50%': {
      transform: 'scale(1.02)',
      boxShadow: '0 15px 25px -5px rgba(0, 0, 0, 0.15), 0 8px 12px -4px rgba(0, 0, 0, 0.1)',
    },
    '100%': {
      transform: 'scale(1)',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    },
  },
  '@keyframes gradientShift': {
    '0%': {
      backgroundPosition: '0% 50%',
    },
    '50%': {
      backgroundPosition: '100% 50%',
    },
    '100%': {
      backgroundPosition: '0% 50%',
    },
  },
}));

export const IconContainer = styled(Box)<{ color: 'primary' | 'secondary' | 'accent' }>(({ color }) => ({
  width: '48px',
  height: '48px',
  borderRadius: '10px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor:
    color === 'primary'
      ? 'rgba(59, 130, 246, 0.1)'
      : color === 'secondary'
      ? 'rgba(245, 158, 11, 0.1)'
      : color === 'accent'
      ? 'rgba(124, 58, 237, 0.1)'
      : 'rgba(59, 130, 246, 0.1)',
  transition: 'all 0.2s ease',
}));

export const getColorValue = (color: string) => {
  switch (color) {
    case 'primary':
      return '#3b82f6';
    case 'secondary':
      return '#f59e0b';
    case 'accent':
      return '#8b5cf6';
    default:
      return '#3b82f6';
  }
};

export const IconContainerCard = styled(Box)(() => ({
    width: '56px',
    height: '56px',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.25)',
      transform: 'scale(1.05)',
      boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)',
    },
  }));