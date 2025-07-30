import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Logo } from "@/components/logo";
import { Calendar, Users, Star, Crown } from "lucide-react";

export default function Landing() {
  const tiers = [
    {
      name: "Free",
      color: "bg-gray-100 text-gray-800",
      icon: <Users className="w-4 h-4" />,
      features: ["Community events", "Basic networking", "Public workshops"]
    },
    {
      name: "Silver",
      color: "bg-slate-100 text-slate-800",
      icon: <Star className="w-4 h-4" />,
      features: ["Everything in Free", "Premium workshops", "Wine tastings"]
    },
    {
      name: "Gold",
      color: "bg-yellow-100 text-yellow-800",
      icon: <Crown className="w-4 h-4" />,
      features: ["Everything in Silver", "VIP networking", "Industry leaders"]
    },
    {
      name: "Platinum",
      color: "bg-purple-100 text-purple-800",
      icon: <Crown className="w-4 h-4" />,
      features: ["Everything in Gold", "Exclusive summits", "C-level access"]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Logo size="md" />
            <Button onClick={() => window.location.href = '/auth'}>
              Sign In
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Discover Events Made for 
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Your Tier</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join a tier-based event platform where exclusive experiences await at every level. 
            From community gatherings to elite summits.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => window.location.href = '/auth'}
            >
              <Calendar className="w-5 h-5 mr-2" />
              Start Exploring Events
            </Button>
            <Button size="lg" variant="outline">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Tiers Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Choose Your Tier</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Each tier unlocks access to events at your level and below, 
              giving you more exclusive experiences as you upgrade.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tiers.map((tier) => (
              <Card key={tier.name} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {tier.icon}
                    {tier.name}
                  </CardTitle>
                  <Badge className={tier.color}>{tier.name} Tier</Badge>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {tier.features.map((feature, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-start">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-3xl font-bold text-gray-900 mb-8">Why Event Hub?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Curated Events</h4>
              <p className="text-gray-600 text-sm">Hand-picked events tailored to each tier level</p>
            </div>
            <div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Exclusive Access</h4>
              <p className="text-gray-600 text-sm">Higher tiers unlock more exclusive experiences</p>
            </div>
            <div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Crown className="w-6 h-6 text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Premium Networking</h4>
              <p className="text-gray-600 text-sm">Connect with industry leaders and peers</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200">
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
    </div>
  );
}
