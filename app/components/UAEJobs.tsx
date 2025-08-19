import React, { useState } from 'react';
import { Briefcase, MapPin, DollarSign, Clock, Users, Building, Search, ArrowRight, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useUAEJobs } from '../../src/hooks/useApi';

const UAEJobs: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    industry: '',
    jobTitle: '',
    experience: '',
    currentLocation: '',
    visaStatus: 'visit',
    availability: 'immediate'
  });

  const { submitApplication, loading, error, data } = useUAEJobs();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await submitApplication(formData);
      setSubmitted(true);
      // Reset form
      setFormData({
        contactName: '',
        contactEmail: '',
        contactPhone: '',
        industry: '',
        jobTitle: '',
        experience: '',
        currentLocation: '',
        visaStatus: 'visit',
        availability: 'immediate'
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

  const categories = [
    { id: 'all', name: 'All Categories', icon: Briefcase },
    { id: 'hospitality', name: 'Hospitality', icon: Users },
    { id: 'construction', name: 'Construction', icon: Building },
    { id: 'administration', name: 'Administration', icon: Briefcase },
    { id: 'sales', name: 'Sales & Marketing', icon: Users },
    { id: 'security', name: 'Security', icon: Building }
  ];

  const jobs = [
    {
      id: 1,
      title: 'Hotel Receptionist',
      company: 'Luxury Resort Dubai',
      category: 'hospitality',
      location: 'Dubai Marina',
      salary: 'AED 3,500 - 4,500',
      type: 'Full-time',
      experience: '2-3 years',
      description: 'Excellent customer service skills, fluent in English and Arabic preferred.',
      benefits: ['Accommodation', 'Transportation', 'Medical Insurance', 'Annual Leave']
    },
    {
      id: 2,
      title: 'Construction Supervisor',
      company: 'BuildTech Emirates',
      category: 'construction',
      location: 'Dubai South',
      salary: 'AED 6,000 - 8,000',
      type: 'Full-time',
      experience: '5+ years',
      description: 'Supervise construction projects, ensure safety protocols, manage teams.',
      benefits: ['Accommodation', 'Transportation', 'Medical Insurance', 'Bonus']
    },
    {
      id: 3,
      title: 'Office Administrator',
      company: 'Business Solutions LLC',
      category: 'administration',
      location: 'Business Bay',
      salary: 'AED 4,000 - 5,500',
      type: 'Full-time',
      experience: '2-4 years',
      description: 'Administrative support, document management, client coordination.',
      benefits: ['Medical Insurance', 'Annual Leave', 'Performance Bonus']
    },
    {
      id: 4,
      title: 'Sales Executive',
      company: 'Emirates Trading',
      category: 'sales',
      location: 'Deira',
      salary: 'AED 4,500 - 7,000',
      type: 'Full-time',
      experience: '3+ years',
      description: 'Drive sales growth, maintain client relationships, achieve targets.',
      benefits: ['Commission', 'Transportation', 'Medical Insurance', 'Incentives']
    },
    {
      id: 5,
      title: 'Security Guard',
      company: 'Safe Guard Services',
      category: 'security',
      location: 'DIFC',
      salary: 'AED 2,800 - 3,500',
      type: 'Full-time',
      experience: '1-2 years',
      description: 'Maintain security of premises, monitor CCTV, patrol duties.',
      benefits: ['Accommodation', 'Transportation', 'Medical Insurance', 'Uniform']
    },
    {
      id: 6,
      title: 'Restaurant Manager',
      company: 'Fine Dining Group',
      category: 'hospitality',
      location: 'JBR',
      salary: 'AED 7,000 - 9,000',
      type: 'Full-time',
      experience: '4-6 years',
      description: 'Manage restaurant operations, staff supervision, customer satisfaction.',
      benefits: ['Accommodation', 'Transportation', 'Medical Insurance', 'Tips']
    }
  ];

  const filteredJobs = jobs.filter(job => {
    const matchesCategory = selectedCategory === 'all' || job.category === selectedCategory;
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold text-navy-900 mb-6">
            Employment Opportunities in UAE
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover exciting career opportunities across the United Arab Emirates. Join the thriving job market in one of the world's most dynamic economies.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-12">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search jobs, companies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                    selectedCategory === category.id
                      ? 'bg-yellow-500 text-navy-900'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <category.icon size={18} />
                  <span className="whitespace-nowrap">{category.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Job Listings */}
        <div className="grid gap-6 mb-12">
          {filteredJobs.map((job) => (
            <div key={job.id} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex flex-col lg:flex-row lg:items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-xl font-bold text-navy-900 mb-1">{job.title}</h3>
                      <div className="flex items-center text-gray-600 mb-2">
                        <Building className="mr-2" size={16} />
                        <span className="text-sm">{job.company}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-yellow-600">{job.salary}</div>
                      <div className="text-sm text-gray-600">{job.type}</div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center">
                      <MapPin className="mr-1" size={14} />
                      {job.location}
                    </div>
                    <div className="flex items-center">
                      <Clock className="mr-1" size={14} />
                      {job.experience} experience
                    </div>
                  </div>
                  
                  <p className="text-gray-700 text-sm mb-4">{job.description}</p>
                  
                  <div className="mb-4">
                    <h4 className="font-semibold text-navy-900 mb-2">Benefits:</h4>
                    <div className="flex flex-wrap gap-2">
                      {job.benefits.map((benefit, index) => (
                        <span
                          key={index}
                          className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm"
                        >
                          {benefit}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 lg:mt-0 lg:ml-6">
                  <button className="w-full lg:w-auto bg-yellow-500 text-navy-900 px-6 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition-colors duration-200 flex items-center justify-center">
                    Apply Now
                    <ArrowRight className="ml-2" size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No results message */}
        {filteredJobs.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">No jobs found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or category filter.</p>
          </div>
        )}

        {/* Statistics */}
        <div className="bg-white rounded-2xl p-8 shadow-lg mb-12">
          <h3 className="text-3xl font-bold text-center text-navy-900 mb-8">UAE Employment Statistics</h3>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { number: '500+', label: 'Active Job Listings' },
              { number: '95%', label: 'Placement Success Rate' },
              { number: '2,000+', label: 'Placed Candidates' },
              { number: '200+', label: 'Partner Companies' }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-yellow-600 mb-2">{stat.number}</div>
                <div className="text-gray-700">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Application Form */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold text-navy-900 mb-6 text-center">Submit Your Application</h3>
            
            {/* Success Message */}
            {submitted && data && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
                <CheckCircle className="text-green-600 mr-3" size={20} />
                <span className="text-green-800">Job application submitted successfully! We'll contact you shortly.</span>
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    name="contactName"
                    value={formData.contactName}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    placeholder="Your full name"
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
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    placeholder="your@email.com"
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
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    placeholder="+971 55 000 0000"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
                  <select 
                    name="industry"
                    value={formData.industry}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select industry</option>
                    <option value="hospitality">Hospitality</option>
                    <option value="construction">Construction</option>
                    <option value="administration">Administration</option>
                    <option value="sales">Sales & Marketing</option>
                    <option value="security">Security</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Position of Interest</label>
                  <input
                    type="text"
                    name="jobTitle"
                    value={formData.jobTitle}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    placeholder="Job title you're interested in"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Years of Experience</label>
                  <select 
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select experience level</option>
                    <option value="0-1">0-1 years</option>
                    <option value="2-3">2-3 years</option>
                    <option value="4-6">4-6 years</option>
                    <option value="7+">7+ years</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current Location</label>
                  <input
                    type="text"
                    name="currentLocation"
                    value={formData.currentLocation}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    placeholder="Your current location"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Visa Status</label>
                  <select 
                    name="visaStatus"
                    value={formData.visaStatus}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    required
                  >
                    <option value="visit">Visit Visa</option>
                    <option value="residence">Residence Visa</option>
                    <option value="employment">Employment Visa</option>
                    <option value="cancelled">Cancelled Visa</option>
                    <option value="outside_uae">Outside UAE</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Availability</label>
                <select 
                  name="availability"
                  value={formData.availability}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  required
                >
                  <option value="immediate">Immediate</option>
                  <option value="1_week">Within 1 week</option>
                  <option value="2_weeks">Within 2 weeks</option>
                  <option value="1_month">Within 1 month</option>
                  <option value="flexible">Flexible</option>
                </select>
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
                      Submit Application
                      <ArrowRight className="ml-2" size={20} />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UAEJobs;