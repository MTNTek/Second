import React, { useState } from 'react';
import { FileText, Stamp, Award, Car, CreditCard, Building, CheckCircle, MessageCircle } from 'lucide-react';

const DocumentServices: React.FC = () => {
  const [selectedService, setSelectedService] = useState('translation');

  const handleWhatsAppInquiry = (serviceTitle: string) => {
    const message = `Hi, I would like to inquire about ${serviceTitle} service. Could you please provide me with more details and pricing?`;
    const whatsappUrl = `https://wa.me/971566402340?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const services = [
    {
      id: 'translation',
      title: 'Document Translation',
      icon: FileText,
      description: 'Professional translation services for all document types',
      features: [
        'Certified Translations',
        'Legal Documents',
        'Academic Certificates',
        'Business Documents',
        '24-hour Turnaround'
      ],
      languages: ['Arabic', 'English', 'Hindi', 'Urdu', 'Filipino', 'French']
    },
    {
      id: 'stamps',
      title: 'Stamp Making',
      icon: Stamp,
      description: 'Custom rubber stamps and seals for businesses and individuals',
      features: [
        'Company Seals',
        'Personal Stamps',
        'Address Stamps',
        'Signature Stamps',
        'Same-day Service'
      ],
      types: ['Rubber Stamps', 'Self-Inking', 'Date Stamps', 'Logo Stamps']
    },
    {
      id: 'attestation',
      title: 'Certificate Attestation',
      icon: Award,
      description: 'Embassy and MOFA attestation for educational and personal documents',
      features: [
        'Educational Certificates',
        'Marriage Certificates',
        'Birth Certificates',
        'Commercial Documents',
        'Power of Attorney'
      ],
      process: ['Notary', 'MOFA', 'Embassy', 'Consulate']
    },
    {
      id: 'rta-fines',
      title: 'RTA Fine Payment',
      icon: Car,
      description: 'Convenient payment of RTA traffic fines and violations',
      features: [
        'Online Payment',
        'Multiple Payment Methods',
        'Instant Receipt',
        'Fine History Check',
        'Vehicle Registration Check'
      ],
      benefits: ['Time Saving', 'Secure Payment', 'Instant Confirmation']
    },
    {
      id: 'visa-typing',
      title: 'Visa Typing',
      icon: CreditCard,
      description: 'Professional visa application form filling and typing services',
      features: [
        'Application Forms',
        'Supporting Letters',
        'Cover Letters',
        'Sponsorship Letters',
        'Error-free Typing'
      ],
      visaTypes: ['Visit Visa', 'Tourist Visa', 'Business Visa', 'Transit Visa']
    },
    {
      id: 'tenancy',
      title: 'Tenancy Contract Typing',
      icon: Building,
      description: 'Professional tenancy contract preparation and typing',
      features: [
        'Standard Contracts',
        'Custom Agreements',
        'Amendment Letters',
        'Renewal Contracts',
        'Legal Compliance'
      ],
      includes: ['Typing', 'Printing', 'Review', 'Corrections']
    }
  ];

  const currentService = services.find(s => s.id === selectedService);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold text-navy-900 mb-6">
            Professional Document & Business Services
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We assist you with all your documentation needs, from translations to attestations, making your paperwork hassle-free.
          </p>
        </div>

        {/* Service Selection */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          {services.map((service) => (
            <button
              key={service.id}
              onClick={() => setSelectedService(service.id)}
              className={`p-6 rounded-xl text-left transition-all duration-200 ${
                selectedService === service.id
                  ? 'bg-yellow-500 text-navy-900 shadow-xl'
                  : 'bg-white text-gray-700 hover:bg-gray-50 shadow-lg'
              }`}
            >
              <service.icon className="mb-3" size={32} />
              <h3 className="text-lg font-bold mb-2">{service.title}</h3>
              <p className="text-sm">{service.description}</p>
            </button>
          ))}
        </div>

        {/* Service Details */}
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl p-8 shadow-lg mb-12">
            <div className="flex items-center mb-6">
              {currentService && <currentService.icon className="mr-4 text-yellow-500" size={36} />}
              <div>
                <h2 className="text-3xl font-bold text-navy-900">{currentService?.title}</h2>
                <p className="text-gray-600">{currentService?.description}</p>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold text-navy-900 mb-4">Service Features</h3>
                <ul className="space-y-3">
                  {currentService?.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <CheckCircle className="text-green-500 mr-3" size={20} />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                {(currentService?.languages || currentService?.types || currentService?.process || currentService?.benefits || currentService?.visaTypes || currentService?.includes) && (
                  <div className="mt-6">
                    <h4 className="font-semibold text-navy-900 mb-3">
                      {currentService.languages && 'Supported Languages'}
                      {currentService.types && 'Stamp Types'}
                      {currentService.process && 'Process Steps'}
                      {currentService.benefits && 'Additional Benefits'}
                      {currentService.visaTypes && 'Visa Types'}
                      {currentService.includes && 'Includes'}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {(currentService.languages || currentService.types || currentService.process || currentService.benefits || currentService.visaTypes || currentService.includes)?.map((item, index) => (
                        <span
                          key={index}
                          className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-xl font-bold text-navy-900 mb-4">Request Service</h3>
                
                <div className="text-center">
                  <p className="text-gray-600 mb-6">
                    Get in touch with us via WhatsApp for immediate assistance and personalized quotes for your document service needs.
                  </p>
                  
                  <button 
                    onClick={() => handleWhatsAppInquiry(currentService?.title || 'Document Services')}
                    className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center mx-auto"
                  >
                    <MessageCircle className="mr-2" size={20} />
                    Contact us on WhatsApp
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Process Overview */}
        <div className="max-w-6xl mx-auto mb-12">
          <h3 className="text-3xl font-bold text-center text-navy-900 mb-12">How It Works</h3>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: '1', title: 'Submit Request', desc: 'Fill out the service request form with your requirements' },
              { step: '2', title: 'Quotation', desc: 'Receive detailed quotation and timeline for your service' },
              { step: '3', title: 'Processing', desc: 'Our experts handle your documents with care and precision' },
              { step: '4', title: 'Delivery', desc: 'Collect your completed documents or receive via email/courier' }
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

        {/* Why Choose Us */}
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <h3 className="text-3xl font-bold text-center text-navy-900 mb-8">Why Choose Our Services?</h3>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Professional Quality',
                description: 'All services performed by experienced professionals with attention to detail.',
                icon: '⭐'
              },
              {
                title: 'Quick Turnaround',
                description: 'Fast processing times with same-day service available for urgent requests.',
                icon: '⚡'
              },
              {
                title: 'Competitive Pricing',
                description: 'Affordable rates with transparent pricing and no hidden fees.',
                icon: '💰'
              }
            ].map((feature, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h4 className="text-xl font-bold text-navy-900 mb-3">{feature.title}</h4>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentServices;