import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { Crown, LogOut, Settings, User as UserIcon, Zap } from "lucide-react";
import type { User } from "@shared/schema";

interface HeaderProps {
  user: User;
  onUpgrade: () => void;
}

export function Header({ user, onUpgrade }: HeaderProps) {
  const { logoutMutation } = useAuth();
  
  const tierColors = {
    free: "bg-gray-100 text-gray-800",
    silver: "bg-slate-100 text-slate-800", 
    gold: "bg-yellow-100 text-yellow-800",
    platinum: "bg-purple-100 text-purple-800"
  };

  const tierIcons = {
    free: null,
    silver: <Zap className="w-3 h-3" />,
    gold: <Crown className="w-3 h-3" />, 
    platinum: <Crown className="w-3 h-3" />
  };

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const getInitials = (firstName?: string | null, lastName?: string | null, username?: string) => {
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase();
    }
    if (firstName) {
      return firstName[0].toUpperCase();
    }
    if (username) {
      return username.slice(0, 2).toUpperCase();
    }
    return "U";
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-gray-900">Event Hub</h1>
          </div>

          {/* User Section */}
          <div className="flex items-center space-x-4">
            {/* Tier Badge */}
            <Badge className={`${tierColors[user.tier]} flex items-center gap-1`}>
              {tierIcons[user.tier]}
              {user.tier.charAt(0).toUpperCase() + user.tier.slice(1)} Tier
            </Badge>

            {/* Upgrade Button */}
            {user.tier !== "platinum" && (
              <Button
                size="sm"
                variant="outline"
                onClick={onUpgrade}
                className="border-blue-300 text-blue-600 hover:bg-blue-50"
              >
                <Crown className="w-4 h-4 mr-1" />
                Upgrade
              </Button>
            )}

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-blue-100 text-blue-600">
                      {getInitials(user.firstName, user.lastName, user.username)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium text-sm">
                      {user.firstName && user.lastName 
                        ? `${user.firstName} ${user.lastName}`
                        : user.username
                      }
                    </p>
                    {user.email && (
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    )}
                  </div>
                </div>
                <DropdownMenuItem>
                  <UserIcon className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}