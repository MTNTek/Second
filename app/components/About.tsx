import React from 'react';
import Image from 'next/image';
import { Users, Target, Eye, Award, Globe, Clock, ThumbsUp, Building } from 'lucide-react';

const About: React.FC = () => {
  const stats = [
    { icon: Users, value: '500+', label: 'Satisfied Clients' },
    { icon: Globe, value: '30+', label: 'Countries Served' },
    { icon: Award, value: '5+', label: 'Years Experience' },
    { icon: ThumbsUp, value: '98%', label: 'Success Rate' }
  ];

  const values = [
    {
      icon: Target,
      title: 'Our Mission',
      description: 'To simplify global travel, visa processing, and business services by providing fast, reliable, and professional assistance to individuals and organizations worldwide.'
    },
    {
      icon: Eye,
      title: 'Our Vision',
      description: 'To become the leading provider of comprehensive international services, connecting people to opportunities across the globe with transparency and excellence.'
    },
    {
      icon: Award,
      title: 'Our Values',
      description: 'We are committed to integrity, professionalism, customer satisfaction, and building long-term relationships based on trust and reliability.'
    }
  ];

  const team = [
    {
      name: 'Ahmed Hassan',
      role: 'CEO & Founder',
      description: 'Over 15 years of experience in international business and visa consulting.',
      image: '👨‍💼'
    },
    {
      name: 'Sarah Johnson',
      role: 'Head of Visa Services',
      description: 'Expert in visa processing with extensive knowledge of global immigration policies.',
      image: '👩‍💼'
    },
    {
      name: 'Omar Al-Rashid',
      role: 'Travel Services Manager',
      description: 'Specialized in corporate and leisure travel planning with 12 years of experience.',
      image: '👨‍✈️'
    },
    {
      name: 'Maria Santos',
      role: 'Document Services Lead',
      description: 'Professional translator and document specialist with multilingual expertise.',
      image: '👩‍💻'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center space-x-4 mb-6">
            <Image 
              src="/company_logo_transparent.png" 
              alt="Perry Eden Group Logo" 
              width={60}
              height={60}
              className="object-contain"
            />
            <h1 className="text-4xl lg:text-5xl font-bold text-navy-900">
              About Perry Eden Group
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-tight">
            Perry Eden Group of Companies was founded with a mission to simplify travel, visa, and business services for individuals and organizations worldwide. We pride ourselves on delivering quick, reliable, and professional assistance with transparency and customer satisfaction at the core of everything we do.
          </p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-8 mb-20">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-2xl p-8 shadow-lg text-center">
              <stat.icon className="mx-auto mb-4 text-yellow-500" size={48} />
              <div className="text-3xl font-bold text-navy-900 mb-2">{stat.value}</div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Mission, Vision, Values */}
        <div className="grid lg:grid-cols-3 gap-8 mb-20">
          {values.map((value, index) => (
            <div key={index} className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-2xl flex items-center justify-center mb-6">
                <value.icon className="text-white" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-navy-900 mb-4">{value.title}</h3>
              <p className="text-gray-600 leading-relaxed">{value.description}</p>
            </div>
          ))}
        </div>

        {/* Company Story */}
        <div className="bg-white rounded-2xl p-8 lg:p-12 shadow-lg mb-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-navy-900 mb-6">Our Story</h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  Established in Dubai, UAE, Perry Eden Group of Companies began as a small visa consultancy and document clearing service with a clear goal: to make international travel and business processes accessible to everyone.
                </p>
                <p>
                  Over the years, we have grown into a trusted provider of comprehensive travel solutions, work permit assistance, document services, and business support. This growth has been fueled by our dedication to excellence and the success stories of our clients.
                </p>
                <p>
                  Today, we proudly serve clients in over 20 countries, helping thousands of individuals and businesses achieve their international goals. Our team of experts brings together decades of combined experience in immigration, travel, and business services, ensuring reliable solutions at every step.
                </p>
                <p>
                  As we look to the future, we continue to innovate and expand our services while staying true to our core values: integrity, professionalism, and a customer-first approach.
                </p>
              </div>
            </div>
            
            <div className="relative">
              {/* Company Building Illustration */}
              <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl p-4 text-center max-w-xs mx-auto">
                <Building className="mx-auto mb-3 text-white" size={48} />
                <h3 className="text-white text-xl font-bold mb-2">Dubai Headquarters</h3>
                <p className="text-white/90 text-sm leading-tight">
                  Al Qiyada Metro Station Exit 2<br/>
                  Al Kazim Building Block A<br/>
                  Abu Saif Business Center<br/>
                  Office M12, Dubai, UAE
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Team - DISABLED */}
        {/*
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center text-navy-900 mb-12">Meet Our Team</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-lg text-center">
                <div className="text-6xl mb-4">{member.image}</div>
                <h3 className="text-xl font-bold text-navy-900 mb-2">{member.name}</h3>
                <div className="text-yellow-600 font-semibold mb-3">{member.role}</div>
                <p className="text-gray-600 text-sm">{member.description}</p>
              </div>
            ))}
          </div>
        </div>
        */}

        {/* Why Choose Us */}
        <div className="bg-white rounded-2xl p-8 lg:p-12 shadow-lg mb-20">
          <h2 className="text-3xl font-bold text-center text-navy-900 mb-12">Why Choose Perry Eden Group?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Professional Expertise',
                description: 'Our team consists of certified professionals with extensive experience in their respective fields.',
                icon: '🎓'
              },
              {
                title: 'Global Network',
                description: 'Strong partnerships with embassies, airlines, hotels, and service providers worldwide.',
                icon: '🌐'
              },
              {
                title: 'Fast Processing',
                description: 'Streamlined processes and dedicated teams ensure quick turnaround times.',
                icon: '⚡'
              },
              {
                title: 'Transparent Pricing',
                description: 'No hidden fees or surprise charges. All costs are clearly communicated upfront.',
                icon: '💰'
              },
              {
                title: '24/7 Support',
                description: 'Round-the-clock customer support to assist you whenever you need help.',
                icon: '🕐'
              },
              {
                title: 'Success Guarantee',
                description: 'We stand behind our services with a commitment to your success and satisfaction.',
                icon: '✅'
              }
            ].map((feature, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-bold text-navy-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Awards & Certifications */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-navy-900 mb-8">Awards & Certifications</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'ISO 9001:2015 Certified',
                description: 'Quality Management System certification for service excellence.',
                year: '2023'
              },
              {
                title: 'Dubai Chamber Member',
                description: 'Proud member of Dubai Chamber of Commerce and Industry. 2025',
                year: '2025'
              },
              {
                title: 'Customer Choice Award',
                description: 'Recognized for outstanding customer service and satisfaction.',
                year: '2022'
              }
            ].map((award, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg">
                <div className="text-3xl mb-4">🏆</div>
                <h3 className="text-lg font-bold text-navy-900 mb-2">{award.title}</h3>
                <p className="text-gray-600 text-sm mb-2">{award.description}</p>
                <div className="text-yellow-600 font-semibold">{award.year}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;