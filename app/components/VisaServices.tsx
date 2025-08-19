import React, { useState } from 'react';
import { FileText, Clock, CheckCircle, Globe, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
import { useVisaApplication } from '../../src/hooks/useApi';

const VisaServices: React.FC = () => {
  const [selectedVisa, setSelectedVisa] = useState('dubai-30');
  const [formData, setFormData] = useState({
    nationality: '',
    passportNumber: '',
    passportExpiry: '',
    purposeOfVisit: 'tourism',
    travelDate: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    visaType: 'dubai-30'
  });

  const { submitApplication, loading, error, data } = useVisaApplication();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await submitApplication({
        ...formData,
        visaType: selectedVisa
      });
      setSubmitted(true);
      // Reset form
      setFormData({
        nationality: '',
        passportNumber: '',
        passportExpiry: '',
        purposeOfVisit: 'tourism',
        travelDate: '',
        contactName: '',
        contactEmail: '',
        contactPhone: '',
        visaType: 'dubai-30'
      });
    } catch (err) {
      // Error is handled by the hook
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const visaOptions = [
    {
      id: 'dubai-30',
      title: 'Dubai Visit Visa - 30 Days',
      price: 'AED 350',
      processing: '3-5 Working Days',
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
      price: 'AED 650',
      processing: '3-5 Working Days',
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
      price: 'AED 1,200',
      processing: '7-10 Working Days',
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
      price: 'Starting from AED 500',
      processing: 'Varies by Country',
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
                <div className="text-2xl font-bold text-yellow-600 mb-1">{visa.price}</div>
                <div className="text-sm text-gray-600 flex items-center justify-center">
                  <Clock size={16} className="mr-1" />
                  {visa.processing}
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

        {/* Application Form */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold text-navy-900 mb-6 flex items-center">
              <FileText className="mr-3 text-yellow-500" size={28} />
              Visa Application Form
            </h3>

            {/* Success Message */}
            {submitted && data && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
                <CheckCircle className="text-green-600 mr-3" size={20} />
                <span className="text-green-800">Visa application submitted successfully! We'll contact you shortly with next steps.</span>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
                <AlertCircle className="text-red-600 mr-3" size={20} />
                <span className="text-red-800">{error}</span>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name (As per Passport)</label>
                  <input
                    type="text"
                    name="contactName"
                    value={formData.contactName}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nationality</label>
                  <select 
                    name="nationality"
                    value={formData.nationality}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select nationality</option>
                    <option value="indian">Indian</option>
                    <option value="pakistani">Pakistani</option>
                    <option value="bangladeshi">Bangladeshi</option>
                    <option value="filipino">Filipino</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Passport Number</label>
                  <input
                    type="text"
                    name="passportNumber"
                    value={formData.passportNumber}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    placeholder="Enter passport number"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Passport Expiry Date</label>
                  <input
                    type="date"
                    name="passportExpiry"
                    value={formData.passportExpiry}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    name="contactEmail"
                    value={formData.contactEmail}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    placeholder="your@email.com"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    name="contactPhone"
                    value={formData.contactPhone}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    placeholder="+971 55 000 0000"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Purpose of Visit</label>
                  <select 
                    name="purposeOfVisit"
                    value={formData.purposeOfVisit}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  >
                    <option value="tourism">Tourism</option>
                    <option value="business">Business</option>
                    <option value="family">Family Visit</option>
                    <option value="medical">Medical</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Intended Travel Date</label>
                  <input
                    type="date"
                    name="travelDate"
                    value={formData.travelDate}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h4 className="font-semibold text-navy-900 mb-2">Required Documents:</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Passport copy (minimum 6 months validity)</li>
                  <li>• Passport size photograph (white background)</li>
                  <li>• Flight ticket (confirmed booking)</li>
                  <li>• Hotel booking confirmation</li>
                  <li>• Bank statement (last 3 months)</li>
                </ul>
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-yellow-500 text-navy-900 py-4 px-6 rounded-lg font-semibold hover:bg-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin mr-2" size={20} />
                    Submitting Application...
                  </>
                ) : (
                  <>
                    Submit Visa Application
                    <ArrowRight className="ml-2" size={20} />
                  </>
                )}
              </button>
            </form>
          </div>
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