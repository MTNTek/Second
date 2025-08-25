import React, { useState } from 'react';
import { DollarSign, Clock, Users, MessageCircle, Phone, ChevronLeft, ChevronRight } from 'lucide-react';

const WorkPermits: React.FC = () => {
  const [selectedCountry, setSelectedCountry] = useState('poland');
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 6;

  const handleCall = () => {
    window.location.href = 'tel:+97143328700';
  };

  const handleWhatsApp = (service: string) => {
    const message = `Hi, I would like to inquire about ${service}. Could you please provide me with more details?`;
    const whatsappUrl = `https://wa.me/971582200451?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const countries = [
    {
      id: 'czech',
      name: 'Czech Republic',
      flag: '🇨🇿',
      jobs: [
        {
          title: 'Warehouse Assistant',
          type: 'Full-time',
          requirements: 'Basic English, transport provided'
        },
        {
          title: 'Delivery Driver',
          type: 'Full-time',
          requirements: 'Valid driving license, GPS navigation skills'
        },
        {
          title: 'Storekeeper',
          type: 'Full-time',
          requirements: 'Inventory management, attention to detail'
        },
        {
          title: 'Welder',
          type: 'Full-time',
          requirements: 'Welding certification, experience preferred'
        },
        {
          title: 'Loading and Unloading Truck Operator',
          type: 'Full-time',
          requirements: 'Physical fitness, forklift license preferred'
        },
        {
          title: 'Cleaner',
          type: 'Full-time',
          requirements: 'No experience required, flexible hours'
        }
      ]
    },
    {
      id: 'poland',
      name: 'Poland',
      flag: '🇵🇱',
      jobs: [
        {
          title: 'PLASTERBOARD WORKER',
          type: 'Full-time',
          requirements: 'Construction experience preferred, training provided'
        },
        {
          title: 'TILER',
          type: 'Full-time',
          requirements: 'Tiling experience, attention to detail'
        },
        {
          title: 'PAINTER',
          type: 'Full-time',
          requirements: 'Painting skills, quality finish standards'
        },
        {
          title: 'REINFORCER',
          type: 'Full-time',
          requirements: 'Steel reinforcement experience, safety certification'
        },
        {
          title: 'BRICKLAYER / CARPENTER',
          type: 'Full-time',
          requirements: 'Construction trade skills, tool operation'
        },
        {
          title: 'TELEVISION FACTORY',
          type: 'Full-time',
          requirements: 'Electronics assembly, quality control experience'
        },
        {
          title: 'PICKING CHAMPIGNONS',
          type: 'Full-time',
          requirements: 'Agricultural work, physical fitness required'
        },
        {
          title: 'SKLEPY COMFORT STORE WAREHOUSE',
          type: 'Full-time',
          requirements: 'Warehouse operations, inventory management'
        },
        {
          title: 'POULTRY FARMER',
          type: 'Full-time',
          requirements: 'Animal care experience, early morning shifts'
        },
        {
          title: 'FISH PRODUCTION',
          type: 'Full-time',
          requirements: 'Food processing, hygiene standards compliance'
        },
        {
          title: 'TIG / MIG / MAG WELDER',
          type: 'Full-time',
          requirements: 'Welding certification, technical skills required'
        },
        {
          title: 'PACKAGING OF GAME MEAT',
          type: 'Full-time',
          requirements: 'Food handling certification, cold environment work'
        },
        {
          title: 'CITY BUS DRIVER',
          type: 'Full-time',
          requirements: 'Professional driving license, clean driving record'
        },
        {
          title: 'PRODUCTION WORKER',
          type: 'Full-time',
          requirements: 'Manufacturing experience, shift work availability'
        },
        {
          title: 'WAREHOUSE WORKER',
          type: 'Full-time',
          requirements: 'Physical fitness, forklift license preferred'
        },
        {
          title: 'ELECTRICIAN',
          type: 'Full-time',
          requirements: 'Electrical certification, safety training required'
        }
      ]
    },
    {
      id: 'slovakia',
      name: 'Slovakia',
      flag: '🇸🇰',
      jobs: [
        {
          title: 'WAREHOUSE WORKER / HANDYMAN',
          type: 'Full-time',
          requirements: 'Physical fitness, basic maintenance skills'
        },
        {
          title: 'COOK\'S ASSISTANT',
          type: 'Full-time',
          requirements: 'Food preparation experience, hygiene certification'
        },
        {
          title: 'ASSISTANT MECHANIC',
          type: 'Full-time',
          requirements: 'Mechanical knowledge, tool operation skills'
        },
        {
          title: 'REPAIRER OF INDUSTRIAL EQUIPMENT',
          type: 'Full-time',
          requirements: 'Technical experience, troubleshooting skills'
        },
        {
          title: 'PAINTER',
          type: 'Full-time',
          requirements: 'Painting skills, quality finish standards'
        },
        {
          title: 'TILER',
          type: 'Full-time',
          requirements: 'Tiling experience, precision work'
        },
        {
          title: 'ELECTRICIAN',
          type: 'Full-time',
          requirements: 'Electrical certification, safety training required'
        },
        {
          title: 'WELDER',
          type: 'Full-time',
          requirements: 'Welding certification, metal fabrication experience'
        }
      ]
    },
    {
      id: 'serbia',
      name: 'Serbia',
      flag: '🇷🇸',
      jobs: [
        {
          title: 'Warehouse Worker',
          type: 'Full-time',
          requirements: 'Physical fitness, inventory management skills'
        },
        {
          title: 'Construction Roles',
          type: 'Full-time',
          requirements: 'Construction experience, safety certification'
        },
        {
          title: 'Factory Cleaner',
          type: 'Full-time',
          requirements: 'Cleaning experience, attention to detail'
        },
        {
          title: 'Production Line Assistant',
          type: 'Full-time',
          requirements: 'Manufacturing experience, teamwork skills'
        },
        {
          title: 'Kitchen Helper / Dishwasher',
          type: 'Full-time',
          requirements: 'Food service experience, hygiene standards'
        },
        {
          title: 'Mason',
          type: 'Full-time',
          requirements: 'Masonry skills, construction experience'
        },
        {
          title: 'Tiler',
          type: 'Full-time',
          requirements: 'Tiling experience, precision work'
        },
        {
          title: 'Electrician',
          type: 'Full-time',
          requirements: 'Electrical certification, safety training required'
        },
        {
          title: 'Plumber',
          type: 'Full-time',
          requirements: 'Plumbing certification, pipe fitting experience'
        }
      ]
    },
    {
      id: 'ukraine',
      name: 'Ukraine',
      flag: '🇺🇦',
      jobs: [
        {
          title: 'ELECTRICIAN',
          type: 'Full-time',
          requirements: 'Electrical certification, safety training required'
        },
        {
          title: 'WELDER FOR PRODUCTION',
          type: 'Full-time',
          requirements: 'Production welding experience, quality standards'
        },
        {
          title: 'WORKERS FOR A FURNITURE FACTORY',
          type: 'Full-time',
          requirements: 'Manufacturing experience, woodworking skills'
        },
        {
          title: 'WORKERS FOR OIL PRODUCTION',
          type: 'Full-time',
          requirements: 'Industrial experience, safety certification'
        },
        {
          title: 'BUILDERS',
          type: 'Full-time',
          requirements: 'Construction experience, physical fitness'
        },
        {
          title: 'TOWER CRANE OPERATOR',
          type: 'Full-time',
          requirements: 'Crane operation license, height safety certification'
        }
      ]
    }
  ];

  const currentCountry = countries.find(c => c.id === selectedCountry);
  
  // Pagination logic
  const totalJobs = currentCountry?.jobs.length || 0;
  const totalPages = Math.ceil(totalJobs / jobsPerPage);
  const startIndex = (currentPage - 1) * jobsPerPage;
  const endIndex = startIndex + jobsPerPage;
  const currentJobs = currentCountry?.jobs.slice(startIndex, endIndex) || [];

  // Reset to page 1 when country changes
  const handleCountryChange = (countryId: string) => {
    setSelectedCountry(countryId);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold text-navy-900 mb-6">
            European Work Permits
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Secure your future with work opportunities across Europe. We provide comprehensive work permit assistance and job placement services.
          </p>
        </div>

        {/* Country Selector */}
        <div className="flex flex-wrap justify-center mb-12">
          {countries.map((country) => (
            <button
              key={country.id}
              onClick={() => handleCountryChange(country.id)}
              className={`flex items-center space-x-2 px-6 py-3 m-2 rounded-lg font-semibold transition-all duration-200 ${
                selectedCountry === country.id
                  ? 'bg-yellow-500 text-navy-900 shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span className="text-xl">{country.flag}</span>
              <span>{country.name}</span>
            </button>
          ))}
        </div>

        {/* Job Listings */}
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-navy-900 mb-8 text-center">
            Available Positions in {currentCountry?.name}
          </h2>
          
          <div className="grid gap-6">
            {currentJobs.map((job, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex flex-col lg:flex-row lg:items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-navy-900 mb-1">{job.title}</h3>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-600">{job.type}</div>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center">
                        <Clock className="mr-1" size={14} />
                        {job.requirements}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 lg:mt-0 lg:ml-6">
                    <div className="flex flex-col gap-2 w-full lg:w-auto">
                      <button 
                        onClick={() => handleWhatsApp(`Work Permit for ${job.title} in ${currentCountry?.name}`)}
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors duration-200 flex items-center justify-center"
                      >
                        <MessageCircle size={14} className="mr-1" />
                        WhatsApp
                      </button>
                      <button 
                        onClick={() => window.open('tel:+97143328700', '_self')}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors duration-200 flex items-center justify-center"
                      >
                        <Phone size={14} className="mr-1" />
                        Call
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-8 space-x-4">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                  currentPage === 1
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-navy-900 hover:bg-gray-100 shadow-sm'
                }`}
              >
                <ChevronLeft size={16} className="mr-1" />
                Previous
              </button>

              <div className="flex space-x-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`w-10 h-10 rounded-lg font-medium transition-colors duration-200 ${
                      currentPage === page
                        ? 'bg-yellow-500 text-navy-900'
                        : 'bg-white text-navy-900 hover:bg-gray-100'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                  currentPage === totalPages
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-navy-900 hover:bg-gray-100 shadow-sm'
                }`}
              >
                Next
                <ChevronRight size={16} className="ml-1" />
              </button>
            </div>
          )}

          {/* Job Count Display */}
          <div className="text-center mt-4 text-gray-600">
            Showing {startIndex + 1}-{Math.min(endIndex, totalJobs)} of {totalJobs} positions
          </div>
        </div>

        {/* Application Process */}
        <div className="mt-20">
          <h3 className="text-3xl font-bold text-center text-navy-900 mb-12">Work Permit Application Process</h3>
          <div className="grid md:grid-cols-5 gap-6">
            {[
              { step: '1', title: 'Job Selection', desc: 'Choose from available positions' },
              { step: '2', title: 'Document Review', desc: 'Prepare required documents' },
              { step: '3', title: 'Application Submit', desc: 'Submit work permit application' },
              { step: '4', title: 'Processing', desc: 'Wait for approval (4-8 weeks)' },
              { step: '5', title: 'Travel & Work', desc: 'Travel to destination country' }
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

        {/* Benefits Section */}
        <div className="mt-20">
          <h3 className="text-3xl font-bold text-center text-navy-900 mb-12">Why Choose European Work Permits?</h3>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: DollarSign,
                title: 'Competitive Salaries',
                description: 'Earn in Euros with guaranteed monthly wages and overtime opportunities.'
              },
              {
                icon: Users,
                title: 'Family Benefits',
                description: 'Bring your family after initial settlement period with family reunification visas.'
              },
              {
                icon: Clock,
                title: 'Path to Residency',
                description: 'Work permits can lead to permanent residency and EU citizenship opportunities.'
              }
            ].map((benefit, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-lg text-center">
                <benefit.icon className="mx-auto mb-4 text-yellow-500" size={48} />
                <h4 className="text-xl font-bold text-navy-900 mb-3">{benefit.title}</h4>
                <p className="text-gray-600">{benefit.description}</p>
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
              onClick={() => handleWhatsApp('Work Permit Services')}
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

export default WorkPermits;