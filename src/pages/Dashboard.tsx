import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { API_BASE } from '@/lib/backend';

const Dashboard = () => {
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState<any[]>([]);

  useEffect(() => {
    const loadVehicles = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/vehicles`);
        if (res.ok) {
          const data = await res.json();
          setVehicles(data);
        }
      } catch (error) {
        console.error('Error loading vehicles:', error);
      }
    };

    loadVehicles();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-hero text-white py-16 sm:py-20 md:py-24 lg:py-32 overflow-hidden">
        {/* hero background image removed per request */}
         <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1920&auto=format&fit=crop')] bg-cover bg-center opacity-20"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Welcome back, {user?.username}!
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-white/90">
              Your next adventure is just a booking away. Explore our premium vehicle collection.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link to="/booking">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8">
                  Browse Vehicles
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      

      {/* Featured Vehicles */}
      <section className="py-12 sm:py-16 md:py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">Vehicles</h2>
            <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
              Explore our handpicked selection of premium vehicles
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {vehicles.slice(0, 3).map((vehicle) => (
              <Card key={vehicle.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <div className="relative h-48 sm:h-56 overflow-hidden">
                  <img
                    src={vehicle.image}
                    alt={vehicle.name}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                  />
                  {!vehicle.available && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <span className="text-white font-semibold text-lg">Currently Unavailable</span>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold">{vehicle.name}</h3>
                    <span className="text-sm text-muted-foreground">{vehicle.type}</span>
                  </div>
                  <p className="text-muted-foreground text-sm mb-4">{vehicle.description}</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold text-primary">₹{vehicle.price}</span>
                      <span className="text-muted-foreground text-sm">/day</span>
                    </div>
                    <Link to="/booking">
                      <Button className="bg-gradient-hero" disabled={!vehicle.available}>
                        Book Now
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link to="/booking">
              <Button size="lg" variant="outline" className="text-base">
                View All Vehicles
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
