import { Badge } from './ui/badge';
import { AlertCircle } from 'lucide-react';
import type { Campaign } from '@/types';

interface CampaignCardProps {
    campaign: Campaign;
    onClick: (id: string) => void;
}

export function CampaignCard({ campaign, onClick }: CampaignCardProps) {
    const progress = Math.round((campaign.currentDonations / campaign.targetDonations) * 100);

    return (
        <div
            onClick={() => onClick(campaign.id)}
            className="bg-card rounded-2xl overflow-hidden shadow-sm hover-lift cursor-pointer border border-border"
        >
            <div
                className="h-36 bg-cover bg-center relative"
                style={{ backgroundImage: `url(${campaign.imageUrl})` }}
            >
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                {campaign.priority === 'urgent' && (
                    <Badge className="absolute top-3 right-3 bg-red-500 text-white border-0">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        Urgent
                    </Badge>
                )}
            </div>
            <div className="p-4">
                <h4 className="mb-1 font-medium text-foreground">{campaign.title}</h4>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{campaign.description}</p>

                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Progrés</span>
                    <span className="text-sm font-medium text-foreground">
                        {campaign.currentDonations}/{campaign.targetDonations}
                    </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                        className="h-full bg-brand-600 rounded-full transition-all duration-500"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>
        </div>
    );
}
