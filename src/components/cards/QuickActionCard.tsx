import { CardContent, Box, Typography } from '@mui/material';
import { QuickActionCardProps } from './utils/interfaces';
import { IconContainerCard, StyledCard } from './utils/contants';

const QuickActionCard = ({ 
  title, 
  description, 
  icon: Icon, 
  onClick, 
  colorClass 
}: QuickActionCardProps) => {
  const getGradientStyle = (colorClass: string) => {
    const baseStyle = {
      backgroundSize: '200% 200%',
      position: 'relative',
      overflow: 'hidden',
      backgroundPosition: '0% 50%',
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
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      '&:hover': {
        transform: 'translateY(-2px) scale(1.02)',
        boxShadow: '0 20px 40px rgba(0,0,0,0.15), 0 0 0 1px rgba(255,255,255,0.1)',
        animation: 'gradientShift 2s ease infinite',
      },
    };

    if (colorClass.includes('blue')) {
      return {
        ...baseStyle,
        background: `
          linear-gradient(135deg, 
            rgba(59, 130, 246, 0.85) 0%, 
            rgba(29, 78, 216, 0.90) 25%, 
            rgba(30, 64, 175, 0.95) 50%, 
            rgba(30, 58, 138, 0.98) 75%, 
            rgba(23, 37, 84, 1) 100%
          ),
          radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.15) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(29, 78, 216, 0.15) 0%, transparent 50%)
        `,
      };
    } else if (colorClass.includes('emerald')) {
      return {
        ...baseStyle,
        background: `
          linear-gradient(135deg, 
            rgba(16, 185, 129, 0.85) 0%, 
            rgba(5, 150, 105, 0.90) 25%, 
            rgba(4, 120, 87, 0.95) 50%, 
            rgba(6, 95, 70, 0.98) 75%, 
            rgba(6, 78, 59, 1) 100%
          ),
          radial-gradient(circle at 20% 80%, rgba(16, 185, 129, 0.15) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(5, 150, 105, 0.15) 0%, transparent 50%)
        `,
      };
    } else if (colorClass.includes('red')) {
      return {
        ...baseStyle,
        background: `
          linear-gradient(135deg, 
            rgba(239, 68, 68, 0.85) 0%, 
            rgba(220, 38, 38, 0.90) 25%, 
            rgba(185, 28, 28, 0.95) 50%, 
            rgba(153, 27, 27, 0.98) 75%, 
            rgba(127, 29, 29, 1) 100%
          ),
          radial-gradient(circle at 20% 80%, rgba(239, 68, 68, 0.15) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(220, 38, 38, 0.15) 0%, transparent 50%)
        `,
      };
    } else if (colorClass.includes('purple')) {
      return {
        ...baseStyle,
        background: `
          linear-gradient(135deg, 
            rgba(168, 85, 247, 0.85) 0%, 
            rgba(147, 51, 234, 0.90) 25%, 
            rgba(124, 58, 237, 0.95) 50%, 
            rgba(109, 40, 217, 0.98) 75%, 
            rgba(88, 28, 135, 1) 100%
          ),
          radial-gradient(circle at 20% 80%, rgba(168, 85, 247, 0.15) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(147, 51, 234, 0.15) 0%, transparent 50%)
        `,
      };
    } else if (colorClass.includes('slate')) {
      return {
        ...baseStyle,
        background: `
          linear-gradient(135deg, 
            rgba(100, 116, 139, 0.85) 0%, 
            rgba(71, 85, 105, 0.90) 25%, 
            rgba(51, 65, 85, 0.95) 50%, 
            rgba(30, 41, 59, 0.98) 75%, 
            rgba(15, 23, 42, 1) 100%
          ),
          radial-gradient(circle at 20% 80%, rgba(100, 116, 139, 0.15) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(71, 85, 105, 0.15) 0%, transparent 50%)
        `,
      };
    } else if (colorClass.includes('orange')) {
      return {
        ...baseStyle,
        background: `
          linear-gradient(135deg, 
            rgba(249, 115, 22, 0.85) 0%, 
            rgba(234, 88, 12, 0.90) 25%, 
            rgba(194, 65, 12, 0.95) 50%, 
            rgba(154, 52, 18, 0.98) 75%, 
            rgba(124, 45, 18, 1) 100%
          ),
          radial-gradient(circle at 20% 80%, rgba(249, 115, 22, 0.15) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(234, 88, 12, 0.15) 0%, transparent 50%)
        `,
      };
    } else if (colorClass.includes('indigo')) {
      return {
        ...baseStyle,
        background: `
          linear-gradient(135deg, 
            rgba(99, 102, 241, 0.85) 0%, 
            rgba(79, 70, 229, 0.90) 25%, 
            rgba(67, 56, 202, 0.95) 50%, 
            rgba(55, 48, 163, 0.98) 75%, 
            rgba(49, 46, 129, 1) 100%
          ),
          radial-gradient(circle at 20% 80%, rgba(99, 102, 241, 0.15) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(79, 70, 229, 0.15) 0%, transparent 50%)
        `,
      };
    }
    return baseStyle;
  };

  return (
    <StyledCard 
      onClick={onClick}
      sx={{
        ...getGradientStyle(colorClass),
        '& .MuiCardContent-root': {
          position: 'relative',
          zIndex: 2,
        }
      }}
    >
      <CardContent sx={{ 
        p: 3, 
        textAlign: 'left',
        position: 'relative',
        zIndex: 2,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}>
        <Box display="flex" alignItems="flex-start" justifyContent="space-between" mb={2}>
          <IconContainerCard sx={{
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          }}>
            <Icon size={24} className="text-white" />
          </IconContainerCard>
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: '700', 
              mb: 1.5,
              color: 'white',
              fontSize: '1.25rem',
              textShadow: '0 2px 4px rgba(0,0,0,0.3)',
              letterSpacing: '-0.025em'
            }}
          >
            {title}
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              opacity: 0.95,
              color: 'white',
              fontSize: '0.9rem',
              lineHeight: 1.6,
              textShadow: '0 1px 2px rgba(0,0,0,0.2)',
              fontWeight: '400'
            }}
          >
            {description}
          </Typography>
        </Box>
      </CardContent>
    </StyledCard>
  );
};

export default QuickActionCard;
