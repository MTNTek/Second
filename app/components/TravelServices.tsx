import React, { useState } from 'react';
import { Plane, Hotel, Calendar, Users, ArrowRight, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useTravelBooking } from '../../src/hooks/useApi';

const TravelServices: React.FC = () => {
  const [activeForm, setActiveForm] = useState('flight');

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold text-navy-900 mb-6">
            Travel Services
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Book with Ease, Travel with Confidence. We provide competitive rates and seamless booking experiences for all your travel needs.
          </p>
        </div>

        {/* Service Tabs */}
        <div className="flex flex-wrap justify-center mb-12">
          {[
            { id: 'flight', label: 'Flight Booking', icon: Plane },
            { id: 'hotel', label: 'Hotel Booking', icon: Hotel },
            { id: 'reservation', label: 'Flight Reservation', icon: Calendar }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveForm(tab.id)}
              className={`flex items-center space-x-2 px-6 py-3 m-2 rounded-lg font-semibold transition-all duration-200 ${
                activeForm === tab.id
                  ? 'bg-yellow-500 text-navy-900 shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              <tab.icon size={20} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Forms */}
        <div className="max-w-4xl mx-auto">
          {activeForm === 'flight' && <FlightBookingForm />}
          {activeForm === 'hotel' && <HotelBookingForm />}
          {activeForm === 'reservation' && <ReservationForm />}
        </div>

        {/* Features */}
        <div className="mt-20">
          <h3 className="text-3xl font-bold text-center text-navy-900 mb-12">Why Choose Our Travel Services?</h3>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Best Price Guarantee',
                description: 'We ensure you get the most competitive rates available in the market.',
                icon: '💰'
              },
              {
                title: '24/7 Support',
                description: 'Round-the-clock assistance for all your travel needs and emergencies.',
                icon: '🕐'
              },
              {
                title: 'Global Network',
                description: 'Access to worldwide destinations with trusted airline and hotel partners.',
                icon: '🌍'
              }
            ].map((feature, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-lg text-center">
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

const FlightBookingForm: React.FC = () => {
  const [formData, setFormData] = useState({
    departure: '',
    destination: '',
    departureDate: '',
    returnDate: '',
    passengers: 1,
    classType: 'economy',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    specialRequests: ''
  });

  const { submitBooking, loading, error, data } = useTravelBooking();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const bookingData = {
      bookingType: 'flight',
      ...formData,
    };

    try {
      await submitBooking(bookingData);
      setSubmitted(true);
      // Reset form
      setFormData({
        departure: '',
        destination: '',
        departureDate: '',
        returnDate: '',
        passengers: 1,
        classType: 'economy',
        contactName: '',
        contactEmail: '',
        contactPhone: '',
        specialRequests: ''
      });
    } catch (err) {
      // Error is handled by the hook
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const value = e.target.name === 'passengers' ? parseInt(e.target.value) : e.target.value;
    setFormData(prev => ({
      ...prev,
      [e.target.name]: value
    }));
  };

  return (
    <div className="bg-white rounded-2xl p-8 shadow-lg">
      <h3 className="text-2xl font-bold text-navy-900 mb-6 flex items-center">
        <Plane className="mr-3 text-yellow-500" size={28} />
        Flight Booking
      </h3>

      {/* Success Message */}
      {submitted && data && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
          <CheckCircle className="text-green-600 mr-3" size={20} />
          <span className="text-green-800">Flight booking request submitted successfully! We'll contact you shortly.</span>
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
            <label className="block text-sm font-medium text-gray-700 mb-2">From</label>
            <input
              type="text"
              name="departure"
              value={formData.departure}
              onChange={handleChange}
              placeholder="Departure city"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
            <input
              type="text"
              name="destination"
              value={formData.destination}
              onChange={handleChange}
              placeholder="Destination city"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Departure Date</label>
            <input
              type="date"
              name="departureDate"
              value={formData.departureDate}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Return Date</label>
            <input
              type="date"
              name="returnDate"
              value={formData.returnDate}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Passengers</label>
            <select 
              name="passengers"
              value={formData.passengers}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            >
              <option value={1}>1 Passenger</option>
              <option value={2}>2 Passengers</option>
              <option value={3}>3 Passengers</option>
              <option value={4}>4+ Passengers</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Class</label>
            <select 
              name="classType"
              value={formData.classType}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            >
              <option value="economy">Economy</option>
              <option value="business">Business</option>
              <option value="first">First Class</option>
            </select>
          </div>
        </div>

        {/* Contact Information */}
        <div className="border-t pt-6">
          <h4 className="text-lg font-semibold text-navy-900 mb-4">Contact Information</h4>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                name="contactName"
                value={formData.contactName}
                onChange={handleChange}
                placeholder="Your full name"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                name="contactEmail"
                value={formData.contactEmail}
                onChange={handleChange}
                placeholder="your.email@example.com"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
              <input
                type="tel"
                name="contactPhone"
                value={formData.contactPhone}
                onChange={handleChange}
                placeholder="+1 (555) 123-4567"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                required
              />
            </div>
          </div>
        </div>

        {/* Special Requests */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Special Requests (Optional)</label>
          <textarea
            name="specialRequests"
            value={formData.specialRequests}
            onChange={handleChange}
            placeholder="Any special accommodations or requests..."
            rows={3}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-500 text-navy-900 py-4 px-6 rounded-lg font-semibold hover:bg-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin mr-2" size={20} />
                Submitting...
              </>
            ) : (
              <>
                Book Flight
                <ArrowRight className="ml-2" size={20} />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

const HotelBookingForm: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-lg">
      <h3 className="text-2xl font-bold text-navy-900 mb-6 flex items-center">
        <Hotel className="mr-3 text-yellow-500" size={28} />
        Hotel Booking
      </h3>
      
      <form className="grid md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Destination</label>
          <input
            type="text"
            placeholder="City or hotel name"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Check-in Date</label>
          <input
            type="date"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Check-out Date</label>
          <input
            type="date"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Rooms</label>
          <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent">
            <option>1 Room</option>
            <option>2 Rooms</option>
            <option>3 Rooms</option>
            <option>4+ Rooms</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Guests</label>
          <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent">
            <option>1 Guest</option>
            <option>2 Guests</option>
            <option>3 Guests</option>
            <option>4+ Guests</option>
          </select>
        </div>
        
        <div className="md:col-span-2">
          <button
            type="submit"
            className="w-full bg-yellow-500 text-navy-900 py-4 px-6 rounded-lg font-semibold hover:bg-yellow-400 transition-colors duration-200 flex items-center justify-center"
          >
            Search Hotels
            <ArrowRight className="ml-2" size={20} />
          </button>
        </div>
      </form>
    </div>
  );
};

const ReservationForm: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-lg">
      <h3 className="text-2xl font-bold text-navy-900 mb-6 flex items-center">
        <Calendar className="mr-3 text-yellow-500" size={28} />
        Flight Reservation Request
      </h3>
      
      <form className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              placeholder="As per passport"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              placeholder="your@email.com"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
            <input
              type="tel"
              placeholder="+971 55 000 0000"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Travel Date</label>
            <input
              type="date"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Travel Details</label>
          <textarea
            rows={4}
            placeholder="Please provide your travel requirements, preferred routes, budget, etc."
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
          ></textarea>
        </div>
        
        <button
          type="submit"
          className="w-full bg-yellow-500 text-navy-900 py-4 px-6 rounded-lg font-semibold hover:bg-yellow-400 transition-colors duration-200 flex items-center justify-center"
        >
          Submit Reservation Request
          <ArrowRight className="ml-2" size={20} />
        </button>
      </form>
    </div>
  );
};

export default TravelServices;