import { Card } from '@/components/ui/card';
import { Target, Eye, Users, Award, Globe, Heart } from 'lucide-react';

const AboutUs = () => {
  const values = [
    {
      icon: <Heart className="w-6 h-6" />,
      title: 'Customer First',
      description: 'Your satisfaction and safety are our top priorities in every journey.'
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: 'Quality Service',
      description: 'Premium vehicles and professional service for unforgettable experiences.'
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: 'Wide Network',
      description: 'Extensive coverage across multiple destinations for your convenience.'
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Expert Team',
      description: 'Dedicated professionals committed to making your travel seamless.'
    }
  ];

  const stats = [
    { number: '50K+', label: 'Happy Customers' },
    { number: '200+', label: 'Vehicles Available' },
    { number: '100+', label: 'Destinations' },
    { number: '99%', label: 'Satisfaction Rate' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-hero text-white py-16 sm:py-20 md:py-24">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1920&auto=format&fit=crop')] bg-cover bg-center opacity-20"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold">About TravelEase</h1>
            <p className="text-lg sm:text-xl text-white/90">
              Your trusted partner in creating memorable travel experiences since 2015
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 sm:py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {stats.map((stat, index) => (
              <Card key={index} className="p-6 text-center hover:shadow-lg transition-shadow">
                <div className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-hero bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div className="text-sm sm:text-base text-muted-foreground">{stat.label}</div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-12 sm:py-16 md:py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto">
            <Card className="p-6 sm:p-8 hover:shadow-xl transition-shadow">
              <div className="bg-gradient-hero text-white p-3 rounded-lg w-fit mb-4">
                <Target className="w-6 h-6" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-4">Our Mission</h2>
              <p className="text-muted-foreground leading-relaxed">
                To revolutionize the travel experience by providing seamless, reliable, and premium vehicle booking services. 
                We aim to make every journey comfortable, safe, and memorable for our customers, enabling them to explore 
                the world with confidence and ease.
              </p>
            </Card>

            <Card className="p-6 sm:p-8 hover:shadow-xl transition-shadow">
              <div className="bg-gradient-hero text-white p-3 rounded-lg w-fit mb-4">
                <Eye className="w-6 h-6" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-4">Our Vision</h2>
              <p className="text-muted-foreground leading-relaxed">
                To become the world's most trusted travel management platform, setting new standards in customer service 
                and innovation. We envision a future where travel is accessible, sustainable, and enriching for everyone, 
                connecting people with places through exceptional experiences.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">Our Core Values</h2>
            <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 max-w-6xl mx-auto">
            {values.map((value, index) => (
              <Card key={index} className="p-6 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="bg-gradient-hero text-white p-3 rounded-lg w-fit mx-auto mb-4">
                  {value.icon}
                </div>
                <h3 className="text-lg font-bold mb-2">{value.title}</h3>
                <p className="text-muted-foreground text-sm">{value.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="p-8 sm:p-10 md:p-12 max-w-3xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">Get in Touch</h2>
            <p className="text-muted-foreground text-base sm:text-lg mb-6">
              Have questions? Our team is here to help you 24/7
            </p>
            <div className="space-y-3 text-left sm:text-center">
              <p className="text-base sm:text-lg">
                <span className="font-semibold">Phone:</span> +91 7995762616
              </p>
              <p className="text-base sm:text-lg">
                <span className="font-semibold">Email:</span> support@travelease.com
              </p>
              <p className="text-base sm:text-lg">
                <span className="font-semibold">Address:</span> Near KL University, Vijayawada, Andhara Pradesh.
              </p>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
