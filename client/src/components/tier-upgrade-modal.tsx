import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Crown, Star, Users, Zap, Check, Loader2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Tier } from "@shared/schema";

interface TierUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTier: Tier;
}

export function TierUpgradeModal({ isOpen, onClose, currentTier }: TierUpgradeModalProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedTier, setSelectedTier] = useState<Tier | null>(null);

  const tiers = [
    {
      name: "free" as Tier,
      title: "Free",
      price: "$0",
      icon: <Users className="w-5 h-5" />,
      color: "bg-gray-100 text-gray-800",
      features: [
        "Community events access",
        "Basic networking opportunities", 
        "Public workshops",
        "Event calendar"
      ]
    },
    {
      name: "silver" as Tier,
      title: "Silver",
      price: "$29",
      icon: <Zap className="w-5 h-5" />,
      color: "bg-slate-100 text-slate-800",
      features: [
        "Everything in Free",
        "Premium workshops",
        "Wine tasting events",
        "Priority event booking",
        "Networking meetups"
      ]
    },
    {
      name: "gold" as Tier, 
      title: "Gold",
      price: "$59",
      icon: <Crown className="w-5 h-5" />,
      color: "bg-yellow-100 text-yellow-800",
      features: [
        "Everything in Silver",
        "VIP networking events",
        "Industry leader sessions",
        "Exclusive workshops",
        "1-on-1 mentoring"
      ]
    },
    {
      name: "platinum" as Tier,
      title: "Platinum", 
      price: "$99",
      icon: <Crown className="w-5 h-5" />,
      color: "bg-purple-100 text-purple-800",
      features: [
        "Everything in Gold",
        "Exclusive summit access",
        "C-level executive events",
        "Private dining experiences",
        "Concierge service"
      ]
    }
  ];

  const upgradeMutation = useMutation({
    mutationFn: async (newTier: Tier) => {
      const response = await apiRequest("PATCH", "/api/user/tier", { tier: newTier });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      queryClient.invalidateQueries({ queryKey: ["/api/events"] });
      toast({
        title: "Tier upgraded successfully!",
        description: `Welcome to ${selectedTier?.charAt(0).toUpperCase()}${selectedTier?.slice(1)} tier. You now have access to more exclusive events.`,
      });
      onClose();
    },
    onError: (error: Error) => {
      toast({
        title: "Upgrade failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const tierHierarchy = { free: 0, silver: 1, gold: 2, platinum: 3 };
  const currentTierIndex = tierHierarchy[currentTier];

  const handleUpgrade = () => {
    if (selectedTier) {
      upgradeMutation.mutate(selectedTier);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Upgrade Your Tier</DialogTitle>
          <DialogDescription>
            Choose a higher tier to unlock access to more exclusive events and premium features.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          {tiers.map((tier, index) => {
            const isCurrentTier = tier.name === currentTier;
            const isUpgrade = index > currentTierIndex;
            const isSelected = selectedTier === tier.name;

            return (
              <Card 
                key={tier.name} 
                className={`relative cursor-pointer transition-all ${
                  isCurrentTier 
                    ? "border-blue-300 bg-blue-50" 
                    : isSelected 
                    ? "border-green-300 bg-green-50 ring-2 ring-green-200"
                    : isUpgrade
                    ? "border-gray-200 hover:border-gray-300"
                    : "border-gray-100 opacity-60"
                }`}
                onClick={() => isUpgrade && setSelectedTier(tier.name)}
              >
                {isCurrentTier && (
                  <div className="absolute -top-3 left-4">
                    <Badge className="bg-blue-600 text-white">Current</Badge>
                  </div>
                )}
                
                {isSelected && (
                  <div className="absolute -top-3 right-4">
                    <Badge className="bg-green-600 text-white">
                      <Check className="w-3 h-3 mr-1" />
                      Selected
                    </Badge>
                  </div>
                )}

                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {tier.icon}
                      <CardTitle className="text-lg">{tier.title}</CardTitle>
                    </div>
                    <Badge className={tier.color}>{tier.name}</Badge>
                  </div>
                  <CardDescription className="text-2xl font-bold text-gray-900">
                    {tier.price}<span className="text-sm font-normal text-gray-600">/month</span>
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <ul className="space-y-2">
                    {tier.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start text-sm">
                        <Check className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {selectedTier && (
          <div className="flex items-center justify-between pt-6 border-t">
            <div>
              <p className="text-sm text-gray-600">
                Upgrading to <span className="font-semibold capitalize">{selectedTier}</span> tier
              </p>
              <p className="text-xs text-gray-500">
                This is a demo upgrade. In production, this would integrate with a payment system.
              </p>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button 
                onClick={handleUpgrade}
                disabled={upgradeMutation.isPending}
                className="bg-green-600 hover:bg-green-700"
              >
                {upgradeMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Upgrading...
                  </>
                ) : (
                  `Upgrade to ${selectedTier?.charAt(0).toUpperCase()}${selectedTier?.slice(1)}`
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}