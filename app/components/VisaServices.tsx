import React from 'react';
import { MessageCircle, Phone } from 'lucide-react';

const VisaServices: React.FC = () => {
  const handleWhatsApp = (service: string) => {
    const message = `Hello, I'm interested in ${service}. Could you please provide more information?`;
    const whatsappURL = `https://wa.me/971566402340?text=${encodeURIComponent(message)}`;
    window.open(whatsappURL, '_blank');
  };

  const handleCall = () => {
    window.open('tel:+97143328700', '_self');
  };

  const visaServices = [
    {
      id: 1,
      title: 'Dubai 30-Day Visa',
      description: 'Single entry tourist visa valid for 30 days',
      features: ['Single Entry', '30 Days Stay', 'Tourist Purpose', 'Quick Processing']
    },
    {
      id: 2,
      title: 'Dubai 60-Day Visa',
      description: 'Multiple entry tourist visa valid for 60 days',
      features: ['Multiple Entry', '60 Days Stay', 'Extended Tourism', 'Flexible Travel']
    },
    {
      id: 3,
      title: 'Visa Change Service',
      description: 'Change your current visa status in UAE',
      features: ['Status Change', 'Legal Process', 'Documentation Support', 'Government Liaison']
    },
    {
      id: 4,
      title: 'Global Visa Services',
      description: 'Visa services for multiple countries worldwide',
      features: ['Multiple Countries', 'Expert Guidance', 'Document Preparation', 'Application Support']
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold text-navy-900 mb-6">
            Visa Services
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Professional visa services for UAE and international destinations. Contact us for personalized assistance with your visa requirements.
          </p>
        </div>

        {/* Visa Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 mb-16">
          {visaServices.map((service) => (
            <div key={service.id} className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-2xl font-bold text-navy-900 mb-4">{service.title}</h3>
              <p className="text-gray-600 mb-6">{service.description}</p>
              
              <ul className="space-y-2 mb-8">
                {service.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-gray-700">
                    <span className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Process Steps */}
        <div className="mt-20">
          <h3 className="text-3xl font-bold text-center text-navy-900 mb-12">Our Visa Process</h3>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: '1', title: 'Consultation', desc: 'Contact us via WhatsApp or phone for initial consultation' },
              { step: '2', title: 'Documentation', desc: 'We guide you through required documents and preparation' },
              { step: '3', title: 'Application', desc: 'We handle the complete visa application process' },
              { step: '4', title: 'Delivery', desc: 'Receive your approved visa through secure delivery' }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-yellow-500 text-navy-900 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h4 className="text-lg font-bold text-navy-900 mb-2">{item.title}</h4>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact CTA */}
        <div className="mt-20 bg-navy-900 rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">Ready to Apply for Your Visa?</h3>
          <p className="text-gray-300 mb-6">Contact our visa experts for personalized assistance</p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => handleWhatsApp('Visa Services')}
              className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
            >
              <MessageCircle size={20} />
              WhatsApp Us
            </button>
            <button
              onClick={handleCall}
              className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-navy-900 px-6 py-3 rounded-lg font-medium transition-colors duration-200"
            >
              <Phone size={20} />
              Call Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisaServices;