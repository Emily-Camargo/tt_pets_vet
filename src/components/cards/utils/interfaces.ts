export interface CardStatsProps {
    title: string;
    value: number;
    icon: React.ComponentType<{ size?: number; className?: string }>;
    color: 'primary' | 'secondary' | 'accent';
}

export interface QuickActionCardProps {
    title: string;
    description: string;
    icon: React.ComponentType<{ size?: number; className?: string }>;
    onClick: () => void;
    colorClass: string;
}