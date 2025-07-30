import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { EventCard } from "@/components/event-card";
import { TierUpgradeModal } from "@/components/tier-upgrade-modal";
import { Logo } from "@/components/logo";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Crown, User, LogOut, Calendar, AlertTriangle, Info } from "lucide-react";
import type { Event } from "@shared/schema";

export default function Home() {
  const { user, logoutMutation } = useAuth();
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

  const { 
    data: events = [], 
    isLoading: eventsLoading, 
    error: eventsError,
    refetch: refetchEvents
  } = useQuery<Event[]>({
    queryKey: ["/api/events"],
    enabled: !!user,
    retry: false,
  });

  if (!user) {
    return null;
  }

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "platinum": return "bg-purple-100 text-purple-800 border-purple-200";
      case "gold": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "silver": return "bg-gray-100 text-gray-800 border-gray-200";
      default: return "bg-green-100 text-green-800 border-green-200";
    }
  };

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case "platinum": return <Crown className="h-4 w-4" />;
      case "gold": return <Crown className="h-4 w-4" />;
      case "silver": return <Crown className="h-4 w-4" />;
      default: return <User className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Logo size="md" />
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Welcome back, {user.firstName || user.username}!
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Your tier:</span>
                  <Badge className={`${getTierColor(user.tier)} flex items-center gap-1`}>
                    {getTierIcon(user.tier)}
                    <span className="capitalize">{user.tier}</span>
                  </Badge>
                </div>
              </div>
              
              <Button
                onClick={() => setIsUpgradeModalOpen(true)}
                className="bg-orange-600 hover:bg-orange-700 text-white"
              >
                <Crown className="h-4 w-4 mr-2" />
                Upgrade Tier
              </Button>
              
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-orange-100 text-orange-800">
                  {(user.firstName?.[0] || user.username[0]).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => logoutMutation.mutate()}
                className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Exclusive Events</h1>
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <Calendar className="h-4 w-4" />
              <span className="text-sm">
                {events.length} event{events.length !== 1 ? 's' : ''} available
              </span>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {eventsLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(6).fill(0).map((_, index) => (
              <Card key={index} className="p-6 animate-pulse">
                <Skeleton className="h-48 w-full mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-3 w-3/4 mb-4" />
                <div className="flex justify-between items-center">
                  <Skeleton className="h-3 w-1/4" />
                  <Skeleton className="h-6 w-1/3" />
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Error State */}
        {eventsError && (
          <div className="text-center py-12">
            <AlertTriangle className="w-16 h-16 text-red-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Failed to Load Events</h3>
            <p className="text-gray-600 mb-6">There was an error loading the events. Please try again.</p>
            <Button onClick={() => refetchEvents()}>
              Retry
            </Button>
          </div>
        )}

        {/* Events Grid */}
        {!eventsLoading && !eventsError && events.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                userTier={user.tier}
                onUpgrade={() => setIsUpgradeModalOpen(true)}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!eventsLoading && !eventsError && events.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Info className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Events Available</h3>
            <p className="text-gray-600 mb-6">There are currently no events available for your tier.</p>
            <Button onClick={() => setIsUpgradeModalOpen(true)}>
              Upgrade Your Tier
            </Button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-gray-600 text-sm">© 2024 Event Hub. All rights reserved.</p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-600 hover:text-gray-900 text-sm">Privacy Policy</a>
              <a href="#" className="text-gray-600 hover:text-gray-900 text-sm">Terms of Service</a>
              <a href="#" className="text-gray-600 hover:text-gray-900 text-sm">Support</a>
            </div>
          </div>
        </div>
      </footer>

      <TierUpgradeModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
        currentTier={user.tier}
      />
    </div>
  );
}
