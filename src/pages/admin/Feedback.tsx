import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { API_BASE } from '@/lib/backend';
import { Clock } from 'lucide-react';

const AdminFeedback = () => {
  const [feedbacks, setFeedbacks] = useState<any[]>([]);

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('en-IN', { 
        day: '2-digit', 
        month: 'short', 
        year: 'numeric' 
      }),
      time: date.toLocaleTimeString('en-IN', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      })
    };
  };

  useEffect(() => {
    const loadFeedback = async () => {
      try {
        const token = localStorage.getItem('travelease_token');
        const res = await fetch(`${API_BASE}/api/admin/feedback`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        
        if (res.ok) {
          const data = await res.json();
          setFeedbacks(data);
        } else {
          console.error('Failed to load feedback from backend');
        }
      } catch (error) {
        console.error('Error loading feedback:', error);
      }
    };

    loadFeedback();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Customer Feedback</h1>
        <p className="text-muted-foreground">Feedback from customers</p>
      </div>

      <div className="grid gap-4">
        {feedbacks.length === 0 ? (
          <Card>
            <div className="p-8 text-center text-muted-foreground">No feedback submitted yet</div>
          </Card>
        ) : (
          feedbacks.map(f => {
            const dateTime = formatDateTime(f.date || f.createdAt || new Date().toISOString());
            return (
              <Card key={f.id}>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{f.name || f.username || 'Anonymous'}</h3>
                      <p className="text-sm mt-1"><strong>Subject:</strong> {f.subject || '—'}</p>
                      <p className="text-sm"><strong>Email:</strong> {f.email || '—'}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
                        <Clock className="w-4 h-4" />
                        <span>{dateTime.time}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{dateTime.date}</p>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-border">
                    <p className="text-sm"><strong>Message:</strong> {f.message || f.description || f.review || 'No feedback provided'}</p>
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};

export default AdminFeedback;
