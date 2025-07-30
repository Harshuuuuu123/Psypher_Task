import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Clock, Users, Lock, Crown, Star, Zap } from "lucide-react";
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

  const getEventPrice = (tier: string) => {
    switch (tier) {
      case "platinum": return "$150";
      case "gold": return "$85";
      case "silver": return "$45";
      default: return "Free";
    }
  };

  const formatEventDate = (date: string) => {
    const eventDate = new Date(date);
    const day = eventDate.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
    const dateNum = eventDate.getDate();
    return { day, date: dateNum };
  };

  const { day, date } = formatEventDate(event.eventDate.toString());

  return (
    <Card className={`relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.02] hover:-translate-y-1 ${hasAccess ? "" : "opacity-75"} bg-white group`}>
      {!hasAccess && (
        <div className="absolute inset-0 bg-black/10 flex items-center justify-center z-10">
          <div className="bg-white rounded-full p-3 shadow-lg">
            <Lock className="w-6 h-6 text-gray-600" />
          </div>
        </div>
      )}
      
      {/* Event Image */}
      <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
        <img
          src={event.imageUrl}
          alt={event.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        
        {/* Date Badge */}
        <div className="absolute top-4 left-4 bg-white rounded-lg p-2 text-center shadow-md transition-transform duration-300 group-hover:scale-105">
          <div className="text-xs font-medium text-gray-600">{day}</div>
          <div className="text-lg font-bold text-gray-900">{date}</div>
        </div>
        
        {/* Tier Badge */}
        <Badge className={`absolute top-4 right-4 ${tierColors[event.tier]} flex items-center gap-1 transition-transform duration-300 group-hover:scale-105`}>
          {tierIcons[event.tier]}
          {event.tier.charAt(0).toUpperCase() + event.tier.slice(1)}
        </Badge>
        
        {/* Price Badge */}
        <div className="absolute bottom-4 right-4 bg-white rounded-lg px-3 py-1 shadow-md transition-transform duration-300 group-hover:scale-105">
          <span className="text-lg font-bold text-gray-900">{getEventPrice(event.tier)}</span>
        </div>
      </div>
      
      <CardContent className="p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{event.title}</h3>
          <p className="text-sm text-gray-600 line-clamp-2">
            {event.description}
          </p>
        </div>

        <div className="space-y-2 mb-6">
          <div className="flex items-center text-sm text-gray-600">
            <Clock className="w-4 h-4 mr-2" />
            {format(new Date(event.eventDate), "h:mm a")}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="w-4 h-4 mr-2" />
            {event.tier === "platinum" ? "Manhattan, NY" : event.tier === "gold" ? "San Francisco, CA" : "Austin, TX"}
          </div>
        </div>

        <Button 
          className={`w-full transition-all duration-300 ${hasAccess 
            ? "bg-slate-800 hover:bg-slate-900 text-white hover:shadow-lg" 
            : "bg-orange-600 hover:bg-orange-700 text-white hover:shadow-lg hover:scale-[1.02]"
          }`}
          onClick={hasAccess ? undefined : onUpgrade}
        >
          {hasAccess ? "Reserve Spot" : (
            <>
              <Crown className="w-4 h-4 mr-2" />
              Upgrade to Access
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}