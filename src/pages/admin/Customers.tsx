import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { API_BASE } from '@/lib/backend';
import { Search } from 'lucide-react';

const AdminCustomers = () => {
  const [customers, setCustomers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter customers based on search query
  const filteredCustomers = customers.filter(customer =>
    customer.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const loadCustomers = async () => {
      try {
        const token = localStorage.getItem('travelease_token');
        const res = await fetch(`${API_BASE}/api/admin/customers`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        
        if (res.ok) {
          const data = await res.json();
          setCustomers(data);
        } else {
          console.error('Failed to load customers from backend');
        }
      } catch (error) {
        console.error('Error loading customers:', error);
      }
    };

    loadCustomers();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Registered Customers</h1>
            <p className="text-muted-foreground">Manage customers</p>
          </div>
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search by username or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        {filteredCustomers.length === 0 ? (
          <Card>
            <div className="p-8 text-center text-muted-foreground">
              {searchQuery ? 'No customers found matching your search' : 'No customers registered yet'}
            </div>
          </Card>
        ) : (
          filteredCustomers.map((c, idx) => (
            <Card key={idx}>
              <div className="p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-hero flex items-center justify-center text-white font-bold">{c.username?.charAt(0).toUpperCase()}</div>
                <div>
                  <p className="font-semibold">{c.username}</p>
                  <p className="text-sm text-muted-foreground">{c.email}</p>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminCustomers;
