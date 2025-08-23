import React, { useState } from 'react';
import { CheckCircle, MessageCircle, Phone } from 'lucide-react';

const VisaServices: React.FC = () => {
  const [selectedVisa, setSelectedVisa] = useState('dubai-30');

  const handleWhatsAppInquiry = (visaType: string) => {
    const message = `Hi, I would like to inquire about the ${visaType} service. Could you please provide me with pricing and more details?`;
    const whatsappUrl = `https://wa.me/971582200451?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleLiveChatInquiry = () => {
    // Make a phone call to the specified number
    window.location.href = 'tel:+97143328700';
  };

  const visaOptions = [
    {
      id: 'dubai-30',
      title: 'Dubai Visit Visa - 30 Days',
      features: [
        'Single Entry',
        '30 Days Stay',
        'Tourist/Business Purpose',
        'Hotel Booking Required',
        'Flight Ticket Required'
      ]
    },
    {
      id: 'dubai-60',
      title: 'Dubai Visit Visa - 60 Days',
      features: [
        'Single Entry',
        '60 Days Stay',
        'Tourist/Business Purpose',
        'Hotel Booking Required',
        'Flight Ticket Required'
      ]
    },
    {
      id: 'visa-change',
      title: 'Visa Change A2A',
      features: [
        'Change Visit to Tourist',
        'Extend Stay Without Exit',
        'No Exit Required',
        'Emirates ID Collection',
        'Medical Test Included'
      ]
    },
    {
      id: 'global-visa',
      title: 'Global Visa Assistance',
      features: [
        'Multiple Countries',
        'Tourist/Business Visa',
        'Document Preparation',
        'Application Support',
        'Status Tracking'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold text-navy-900 mb-6">
            Hassle-Free Visa Processing
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our visa experts make your application process smooth and fast. From Dubai visit visas to global assistance, we've got you covered.
          </p>
        </div>

        {/* Visa Options */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {visaOptions.map((visa) => (
            <div
              key={visa.id}
              className={`bg-white rounded-2xl p-6 shadow-lg cursor-pointer transition-all duration-300 ${
                selectedVisa === visa.id
                  ? 'ring-4 ring-yellow-500 shadow-xl'
                  : 'hover:shadow-xl'
              }`}
              onClick={() => setSelectedVisa(visa.id)}
            >
              <div className="text-center mb-6">
                <h3 className="text-lg font-bold text-navy-900 mb-2">{visa.title}</h3>
                <div className="flex flex-col gap-2 mb-2 items-center">
                                    <button
                    onClick={() => handleWhatsAppInquiry(visa.title)}
                    className="bg-green-500 hover:bg-green-600 text-white px-1.5 py-1 rounded text-xs font-medium transition-colors duration-200 inline-flex items-center justify-center w-20"
                  >
                    <MessageCircle className="mr-0.5" size={10} />
                    WhatsApp
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLiveChatInquiry();
                    }}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-1.5 py-1 rounded text-xs font-medium transition-colors duration-200 inline-flex items-center justify-center w-20"
                  >
                    <Phone size={10} className="mr-0.5" />
                    Call
                  </button>
                </div>
              </div>
              
              <ul className="space-y-2">
                {visa.features.map((feature, index) => (
                  <li key={index} className="flex items-start text-sm text-gray-700">
                    <CheckCircle className="text-green-500 mr-2 mt-0.5 flex-shrink-0" size={16} />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Process Steps */}
        <div className="mt-20">
          <h3 className="text-3xl font-bold text-center text-navy-900 mb-12">Simple Application Process</h3>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: '1', title: 'Submit Application', desc: 'Fill out the form and upload required documents' },
              { step: '2', title: 'Document Review', desc: 'Our team reviews your application and documents' },
              { step: '3', title: 'Processing', desc: 'We submit your application to relevant authorities' },
              { step: '4', title: 'Visa Ready', desc: 'Receive your approved visa via email' }
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
      </div>
    </div>
  );
};

export default VisaServices;