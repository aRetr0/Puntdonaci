import { Coins } from 'lucide-react';

interface DonationTypeProps {
    type: string;
    duration: string;
    frequency: string;
    icon: string;
    color: string;
    tokens: number;
    onClick: () => void;
}

export function DonationTypeCard({
    type,
    duration,
    frequency,
    icon,
    tokens,
    onClick,
}: DonationTypeProps) {
    return (
        <div
            onClick={onClick}
            className="bg-card rounded-2xl p-4 cursor-pointer hover-lift border border-border shadow-sm"
        >
            <div className="text-4xl mb-3">{icon}</div>
            <h4 className="text-sm font-medium mb-1 text-foreground">{type}</h4>
            <p className="text-xs text-muted-foreground mb-2">{duration} • {frequency}</p>
            <div className="flex items-center gap-1 text-brand-600">
                <Coins className="w-3 h-3" />
                <span className="text-xs font-medium">+{tokens} tokens</span>
            </div>
        </div>
    );
}
