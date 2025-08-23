import React, { useState } from 'react';
import Image from 'next/image';
import { Phone, Mail, MapPin, MessageCircle, Clock, Send, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';
import { useContactForm } from '@/hooks/useApi';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    service: '',
    message: ''
  });

  const [showSuccess, setShowSuccess] = useState(false);
  const { submitContact, loading, error } = useContactForm();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      return; // Basic validation
    }

    try {
      await submitContact({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        subject: formData.subject || 'General Inquiry',
        message: formData.message,
        service: formData.service || 'general',
      });

      // Show success message
      setShowSuccess(true);
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        service: '',
        message: ''
      });

      // Hide success message after 5 seconds
      setTimeout(() => setShowSuccess(false), 5000);
    } catch (error) {
      console.error('Contact form submission failed:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const contactInfo = [
    {
      icon: Phone,
      title: 'Phone',
      details: '+971 4 332 8700',
      description: 'Call us for immediate assistance'
    },
    {
      icon: Mail,
      title: 'Email',
      details: 'mandelatek@gmail.com',
      description: 'Send us your inquiries anytime'
    },
    {
      icon: MapPin,
      title: 'Address',
      details: 'Al Qiyada Metro Station Exit 2, Al Kazim Building Block A, Abu Saif Business Center, Office M12',
      description: 'Dubai, UAE'
    },
    {
      icon: MessageCircle,
      title: 'WhatsApp',
      details: '+971 4 332 8700',
      description: 'Chat with us instantly'
    }
  ];

  const officeHours = [
    { day: 'Monday - Friday', hours: '9:00 AM - 6:00 PM' },
    { day: 'Saturday', hours: '10:00 AM - 4:00 PM' },
    { day: 'Sunday', hours: 'Closed' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-4 mb-6">
            <Image 
              src="/company_logo_transparent.png" 
              alt="Perry Eden Group Logo" 
              width={60}
              height={60}
              className="object-contain"
            />
            <h1 className="text-4xl lg:text-5xl font-bold text-navy-900">
              Get In Touch
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Ready to start your journey? Contact us today and let our experts guide you through every step of the process.
          </p>
        </div>

        {/* Contact Methods */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {contactInfo.map((info, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-lg text-center hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <info.icon className="text-white" size={28} />
              </div>
              <h3 className="text-lg font-bold text-navy-900 mb-2">{info.title}</h3>
              <p className="text-gray-700 font-medium mb-2">{info.details}</p>
              <p className="text-sm text-gray-600">{info.description}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h2 className="text-3xl font-bold text-navy-900 mb-6">Send Us a Message</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      placeholder="Your full name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      placeholder="your@email.com"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      placeholder="+971 55 000 0000"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      placeholder="Subject of your inquiry"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Service Interested In</label>
                    <select
                      name="service"
                      value={formData.service}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    >
                      <option value="">Select a service</option>
                      <option value="visa">Visa Services</option>
                      <option value="travel">Travel Booking</option>
                      <option value="work-permit">Work Permits</option>
                      <option value="uae-jobs">UAE Jobs</option>
                      <option value="documents">Document Services</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message *</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    placeholder="Please describe your requirements or any questions you have..."
                  ></textarea>
                </div>

                {/* Success Message */}
                {showSuccess && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center">
                    <CheckCircle className="text-green-500 mr-3" size={20} />
                    <p className="text-green-800">Thank you! Your message has been sent successfully. We'll get back to you soon.</p>
                  </div>
                )}

                {/* Error Message */}
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
                    <AlertCircle className="text-red-500 mr-3" size={20} />
                    <p className="text-red-800">{error}</p>
                  </div>
                )}
                
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-yellow-500 text-navy-900 py-4 px-6 rounded-lg font-semibold hover:bg-yellow-400 transition-colors duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-navy-900 mr-2"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message
                      <Send className="ml-2" size={20} />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Office Hours */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center mb-4">
                <Clock className="mr-3 text-yellow-500" size={24} />
                <h3 className="text-xl font-bold text-navy-900">Office Hours</h3>
              </div>
              
              <div className="space-y-3">
                {officeHours.map((schedule, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                    <span className="text-gray-700 font-medium">{schedule.day}</span>
                    <span className="text-navy-900 font-semibold">{schedule.hours}</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>Emergency Support:</strong> Available 24/7 for urgent matters
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-navy-900 mb-4">Quick Actions</h3>
              
              <div className="space-y-3">
                <a
                  href="tel:+97143328700"
                  className="w-full bg-green-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-400 transition-colors duration-200 flex items-center justify-center"
                >
                  <Phone className="mr-2" size={18} />
                  Call Now
                </a>
                
                <a
                  href="https://wa.me/97143328700"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-500 transition-colors duration-200 flex items-center justify-center"
                >
                  <MessageCircle className="mr-2" size={18} />
                  WhatsApp Chat
                </a>
                
                <a
                  href="mailto:mandelatek@gmail.com"
                  className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-400 transition-colors duration-200 flex items-center justify-center"
                >
                  <Mail className="mr-2" size={18} />
                  Send Email
                </a>
              </div>
            </div>

            {/* Location */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-navy-900 mb-4">Visit Our Office</h3>
              
              <div className="space-y-2 text-sm text-gray-700 mb-4">
                <p className="font-medium">Perry Eden Group of Companies</p>
                <p>Al Qiyada Metro Station Exit 2</p>
                <p>Al Kazim Building Block A</p>
                <p>Abu Saif Business Center</p>
                <p>Office M12, Dubai, UAE</p>
              </div>
              
              <button className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center">
                <MapPin className="mr-2" size={16} />
                View on Map
              </button>
            </div>
          </div>
        </div>

        {/* Contact Details & Support Section */}
        <div className="bg-navy-900 text-white rounded-2xl p-8 mb-16">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-center mb-8">Contact Details & Support</h3>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div className="flex flex-col items-center">
                <Phone className="mb-3 text-yellow-400" size={32} />
                <h4 className="text-lg font-semibold mb-2">Phone Support</h4>
                <p className="text-gray-300">+971 4 332 8700</p>
                <p className="text-sm text-gray-400 mt-1">Available during business hours</p>
              </div>
              <div className="flex flex-col items-center">
                <Mail className="mb-3 text-yellow-400" size={32} />
                <h4 className="text-lg font-semibold mb-2">Email Support</h4>
                <p className="text-gray-300">mandelatek@gmail.com</p>
                <p className="text-sm text-gray-400 mt-1">Response within 24 hours</p>
              </div>
              <div className="flex flex-col items-center">
                <MessageCircle className="mb-3 text-yellow-400" size={32} />
                <h4 className="text-lg font-semibold mb-2">WhatsApp Support</h4>
                <p className="text-gray-300">+971 4 332 8700</p>
                <p className="text-sm text-gray-400 mt-1">Instant messaging available</p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center text-navy-900 mb-12">Frequently Asked Questions</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                question: 'How long does visa processing take?',
                answer: 'Processing times vary by visa type and country. Dubai visit visas typically take 3-5 working days, while work permits can take 4-8 weeks.'
              },
              {
                question: 'Do you provide accommodation for work permit applicants?',
                answer: 'Yes, many of our European work permit packages include accommodation and transportation arrangements.'
              },
              {
                question: 'What payment methods do you accept?',
                answer: 'We accept payments in AED, USD, and EUR through various methods including PayTabs, Stripe, PayPal, and bank transfers.'
              },
              {
                question: 'Can I track my application status?',
                answer: 'Yes, we provide regular updates on your application status and will keep you informed throughout the entire process.'
              },
              {
                question: 'Do you offer refunds if visa is rejected?',
                answer: 'Our refund policy varies by service type. We discuss all terms and conditions upfront and work diligently to ensure successful applications.'
              },
              {
                question: 'Is your office accessible by public transport?',
                answer: 'Yes, we are conveniently located at Al Qiyada Metro Station Exit 2, making us easily accessible by Dubai Metro.'
              }
            ].map((faq, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg">
                <h3 className="text-lg font-bold text-navy-900 mb-3">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;