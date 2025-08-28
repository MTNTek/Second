import React, { useState } from 'react';
import { Briefcase, MapPin, DollarSign, Clock, Users, Building, Search, MessageCircle } from 'lucide-react';

const UAEJobs: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const handleWhatsAppInquiry = (jobTitle: string) => {
    const message = `Hi, I would like to inquire about the ${jobTitle} position. Could you please provide me with more details?`;
    const whatsappUrl = `https://wa.me/971566402340?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const categories = [
    { id: 'all', name: 'All Categories', icon: Briefcase },
    { id: 'delivery', name: 'Delivery Services', icon: Users }
  ];

  const jobs = [
    {
      id: 1,
      title: 'BIKE RIDERS/DELIVERY',
      company: 'Perry Eden Group',
      category: 'delivery',
      location: 'Dubai',
      salary: 'Competitive Package',
      type: 'Full-time',
      experience: '1+ years',
      description: 'Delivery services across Dubai, reliable transportation, customer service oriented.',
      benefits: ['Transportation', 'Medical Insurance', 'Performance Bonus', 'Fuel Allowance']
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
                  <button 
                    onClick={() => handleWhatsAppInquiry(job.title)}
                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors duration-200 flex items-center justify-center"
                  >
                    <MessageCircle size={14} className="mr-1" />
                    WhatsApp
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

        {/* Statistics - DISABLED */}
        {/*
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
        */}
      </div>
    </div>
  );
};

export default UAEJobs;