import { Calendar, Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import type { Event, Tier } from "@shared/schema";

interface EventCardProps {
  event: Event;
  userTier: Tier;
  onUpgrade: () => void;
}

const tierColors = {
  free: "bg-gray-100 text-gray-800",
  silver: "bg-slate-100 text-slate-800", 
  gold: "bg-yellow-100 text-yellow-800",
  platinum: "bg-purple-100 text-purple-800"
};

const tierOrder = { free: 0, silver: 1, gold: 2, platinum: 3 };

export function EventCard({ event, userTier, onUpgrade }: EventCardProps) {
  const isLocked = tierOrder[event.tier] > tierOrder[userTier];

  return (
    <Card className={`overflow-hidden hover:shadow-lg transition-shadow duration-300 ${isLocked ? 'opacity-60' : ''}`}>
      <div className="relative">
        <img 
          src={event.imageUrl} 
          alt={event.title}
          className="w-full h-48 object-cover"
        />
        {isLocked && (
          <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
            <div className="bg-white rounded-lg p-4 text-center">
              <Lock className="text-yellow-500 text-2xl mb-2 mx-auto" />
              <p className="text-sm font-medium text-gray-900">Upgrade to {event.tier}</p>
              <p className="text-xs text-gray-600">to access this event</p>
            </div>
          </div>
        )}
      </div>
      
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xl font-semibold text-gray-900 line-clamp-1">{event.title}</h3>
          <Badge className={tierColors[event.tier]}>
            <span className={`w-2 h-2 rounded-full mr-1.5 ${
              event.tier === 'free' ? 'bg-gray-600' :
              event.tier === 'silver' ? 'bg-slate-600' :
              event.tier === 'gold' ? 'bg-yellow-600' :
              'bg-purple-600'
            }`}></span>
            {event.tier}
          </Badge>
        </div>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{event.description}</p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center text-gray-500 text-sm">
            <Calendar className="w-4 h-4 mr-2" />
            <span>{format(new Date(event.eventDate), "MMM d, yyyy")}</span>
          </div>
          
          {isLocked ? (
            <Button 
              size="sm" 
              variant="outline"
              onClick={onUpgrade}
              className="text-yellow-600 hover:text-yellow-700 border-yellow-300"
            >
              Upgrade to View
            </Button>
          ) : (
            <Button 
              size="sm" 
              variant="outline"
              className="text-blue-600 hover:text-blue-700"
            >
              View Details
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
