import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Users, Lock, Crown, Star, Zap } from "lucide-react";
import { format } from "date-fns";
import type { Event, Tier } from "@shared/schema";

interface EventCardProps {
  event: Event;
  userTier: Tier;
  onUpgrade: () => void;
}

export function EventCard({ event, userTier, onUpgrade }: EventCardProps) {
  const tierHierarchy = { free: 0, silver: 1, gold: 2, platinum: 3 };
  const hasAccess = tierHierarchy[userTier] >= tierHierarchy[event.tier];
  
  const tierColors = {
    free: "bg-gray-100 text-gray-800",
    silver: "bg-slate-100 text-slate-800",
    gold: "bg-yellow-100 text-yellow-800", 
    platinum: "bg-purple-100 text-purple-800"
  };

  const tierIcons = {
    free: <Users className="w-3 h-3" />,
    silver: <Zap className="w-3 h-3" />,
    gold: <Crown className="w-3 h-3" />,
    platinum: <Crown className="w-3 h-3" />
  };

  return (
    <Card className={`relative overflow-hidden transition-all hover:shadow-md ${hasAccess ? "" : "opacity-75"}`}>
      {!hasAccess && (
        <div className="absolute inset-0 bg-black/5 flex items-center justify-center z-10">
          <div className="bg-white rounded-full p-3 shadow-lg">
            <Lock className="w-6 h-6 text-gray-600" />
          </div>
        </div>
      )}
      
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold mb-2">{event.title}</CardTitle>
            <CardDescription className="line-clamp-2">
              {event.description}
            </CardDescription>
          </div>
          <Badge className={`${tierColors[event.tier]} flex items-center gap-1 ml-2`}>
            {tierIcons[event.tier]}
            {event.tier.charAt(0).toUpperCase() + event.tier.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="w-4 h-4 mr-2" />
            {format(new Date(event.eventDate), "MMM d, yyyy 'at' h:mm a")}
          </div>
        </div>

        {hasAccess ? (
          <Button className="w-full bg-blue-600 hover:bg-blue-700">
            View Details
          </Button>
        ) : (
          <Button 
            variant="outline" 
            className="w-full border-orange-300 text-orange-600 hover:bg-orange-50"
            onClick={onUpgrade}
          >
            <Crown className="w-4 h-4 mr-2" />
            Upgrade to Access
          </Button>
        )}
      </CardContent>
    </Card>
  );
}