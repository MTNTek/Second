import React from 'react';
import { ArrowRight, Star, Users, Globe, Award } from 'lucide-react';

interface HeroProps {
  setActiveSection: (section: string) => void;
}

const Hero: React.FC<HeroProps> = ({ setActiveSection }) => {
  const stats = [
    { icon: Users, label: 'Happy Clients', value: '5,000+' },
    { icon: Globe, label: 'Countries Served', value: '50+' },
    { icon: Award, label: 'Years Experience', value: '10+' },
    { icon: Star, label: 'Success Rate', value: '98%' }
  ];

  return (
    <section className="relative bg-gradient-to-br from-navy-900 via-navy-800 to-navy-700 text-white py-20 lg:py-32 overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGRlZnM+CjxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPgo8cGF0aCBkPSJNIDEwIDAgTCAwIDAgMCAxMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiIHN0cm9rZS13aWR0aD0iMSIvPgo8L3BhdHRlcm4+CjwvZGVmcz4KPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIgLz4KPHN2Zz4=')] opacity-20"></div>
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="mb-6">
              <span className="inline-block bg-yellow-500 text-navy-900 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                Trusted Global Partner
              </span>
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight mb-6">
                Your Gateway to 
                <span className="text-yellow-400 block">Global Success</span>
              </h1>
              <p className="text-xl text-gray-300 leading-relaxed mb-8">
                From travel bookings to work permits, visa services to business support – 
                we make your international journey seamless and stress-free.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <button
                onClick={() => setActiveSection('travel')}
                className="bg-yellow-500 text-navy-900 px-8 py-4 rounded-lg font-semibold hover:bg-yellow-400 transition-all duration-200 flex items-center justify-center group"
              >
                Book Now
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
              </button>
              <button
                onClick={() => setActiveSection('contact')}
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-navy-900 transition-all duration-200"
              >
                Get a Quote
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <stat.icon className="mx-auto mb-2 text-yellow-400" size={24} />
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-sm text-gray-300">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            {/* Dubai skyline placeholder - using CSS to create a stylized representation */}
            <div className="relative h-96 bg-gradient-to-t from-yellow-500/20 to-transparent rounded-2xl overflow-hidden">
              <div className="absolute bottom-0 left-0 w-full h-48 bg-gradient-to-t from-navy-800 to-transparent"></div>
              <div className="absolute bottom-8 left-8 w-8 h-32 bg-gradient-to-t from-yellow-500 to-yellow-300 rounded-t-lg"></div>
              <div className="absolute bottom-8 left-20 w-6 h-40 bg-gradient-to-t from-yellow-400 to-yellow-200 rounded-t-lg"></div>
              <div className="absolute bottom-8 left-32 w-10 h-36 bg-gradient-to-t from-yellow-500 to-yellow-300 rounded-t-lg"></div>
              <div className="absolute bottom-8 right-16 w-12 h-44 bg-gradient-to-t from-yellow-400 to-yellow-200 rounded-t-lg"></div>
              <div className="absolute bottom-8 right-4 w-8 h-28 bg-gradient-to-t from-yellow-500 to-yellow-300 rounded-t-lg"></div>
              
              {/* Floating elements */}
              <div className="absolute top-4 right-4 w-16 h-16 bg-yellow-400/20 rounded-full animate-pulse"></div>
              <div className="absolute top-16 left-4 w-12 h-12 bg-yellow-300/20 rounded-full animate-pulse delay-1000"></div>
              <div className="absolute top-32 right-12 w-8 h-8 bg-yellow-500/20 rounded-full animate-pulse delay-2000"></div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-yellow-400/10 rounded-full blur-xl"></div>
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-yellow-500/10 rounded-full blur-xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;