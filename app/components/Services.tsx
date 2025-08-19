import React from 'react';
import { Plane, FileText, Briefcase, Users, CreditCard, Building2, ArrowRight } from 'lucide-react';

interface ServicesProps {
  setActiveSection: (section: string) => void;
}

const Services: React.FC<ServicesProps> = ({ setActiveSection }) => {
  const services = [
    {
      icon: Plane,
      title: 'Travel Services',
      description: 'Flight & hotel bookings with competitive rates and seamless experiences.',
      features: ['Flight Booking', 'Hotel Reservations', 'Travel Planning'],
      section: 'travel'
    },
    {
      icon: FileText,
      title: 'Visa Services',
      description: 'Hassle-free visa processing for Dubai visits and global destinations.',
      features: ['Dubai Visit Visa', 'Visa Change A2A', 'Global Assistance'],
      section: 'visa'
    },
    {
      icon: Briefcase,
      title: 'Work Permits',
      description: 'European work permits with comprehensive job placement support.',
      features: ['Czech Republic', 'Poland', 'Slovakia', 'Serbia', 'Ukraine'],
      section: 'work-permits'
    },
    {
      icon: Users,
      title: 'UAE Jobs',
      description: 'Direct employment opportunities across multiple UAE industries.',
      features: ['Hospitality', 'Construction', 'Administration', 'Sales'],
      section: 'uae-jobs'
    },
    {
      icon: Building2,
      title: 'Document Services',
      description: 'Professional business and document support services.',
      features: ['Translation', 'Attestation', 'Typing Services'],
      section: 'documents'
    },
    {
      icon: CreditCard,
      title: 'Secure Payments',
      description: 'Multi-currency payment options with trusted gateways.',
      features: ['EUR/USD/AED', 'Secure Processing', 'Multiple Methods'],
      section: 'payments'
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-navy-900 mb-6">
            Comprehensive Global Services
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From travel planning to work permits, we provide end-to-end solutions for your international needs
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer"
              onClick={() => setActiveSection(service.section)}
            >
              <div className="mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
                  <service.icon className="text-white" size={28} />
                </div>
                <h3 className="text-2xl font-bold text-navy-900 mb-2">{service.title}</h3>
                <p className="text-gray-600 mb-4">{service.description}</p>
              </div>

              <div className="space-y-2 mb-6">
                {service.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center text-sm text-gray-700">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
                    {feature}
                  </div>
                ))}
              </div>

              <div className="flex items-center text-yellow-600 font-semibold group-hover:text-yellow-700 transition-colors">
                Learn More
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={16} />
              </div>
            </div>
          ))}
        </div>

        {/* Testimonials Section */}
        <div className="mt-20">
          <h3 className="text-3xl font-bold text-center text-navy-900 mb-12">What Our Clients Say</h3>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Ahmed Al-Mansouri",
                role: "Business Owner",
                content: "Perry Eden helped me secure work permits for my team in Poland. Professional service and quick processing.",
                rating: 5
              },
              {
                name: "Maria Santos",
                role: "Tourist",
                content: "Excellent visa service for my Dubai trip. Everything was handled smoothly and on time.",
                rating: 5
              },
              {
                name: "John Mitchell",
                role: "Expatriate",
                content: "Their document attestation service saved me weeks of paperwork. Highly recommended!",
                rating: 5
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-lg">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <div key={i} className="w-5 h-5 text-yellow-500">★</div>
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">"{testimonial.content}"</p>
                <div>
                  <div className="font-semibold text-navy-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-600">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;