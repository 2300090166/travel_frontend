import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Vehicle } from '@/data/mockData';
import { Plus, Edit, Trash2, Car, ShoppingCart, Users, MessageSquare, Search } from 'lucide-react';
import { formatDateDDMMYYYY } from '@/lib/date';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';

const Admin = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchOrderId, setSearchOrderId] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    type: '',
    price: '',
    image: '',
    description: '',
    capacity: '',
    features: '',
  });
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>('vehicles');

  useEffect(() => {
    loadData();
  }, []);

  // Listen for new users and prepend into customers state
  useEffect(() => {
    function onUsersUpdated(e: any) {
      try {
        const user = e?.detail;
        if (!user) return;
        setCustomers((prev) => {
          if (prev.some((u) => u.username === user.username)) return prev;
          return [user, ...prev];
        });
      } catch (err) {}
    }

    window.addEventListener('travelease:usersUpdated', onUsersUpdated as EventListener);
    return () => window.removeEventListener('travelease:usersUpdated', onUsersUpdated as EventListener);
  }, []);

  // Listen for new orders and prepend into admin list when created elsewhere
  useEffect(() => {
    function onOrdersUpdated(e: any) {
      try {
        const order = e?.detail;
        if (!order) return;
        setOrders((prev) => {
          if (prev.some((o) => o.id === order.id || o.orderId === order.orderId)) return prev;
          return [order, ...prev];
        });
      } catch (err) {}
    }

    window.addEventListener('travelease:ordersUpdated', onOrdersUpdated as EventListener);
    return () => window.removeEventListener('travelease:ordersUpdated', onOrdersUpdated as EventListener);
  }, []);

  useEffect(() => {
    // Read hash from URL and set active tab accordingly
    const hash = (location.hash || '').replace('#', '');
    const validTabs = ['vehicles', 'orders', 'customers', 'feedback'];
    if (hash && validTabs.includes(hash)) {
      setActiveTab(hash);
    } else {
      setActiveTab('vehicles');
    }
  }, [location.hash]);

  const loadData = () => {
    const storedVehicles = localStorage.getItem('travelease_vehicles');
    const storedOrders = localStorage.getItem('travelease_orders');
    const storedUsers = localStorage.getItem('travelease_users');
    const storedFeedbacks = localStorage.getItem('travelease_feedbacks');

    if (storedVehicles) setVehicles(JSON.parse(storedVehicles));
    if (storedOrders) {
      try {
        const parsed = JSON.parse(storedOrders);
        if (Array.isArray(parsed)) {
          // sort newest first
          import('@/lib/orders').then(({ sortOrdersByLatest }) => setOrders(sortOrdersByLatest(parsed)));
        }
      } catch (err) {
        // fallback to raw
        setOrders(JSON.parse(storedOrders));
      }
    }
    if (storedUsers) setCustomers(JSON.parse(storedUsers).filter((u: any) => !u.isAdmin));
    if (storedFeedbacks) setFeedbacks(JSON.parse(storedFeedbacks));
  };

  if (!user?.isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleAddVehicle = () => {
    if (!formData.name || !formData.type || !formData.price) {
      toast({ title: 'Error', description: 'Please fill all required fields', variant: 'destructive' });
      return;
    }

    const newVehicle: Vehicle = {
      id: 'v' + Date.now(),
      name: formData.name,
      type: formData.type,
      price: Number(formData.price),
      image: formData.image || 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&auto=format&fit=crop',
      description: formData.description,
      available: true,
      capacity: Number(formData.capacity) || 5,
      features: formData.features.split(',').map(f => f.trim()).filter(f => f),
    };

    const updatedVehicles = [...vehicles, newVehicle];
    setVehicles(updatedVehicles);
    localStorage.setItem('travelease_vehicles', JSON.stringify(updatedVehicles));
    resetForm();
    setIsDialogOpen(false);
    toast({ title: 'Success', description: 'Vehicle added successfully' });
  };

  const handleUpdateVehicle = () => {
    if (!editingVehicle) return;

    const updatedVehicle = {
      ...editingVehicle,
      name: formData.name,
      type: formData.type,
      price: Number(formData.price),
      image: formData.image,
      description: formData.description,
      capacity: Number(formData.capacity),
      features: formData.features.split(',').map(f => f.trim()).filter(f => f),
    };

    const updatedVehicles = vehicles.map(v => v.id === editingVehicle.id ? updatedVehicle : v);
    setVehicles(updatedVehicles);
    localStorage.setItem('travelease_vehicles', JSON.stringify(updatedVehicles));
    resetForm();
    setEditingVehicle(null);
    setIsDialogOpen(false);
    toast({ title: 'Success', description: 'Vehicle updated successfully' });
  };

  const handleDeleteVehicle = (id: string) => {
    const updatedVehicles = vehicles.filter(v => v.id !== id);
    setVehicles(updatedVehicles);
    localStorage.setItem('travelease_vehicles', JSON.stringify(updatedVehicles));
    toast({ title: 'Success', description: 'Vehicle deleted successfully' });
  };

  const openEditDialog = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setFormData({
      name: vehicle.name,
      type: vehicle.type,
      price: vehicle.price.toString(),
      image: vehicle.image,
      description: vehicle.description,
      capacity: vehicle.capacity.toString(),
      features: Array.isArray(vehicle.features) ? vehicle.features.join(', ') : (vehicle.features || ''),
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      type: '',
      price: '',
      image: '',
      description: '',
      capacity: '',
      features: '',
    });
    setEditingVehicle(null);
  };

  const filteredOrders = searchOrderId 
    ? orders.filter(order => order.id.toLowerCase().includes(searchOrderId.toLowerCase()))
    : orders;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage vehicles, orders, customers, and feedback</p>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={(val: string) => {
          setActiveTab(val);
          // update the URL hash without adding history entries
          navigate(`${location.pathname}#${val}`, { replace: true });
        }}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
          <TabsTrigger value="vehicles" className="gap-2">
            <Car className="w-4 h-4" />
            Vehicles
          </TabsTrigger>
          <TabsTrigger value="orders" className="gap-2">
            <ShoppingCart className="w-4 h-4" />
            Orders
          </TabsTrigger>
          <TabsTrigger value="customers" className="gap-2">
            <Users className="w-4 h-4" />
            Customers
          </TabsTrigger>
          <TabsTrigger value="feedback" className="gap-2">
            <MessageSquare className="w-4 h-4" />
            Feedback
          </TabsTrigger>
        </TabsList>

        <TabsContent value="vehicles" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Vehicle Management</h2>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetForm} className="bg-gradient-hero">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Vehicle
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editingVehicle ? 'Edit Vehicle' : 'Add New Vehicle'}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Vehicle Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Luxury SUV"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="type">Type *</Label>
                      <Input
                        id="type"
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        placeholder="SUV"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="price">Price (₹) *</Label>
                      <Input
                        id="price"
                        type="number"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        placeholder="8500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="capacity">Capacity</Label>
                      <Input
                        id="capacity"
                        type="number"
                        value={formData.capacity}
                        onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                        placeholder="5"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="image">Image URL</Label>
                    <Input
                      id="image"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Vehicle description..."
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="features">Features (comma-separated)</Label>
                    <Input
                      id="features"
                      value={formData.features}
                      onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                      placeholder="GPS, AC, Leather Seats"
                    />
                  </div>
                  <Button
                    onClick={editingVehicle ? handleUpdateVehicle : handleAddVehicle}
                    className="w-full bg-gradient-hero"
                  >
                    {editingVehicle ? 'Update Vehicle' : 'Add Vehicle'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vehicles.map((vehicle) => (
              <Card key={vehicle.id}>
                <CardHeader className="p-0">
                  <img src={vehicle.image} alt={vehicle.name} className="w-full h-48 object-cover rounded-t-lg" />
                </CardHeader>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-lg">{vehicle.name}</h3>
                      <p className="text-sm text-muted-foreground">{vehicle.type}</p>
                    </div>
                    <p className="font-bold text-primary">₹{vehicle.price}</p>
                  </div>
                  <p className="text-sm mb-3 line-clamp-2">{vehicle.description}</p>
                  <div className="flex gap-2">
                    <Button onClick={() => openEditDialog(vehicle)} variant="outline" size="sm" className="flex-1">
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button onClick={() => handleDeleteVehicle(vehicle.id)} variant="destructive" size="sm" className="flex-1">
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="orders" className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <h2 className="text-2xl font-semibold">Orders & Bookings</h2>
            <div className="flex gap-2 w-full sm:w-auto">
              <Input
                placeholder="Search by Order ID..."
                value={searchOrderId}
                onChange={(e) => setSearchOrderId(e.target.value)}
                className="w-full sm:w-64"
              />
              <Button variant="outline" size="icon">
                <Search className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <div className="grid gap-4">
            {filteredOrders.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center text-muted-foreground">
                  No orders found
                </CardContent>
              </Card>
            ) : (
              filteredOrders.map((order) => (
                <Card key={order.id}>
                  <CardHeader>
                    <div className="flex flex-col sm:flex-row justify-between gap-2">
                      <div>
                        <CardTitle className="text-lg">Order #{order.orderId || order.id}</CardTitle>
                        <CardDescription>Customer: {order.customerName || order.customer_name || order.deliveryAddress?.name || 'N/A'}</CardDescription>
                      </div>
                      <Badge className={order.status === 'completed' ? 'bg-success' : 'bg-primary'}>
                        {order.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Vehicle</p>
                        <p className="font-semibold">{order.vehicleName}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Amount</p>
                        <p className="font-semibold">₹{order.amount}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Payment Method</p>
                        <p className="font-semibold">{order.paymentMethod || order.payment_method || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Booking Date</p>
                        <p className="font-semibold">{formatDateDDMMYYYY(order.bookingDate || order.booking_date)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Start Date</p>
                        <p className="font-semibold">{formatDateDDMMYYYY(order.startDate || order.start_date)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">End Date</p>
                        <p className="font-semibold">{formatDateDDMMYYYY(order.endDate || order.end_date)}</p>
                      </div>
                      <div className="sm:col-span-2">
                        <p className="text-muted-foreground">Delivery Address</p>
                        <p className="font-semibold">{order.deliveryAddress?.address || order.delivery_address || ''}{(order.deliveryAddress?.city || order.delivery_city) ? `, ${order.deliveryAddress?.city || order.delivery_city}` : ''}{(order.deliveryAddress?.state || order.delivery_state) ? `, ${order.deliveryAddress?.state || order.delivery_state}` : ''}{(order.deliveryAddress?.pincode || order.delivery_pincode) ? ` - ${order.deliveryAddress?.pincode || order.delivery_pincode}` : ''}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="customers" className="space-y-4">
          <h2 className="text-2xl font-semibold">Registered Customers</h2>
          <div className="grid gap-4">
            {customers.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center text-muted-foreground">
                  No customers registered yet
                </CardContent>
              </Card>
            ) : (
              customers.map((customer, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-hero flex items-center justify-center text-white font-bold">
                        {customer.username?.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold">{customer.username}</p>
                        <p className="text-sm text-muted-foreground">{customer.email}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="feedback" className="space-y-4">
          <h2 className="text-2xl font-semibold">Customer Feedback</h2>
          <div className="grid gap-4">
            {feedbacks.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center text-muted-foreground">
                  No feedback submitted yet
                </CardContent>
              </Card>
            ) : (
              feedbacks.map((feedback) => (
                <Card key={feedback.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{feedback.username}</CardTitle>
                        <CardDescription>{feedback.date}</CardDescription>
                      </div>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={i < feedback.rating ? 'text-accent' : 'text-muted'}>
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{feedback.review}</p>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;
