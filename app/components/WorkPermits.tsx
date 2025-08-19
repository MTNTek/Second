import React, { useState } from 'react';
import { MapPin, DollarSign, Clock, Users, Building, ArrowRight, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useWorkPermit } from '../../src/hooks/useApi';

const WorkPermits: React.FC = () => {
  const [selectedCountry, setSelectedCountry] = useState('poland');
  const [formData, setFormData] = useState({
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    country: 'poland',
    jobTitle: '',
    company: '',
    experience: '',
    education: ''
  });

  const { submitApplication, loading, error, data } = useWorkPermit();
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
        country: 'poland',
        jobTitle: '',
        company: '',
        experience: '',
        education: ''
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

  const countries = [
    {
      id: 'czech',
      name: 'Czech Republic',
      flag: '🇨🇿',
      jobs: [
        {
          title: 'Factory Worker',
          company: 'Manufacturing Corp',
          salary: '€1,400/month',
          location: 'Prague',
          type: 'Full-time',
          requirements: 'No experience required, accommodation provided'
        },
        {
          title: 'Warehouse Operator',
          company: 'Logistics Solutions',
          salary: '€1,300/month',
          location: 'Brno',
          type: 'Full-time',
          requirements: 'Basic English, transport provided'
        },
        {
          title: 'Construction Worker',
          company: 'BuildTech',
          salary: '€1,600/month',
          location: 'Ostrava',
          type: 'Full-time',
          requirements: 'Experience preferred, accommodation available'
        }
      ]
    },
    {
      id: 'poland',
      name: 'Poland',
      flag: '🇵🇱',
      jobs: [
        {
          title: 'Assembly Line Worker',
          company: 'Auto Parts Ltd',
          salary: '€1,200/month',
          location: 'Warsaw',
          type: 'Full-time',
          requirements: 'No experience needed, full training provided'
        },
        {
          title: 'Packaging Specialist',
          company: 'Food Processing Co',
          salary: '€1,150/month',
          location: 'Krakow',
          type: 'Full-time',
          requirements: 'Attention to detail, accommodation provided'
        },
        {
          title: 'Machine Operator',
          company: 'Industrial Systems',
          salary: '€1,350/month',
          location: 'Gdansk',
          type: 'Full-time',
          requirements: 'Technical background preferred'
        }
      ]
    },
    {
      id: 'slovakia',
      name: 'Slovakia',
      flag: '🇸🇰',
      jobs: [
        {
          title: 'Production Worker',
          company: 'Electronics Manufacturing',
          salary: '€1,100/month',
          location: 'Bratislava',
          type: 'Full-time',
          requirements: 'Quality control experience preferred'
        },
        {
          title: 'Logistics Assistant',
          company: 'Distribution Center',
          salary: '€1,050/month',
          location: 'Kosice',
          type: 'Full-time',
          requirements: 'Physical fitness required'
        }
      ]
    },
    {
      id: 'serbia',
      name: 'Serbia',
      flag: '🇷🇸',
      jobs: [
        {
          title: 'Agricultural Worker',
          company: 'Agro Solutions',
          salary: '€800/month',
          location: 'Belgrade',
          type: 'Seasonal',
          requirements: 'Outdoor work, seasonal position'
        },
        {
          title: 'Maintenance Technician',
          company: 'Industrial Facilities',
          salary: '€900/month',
          location: 'Novi Sad',
          type: 'Full-time',
          requirements: 'Technical skills, experience preferred'
        }
      ]
    },
    {
      id: 'ukraine',
      name: 'Ukraine',
      flag: '🇺🇦',
      jobs: [
        {
          title: 'IT Support Specialist',
          company: 'Tech Solutions',
          salary: '€700/month',
          location: 'Kyiv',
          type: 'Full-time',
          requirements: 'Computer skills, English required'
        },
        {
          title: 'Customer Service Rep',
          company: 'Call Center Solutions',
          salary: '€650/month',
          location: 'Lviv',
          type: 'Full-time',
          requirements: 'Excellent communication skills'
        }
      ]
    }
  ];

  const currentCountry = countries.find(c => c.id === selectedCountry);

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
              onClick={() => setSelectedCountry(country.id)}
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
            {currentCountry?.jobs.map((job, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex flex-col lg:flex-row lg:items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
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
                        {job.requirements}
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">Work Permit Included</span>
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">Immediate Start</span>
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">EU Work Rights</span>
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

        {/* Application Form */}
        <div className="mt-20 max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold text-navy-900 mb-6 text-center">Express Your Interest</h3>
            
            {/* Success Message */}
            {submitted && data && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
                <CheckCircle className="text-green-600 mr-3" size={20} />
                <span className="text-green-800">Work permit application submitted successfully! We'll contact you shortly.</span>
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Country</label>
                  <select 
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  >
                    {countries.map((country) => (
                      <option key={country.id} value={country.id}>{country.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Desired Job Title</label>
                  <input
                    type="text"
                    name="jobTitle"
                    value={formData.jobTitle}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    placeholder="e.g. Factory Worker, Construction Worker"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Company (Optional)</label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    placeholder="Company name or 'Any'"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Work Experience</label>
                <textarea
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  rows={4}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  placeholder="Brief description of your work experience and skills"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Education Background</label>
                <textarea
                  name="education"
                  value={formData.education}
                  onChange={handleChange}
                  rows={3}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  placeholder="Your educational qualifications and certifications"
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

export default WorkPermits;