import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { Car, ShoppingCart, Users, MessageSquare, ArrowRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import AdminVehicles from './Vehicles';

const AdminHome = () => {
  const { user } = useAuth();
  const [vehiclesCount, setVehiclesCount] = useState(0);
  const [ordersCount, setOrdersCount] = useState(0);
  const [customersCount, setCustomersCount] = useState(0);
  const [feedbackCount, setFeedbackCount] = useState(0);

  useEffect(() => {
    const v = JSON.parse(localStorage.getItem('travelease_vehicles') || '[]');
    const o = JSON.parse(localStorage.getItem('travelease_orders') || '[]');
    const u = JSON.parse(localStorage.getItem('travelease_users') || '[]').filter((x: any) => !x.isAdmin);
    const f = JSON.parse(localStorage.getItem('travelease_feedbacks') || '[]');
    setVehiclesCount(v.length);
    setOrdersCount(o.length);
    setCustomersCount(u.length);
    setFeedbackCount(f.length);
  }, []);

  return (
    <>
      {/* Hero - welcome admin */}
      <section className="relative bg-gradient-hero text-white py-16 sm:py-20 md:py-24 lg:py-32 overflow-hidden">
         <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1920&auto=format&fit=crop')] bg-cover bg-center opacity-20"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Welcome back, {user?.username || 'Admin'}!
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-white/90">
              Manage your fleet, orders, customers, and feedback from the admin console.
            </p>
            
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">High level overview</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-8">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="p-4 rounded-full bg-blue-100">
              <Car className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold">Vehicles</h3>
          </div>
        </Card>

        <Card className="p-8">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="p-4 rounded-full bg-green-100">
              <ShoppingCart className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold">Orders</h3>
          </div>
        </Card>

        <Card className="p-8">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="p-4 rounded-full bg-purple-100">
              <Users className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold">Customers</h3>
          </div>
        </Card>

        <Card className="p-8">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="p-4 rounded-full bg-orange-100">
              <MessageSquare className="w-8 h-8 text-orange-600" />
            </div>
            <h3 className="text-xl font-semibold">Feedback</h3>
          </div>
        </Card>
      </div>
    </div>
    </>
  );
};

export default AdminHome;
