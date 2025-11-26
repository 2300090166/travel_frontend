import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Vehicle } from '@/data/mockData';
import { API_BASE } from '@/lib/backend';
import { Search } from 'lucide-react';

const AdminVehicles = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    price: '',
    image: '',
    description: '',
    capacity: '',
    features: '',
  });
  const { toast } = useToast();

  // Filter vehicles based on search query
  const filteredVehicles = vehicles.filter(vehicle =>
    vehicle.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vehicle.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const loadVehicles = async () => {
      try {
        const token = localStorage.getItem('travelease_token');
        const res = await fetch(`${API_BASE}/api/admin/vehicles`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        
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

  const handleDelete = async (id: string) => {
    try {
      const token = localStorage.getItem('travelease_token');
      const res = await fetch(`${API_BASE}/api/admin/vehicles/${id}`, {
        method: 'DELETE',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      
      if (res.ok) {
        setVehicles(vehicles.filter(v => v.id !== id));
        toast({ title: 'Success', description: 'Vehicle deleted', variant: 'success' });
        window.dispatchEvent(new Event('travelease_vehicles_updated'));
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete vehicle', variant: 'destructive' });
    }
  };

  const openEdit = (vehicle: Vehicle) => {
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
    setIsEditOpen(true);
  };
  
  const openAdd = () => {
    setEditingVehicle(null);
    setFormData({
      name: '',
      type: '',
      price: '',
      image: '',
      description: '',
      capacity: '',
      features: '',
    });
    setIsEditOpen(true);
  };

  const handleUpdate = async () => {
    const vehiclePayload = {
      name: formData.name || 'Untitled Vehicle',
      type: formData.type || 'Unknown',
      price: Number(formData.price) || 0,
      image: formData.image || 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&auto=format&fit=crop',
      description: formData.description || '',
      capacity: Number(formData.capacity) || 4,
      features: formData.features || '',
    };

    try {
      const token = localStorage.getItem('travelease_token');
      
      if (editingVehicle) {
        const res = await fetch(`${API_BASE}/api/admin/vehicles/${editingVehicle.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify(vehiclePayload),
        });
        
        if (res.ok) {
          const updated = await res.json();
          setVehicles(vehicles.map(v => v.id === editingVehicle.id ? updated : v));
          toast({ title: 'Success', description: 'Vehicle updated successfully!', variant: 'default' });
          window.dispatchEvent(new Event('travelease_vehicles_updated'));
          setIsEditOpen(false);
          setEditingVehicle(null);
        } else {
          toast({ title: 'Error', description: 'Failed to update vehicle', variant: 'destructive' });
        }
      } else {
        const res = await fetch(`${API_BASE}/api/admin/vehicles`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify(vehiclePayload),
        });
        
        if (res.ok) {
          const created = await res.json();
          setVehicles([...vehicles, created]);
          toast({ title: 'Success', description: 'Vehicle added successfully!', variant: 'default' });
          window.dispatchEvent(new Event('travelease_vehicles_updated'));
          setIsEditOpen(false);
          setEditingVehicle(null);
        } else {
          const errorText = await res.text();
          console.error('Error response:', errorText);
          toast({ title: 'Error', description: 'Failed to add vehicle', variant: 'destructive' });
        }
      }
    } catch (error) {
      console.error('Save error:', error);
      toast({ title: 'Error', description: 'Failed to save vehicle', variant: 'destructive' });
    }
  };

  const handleRequestDelete = (id: string) => {
    setConfirmDeleteId(id);
  };

  const confirmDelete = () => {
    if (!confirmDeleteId) return;
    handleDelete(confirmDeleteId);
    setConfirmDeleteId(null);
  };

  const cancelDelete = () => {
    setConfirmDeleteId(null);
  };

  const toggleAvailability = async (id: string) => {
    try {
      const vehicle = vehicles.find(v => v.id === id);
      if (!vehicle) return;

      const token = localStorage.getItem('travelease_token');
      const res = await fetch(`${API_BASE}/api/admin/vehicles/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          available: !vehicle.available,
        }),
      });

      if (res.ok) {
        const updated = await res.json();
        setVehicles(vehicles.map(v => v.id === id ? updated : v));
        toast({
          title: 'Updated',
          description: `Vehicle marked ${updated.available ? 'available' : 'unavailable'}`,
          variant: 'default',
        });
        window.dispatchEvent(new Event('travelease_vehicles_updated'));
      } else {
        toast({
          title: 'Error',
          description: 'Failed to update vehicle availability',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error toggling availability:', error);
      toast({
        title: 'Error',
        description: 'Failed to update vehicle availability',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Vehicle Management</h1>
            <p className="text-muted-foreground">Manage your fleet</p>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-[300px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search vehicles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button onClick={openAdd} className="bg-gradient-hero whitespace-nowrap">+ Add Vehicle</Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVehicles.map(vehicle => (
          <Card key={vehicle.id} className="overflow-hidden">
            <div className="relative">
              <img src={vehicle.image} alt={vehicle.name} className="w-full h-48 object-cover" />
              <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-medium ${vehicle.available ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                {vehicle.available ? 'Available' : 'Unavailable'}
              </div>
            </div>
            <div className="p-4">
              <div className="mb-3">
                <h3 className="font-semibold text-lg">{vehicle.name || 'N/A'}</h3>
                <p className="text-sm text-muted-foreground">{vehicle.type || 'Not Available'}</p>
              </div>
              <p className="text-sm mb-3 line-clamp-2 text-muted-foreground">{vehicle.description || 'No description available'}</p>
              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <Button 
                    onClick={() => toggleAvailability(vehicle.id)} 
                    variant="outline" 
                    className="flex-1 text-sm"
                    size="sm"
                  >
                    {vehicle.available ? 'Set Unavailable' : 'Set Available'}
                  </Button>
                  <Button onClick={() => openEdit(vehicle)} variant="outline" size="sm" className="flex-1 text-sm">
                    Edit
                  </Button>
                </div>
                <Button onClick={() => handleRequestDelete(vehicle.id)} variant="destructive" size="sm" className="w-full text-sm">
                  Delete
                </Button>
              </div>
            </div>
          </Card>
        ))}
        {filteredVehicles.length === 0 && (
          <div className="col-span-full">
            <Card>
              <div className="p-8 text-center text-muted-foreground">
                {searchQuery ? 'No vehicles found matching your search' : 'No vehicles available'}
              </div>
            </Card>
          </div>
        )}
      </div>
      {/* Edit/Add Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingVehicle ? 'Edit Vehicle' : 'Add New Vehicle'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Vehicle Name</Label>
                <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Input id="type" value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price</Label>
                <Input id="price" type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="capacity">Capacity</Label>
                <Input id="capacity" type="number" value={formData.capacity} onChange={(e) => setFormData({ ...formData, capacity: e.target.value })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="image">Image URL</Label>
              <Input id="image" value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="features">Features (comma separated)</Label>
              <Input id="features" value={formData.features} onChange={(e) => setFormData({ ...formData, features: e.target.value })} />
            </div>
            <div className="flex gap-2 pt-2">
              <Button onClick={handleUpdate} className="ml-auto">Save</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!confirmDeleteId} onOpenChange={() => setConfirmDeleteId(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Are you sure you want to delete this vehicle? This action cannot be undone.</p>
            <div className="flex gap-2 justify-end pt-4">
              <Button variant="outline" onClick={cancelDelete}>Cancel</Button>
              <Button variant="destructive" onClick={confirmDelete}>Delete</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminVehicles;
