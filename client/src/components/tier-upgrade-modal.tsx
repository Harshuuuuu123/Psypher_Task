import { useState } from "react";
import { Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Tier } from "@shared/schema";

interface TierUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTier: Tier;
}

const tierInfo = {
  silver: { price: "$19/mo", level: 1 },
  gold: { price: "$29/mo", level: 2 },
  platinum: { price: "$99/mo", level: 3 }
};

export function TierUpgradeModal({ isOpen, onClose, currentTier }: TierUpgradeModalProps) {
  const [selectedTier, setSelectedTier] = useState<Tier>("gold");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const upgradeMutation = useMutation({
    mutationFn: async (tier: Tier) => {
      await apiRequest("PATCH", "/api/user/tier", { tier });
    },
    onSuccess: () => {
      toast({
        title: "Tier Upgraded Successfully!",
        description: `You've been upgraded to ${selectedTier} tier.`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      queryClient.invalidateQueries({ queryKey: ["/api/events"] });
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Upgrade Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleUpgrade = () => {
    upgradeMutation.mutate(selectedTier);
  };

  const currentTierLevel = tierInfo[currentTier as keyof typeof tierInfo]?.level ?? 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Crown className="text-white text-2xl" />
          </div>
          <DialogTitle className="text-2xl text-center">Upgrade Your Tier</DialogTitle>
          <DialogDescription className="text-center">
            Unlock access to premium events
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {(["silver", "gold", "platinum"] as const).map((tier) => {
            const info = tierInfo[tier];
            const isCurrentTier = tier === currentTier;
            const isLowerTier = info.level <= currentTierLevel;
            
            if (isLowerTier) return null;

            return (
              <Card 
                key={tier}
                className={`cursor-pointer transition-colors ${
                  selectedTier === tier 
                    ? tier === "platinum" 
                      ? "border-purple-300 bg-purple-50" 
                      : "border-yellow-300 bg-yellow-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => setSelectedTier(tier)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900 flex items-center">
                        <span className={`w-3 h-3 rounded-full mr-2 ${
                          tier === "silver" ? "bg-slate-500" :
                          tier === "gold" ? "bg-yellow-500" :
                          "bg-purple-600"
                        }`}></span>
                        {tier.charAt(0).toUpperCase() + tier.slice(1)} Tier
                        {tier === "platinum" && (
                          <span className="ml-2 bg-purple-600 text-white text-xs px-2 py-1 rounded-full">
                            PREMIUM
                          </span>
                        )}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Access to {tier} and below events
                        {tier === "platinum" && " including exclusive ones"}
                      </p>
                    </div>
                    <span className="text-xl font-bold text-gray-900">{info.price}</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="flex space-x-3 pt-4">
          <Button variant="outline" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            className="flex-1 bg-purple-600 hover:bg-purple-700" 
            onClick={handleUpgrade}
            disabled={upgradeMutation.isPending}
          >
            {upgradeMutation.isPending ? "Upgrading..." : "Upgrade Now"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
