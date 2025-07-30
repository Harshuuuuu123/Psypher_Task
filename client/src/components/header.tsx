import { useState } from "react";
import { Crown, User, LogOut, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { User as UserType } from "@shared/schema";

interface HeaderProps {
  user: UserType;
  onUpgrade: () => void;
}

const tierColors = {
  free: "bg-gray-100 text-gray-800",
  silver: "bg-slate-100 text-slate-800",
  gold: "bg-yellow-100 text-yellow-800", 
  platinum: "bg-purple-100 text-purple-800"
};

export function Header({ user, onUpgrade }: HeaderProps) {
  const handleSignOut = () => {
    window.location.href = '/api/logout';
  };

  const displayName = user.firstName && user.lastName 
    ? `${user.firstName} ${user.lastName}`
    : user.email || 'User';

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-gray-900">Event Hub</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Current Tier Badge */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Current Tier:</span>
              <Badge className={tierColors[user.tier]}>
                <span className={`w-2 h-2 rounded-full mr-2 ${
                  user.tier === 'free' ? 'bg-gray-600' :
                  user.tier === 'silver' ? 'bg-slate-600' :
                  user.tier === 'gold' ? 'bg-yellow-600' :
                  'bg-purple-600'
                }`}></span>
                {user.tier}
              </Badge>
            </div>

            {/* User Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-3">
                  {user.profileImageUrl ? (
                    <img 
                      src={user.profileImageUrl} 
                      alt="Profile" 
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                      <User className="w-4 h-4 text-gray-600" />
                    </div>
                  )}
                  <span className="hidden sm:block font-medium">{displayName}</span>
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={onUpgrade}>
                  <Crown className="w-4 h-4 mr-2 text-purple-500" />
                  Upgrade Tier
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <User className="w-4 h-4 mr-2" />
                  Profile Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
