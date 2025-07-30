import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Header } from "@/components/header";
import { EventCard } from "@/components/event-card";
import { TierUpgradeModal } from "@/components/tier-upgrade-modal";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle, Info } from "lucide-react";
import type { Event } from "@shared/schema";

export default function Home() {
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, authLoading, toast]);

  const { 
    data: events = [], 
    isLoading: eventsLoading, 
    error: eventsError,
    refetch: refetchEvents
  } = useQuery<Event[]>({
    queryKey: ["/api/events"],
    enabled: isAuthenticated && !!user,
    retry: false,
  });

  // Handle unauthorized errors at endpoint level
  useEffect(() => {
    if (eventsError && isUnauthorizedError(eventsError as Error)) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [eventsError, toast]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="animate-pulse">
          <div className="h-16 bg-white border-b border-gray-200"></div>
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array(6).fill(0).map((_, i) => (
                <div key={i} className="bg-white rounded-xl p-6">
                  <Skeleton className="h-48 w-full mb-4" />
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const tierMessages = {
    free: "You have access to Free tier events only",
    silver: "You have access to Silver tier events and below", 
    gold: "You have access to Gold tier events and below",
    platinum: "You have access to all events including exclusive ones"
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} onUpgrade={() => setIsUpgradeModalOpen(true)} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Available Events</h2>
          <p className="text-gray-600 mb-4">Discover events available for your tier and below</p>
          
          {/* Tier Info Banner */}
          {user.tier !== "platinum" && (
            <Card className="bg-blue-50 border-blue-200 mb-6">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Info className="text-blue-500 mr-3 flex-shrink-0" />
                    <div>
                      <p className="text-blue-900 font-medium">{tierMessages[user.tier]}</p>
                      <p className="text-blue-700 text-sm">
                        Upgrade to {user.tier === "free" ? "Silver" : user.tier === "silver" ? "Gold" : "Platinum"} or higher for access to more exclusive events
                      </p>
                    </div>
                  </div>
                  <Button 
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={() => setIsUpgradeModalOpen(true)}
                  >
                    Upgrade
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
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
        {eventsError && !isUnauthorizedError(eventsError as Error) && (
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
