import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Vehicle } from '@/data/mockData';
import { Users, Settings, CheckCircle, XCircle, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { API_BASE } from '@/lib/backend';

const Booking = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter vehicles based on search query
  const filteredVehicles = vehicles.filter(vehicle =>
    vehicle.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vehicle.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vehicle.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const loadVehicles = async () => {
      try {
        // Try to fetch from backend first
        const res = await fetch(`${API_BASE}/api/vehicles`);
        if (res.ok) {
          const data = await res.json();
          setVehicles(data);
          // Also store in localStorage as backup
          localStorage.setItem('travelease_vehicles', JSON.stringify(data));
          return;
        }
      } catch (error) {
        console.warn('Failed to fetch vehicles from backend, using localStorage', error);
      }

      // Fallback to localStorage
      const storedVehicles = localStorage.getItem('travelease_vehicles');
      if (storedVehicles) {
        setVehicles(JSON.parse(storedVehicles));
      } else {
        // Import and use default vehicles
        import('@/data/mockData').then((module) => {
          setVehicles(module.vehicles);
        });
      }
    };

    loadVehicles();

    // reload vehicles when admin updates them in another part of the app
    const onUpdate = () => {
      const stored = localStorage.getItem('travelease_vehicles');
      if (stored) setVehicles(JSON.parse(stored));
    };
    window.addEventListener('travelease_vehicles_updated', onUpdate);
    return () => window.removeEventListener('travelease_vehicles_updated', onUpdate);
  }, []);

  const handleBookNow = (vehicle: Vehicle) => {
    if (!vehicle.available) {
      toast({
        title: 'Vehicle Unavailable',
        description: 'This vehicle is currently not available for booking.',
        variant: 'destructive',
      });
      return;
    }

    // Clear old delivery details for new booking
    localStorage.removeItem('delivery_details');
    localStorage.setItem('selected_vehicle', JSON.stringify(vehicle));
    toast({
      title: 'Vehicle Selected',
      description: `${vehicle.name} has been selected. Please enter delivery details.`,
    });
    navigate('/delivery-details');
  };

  return (
    <div className="min-h-screen py-12 sm:py-16 md:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 sm:mb-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold">Book Your Vehicle</h1>
            </div>
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                placeholder="Search vehicles by name, type, or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 py-6 text-base"
              />
            </div>
          </div>
          <p className="text-muted-foreground text-base sm:text-lg">
            Choose from our premium collection of vehicles for your next journey
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {filteredVehicles.length > 0 ? (
            filteredVehicles.map((vehicle) => (
            <Card 
              key={vehicle.id} 
              className={`overflow-hidden transition-all duration-300 hover:shadow-xl ${
                !vehicle.available ? 'opacity-75' : 'hover:-translate-y-2'
              }`}
            >
              <div className="relative h-56 sm:h-64 overflow-hidden">
                <img
                  src={vehicle.image}
                  alt={vehicle.name}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4">
                  <Badge 
                    variant={vehicle.available ? 'default' : 'destructive'}
                    className="flex items-center gap-1"
                  >
                    {vehicle.available ? (
                      <>
                        <CheckCircle className="w-3 h-3" />
                        Available
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3 h-3" />
                        Unavailable
                      </>
                    )}
                  </Badge>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-xl font-bold mb-1">{vehicle.name}</h3>
                    <p className="text-sm text-muted-foreground">{vehicle.type}</p>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Users className="w-4 h-4" />
                    <span>{vehicle.capacity}</span>
                  </div>
                </div>

                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                  {vehicle.description}
                </p>

                <div className="mb-4">
                  <div className="flex items-center gap-1 mb-2 text-sm text-muted-foreground">
                    <Settings className="w-4 h-4" />
                    <span>Features</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(() => {
                      const featuresArray = Array.isArray(vehicle.features) 
                        ? vehicle.features 
                        : (vehicle.features || '').split(',').map(f => f.trim()).filter(Boolean);
                      const displayFeatures = featuresArray.slice(0, 3);
                      
                      return (
                        <>
                          {displayFeatures.map((feature, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                          {featuresArray.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{featuresArray.length - 3} more
                            </Badge>
                          )}
                        </>
                      );
                    })()}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div>
                    <div className="text-2xl font-bold text-primary">₹{vehicle.price}</div>
                    <div className="text-xs text-muted-foreground">per day</div>
                  </div>
                  <Button
                    onClick={() => handleBookNow(vehicle)}
                    disabled={!vehicle.available}
                    className={vehicle.available ? 'bg-gradient-hero hover:opacity-90' : ''}
                  >
                    {vehicle.available ? 'Book Now' : 'Unavailable'}
                  </Button>
                </div>
              </div>
            </Card>
          ))
          ) : (
            <div className="col-span-full">
              <Card>
                <div className="p-12 text-center">
                  <Search className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-semibold mb-2">No vehicles found</h3>
                  <p className="text-muted-foreground">
                    {searchQuery 
                      ? 'Try adjusting your search terms'
                      : 'No vehicles available at the moment'
                    }
                  </p>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Booking;
