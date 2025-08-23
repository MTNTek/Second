import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ArrowRight, Star, Users, Globe, Award, ChevronLeft, ChevronRight, Plane, FileText, Briefcase, Building, MapPin } from 'lucide-react';

interface HeroProps {
  setActiveSection: (section: string) => void;
}

const Hero: React.FC<HeroProps> = ({ setActiveSection }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const slides = [
    {
      id: 1,
      title: "Your Gateway to",
      highlight: "Global Success",
      description: "From travel bookings to work permits, visa services to business support – we make your international journey seamless and stress-free.",
      badge: "Trusted Global Partner",
      primaryAction: { text: "Book Now", section: "travel" },
      secondaryAction: { text: "Get a Quote", section: "contact" },
      image: "/Hero.jpg",
      icon: Globe
    },
    {
      id: 2,
      title: "Seamless Travel",
      highlight: "Experiences",
      description: "Book flights, hotels, and complete travel packages with our expert travel consultants. Your dream destination is just a click away.",
      badge: "Travel Experts",
      primaryAction: { text: "Book Travel", section: "travel" },
      secondaryAction: { text: "View Packages", section: "travel" },
      image: "/TOURISM.jpg",
      icon: Plane
    },
    {
      id: 3,
      title: "Visa & Work Permit",
      highlight: "Solutions",
      description: "Navigate complex visa processes and work permit applications with confidence. Our experts ensure your documents are perfect.",
      badge: "Immigration Specialists",
      primaryAction: { text: "Apply Now", section: "visa" },
      secondaryAction: { text: "Check Eligibility", section: "visa" },
      image: "/AD1.jpg",
      icon: FileText
    },
    {
      id: 4,
      title: "UAE Career",
      highlight: "Opportunities",
      description: "Unlock exclusive job opportunities in the UAE with our extensive network of employers and recruitment partners.",
      badge: "UAE Job Specialists",
      primaryAction: { text: "Find Jobs", section: "uae-jobs" },
      secondaryAction: { text: "Upload CV", section: "uae-jobs" },
      image: "/WORK1.jpg",
      icon: Briefcase
    },
    {
      id: 5,
      title: "Document & Business",
      highlight: "Services",
      description: "Professional document translation, attestation, and comprehensive business support services to meet all your administrative needs.",
      badge: "Document Experts",
      primaryAction: { text: "Get Started", section: "documents" },
      secondaryAction: { text: "Learn More", section: "about" },
      image: "/WAREHOUSE 1.jpg",
      icon: Building
    },
    {
      id: 6,
      title: "Transportation &",
      highlight: "Logistics",
      description: "Reliable transportation solutions and logistics support for your business operations and personal travel needs.",
      badge: "Transport Solutions",
      primaryAction: { text: "Book Transport", section: "contact" },
      secondaryAction: { text: "View Services", section: "travel" },
      image: "/Bike2.jpg",
      icon: MapPin
    }
  ];

  // Enhanced auto-slide functionality with smooth transition
  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
        setIsTransitioning(false);
      }, 300); // Half transition time for smooth crossfade
    }, 6000);

    return () => clearInterval(interval);
  }, [slides.length]);

  const nextSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
      setIsTransitioning(false);
    }, 300);
  };

  const prevSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
      setIsTransitioning(false);
    }, 300);
  };

  const goToSlide = (index: number) => {
    if (index === currentSlide || isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentSlide(index);
      setIsTransitioning(false);
    }, 300);
  };

  const currentSlideData = slides[currentSlide];

  return (
    <section className="relative text-white py-20 lg:py-32 overflow-hidden min-h-[700px]">
      {/* Enhanced Background Images with Crossfade - Adjusted positioning for better view */}
      <div className="absolute inset-0">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
              index === currentSlide 
                ? 'opacity-100 scale-100' 
                : 'opacity-0 scale-105'
            }`}
          >
            <Image
              src={slide.image}
              alt={`${slide.title} ${slide.highlight}`}
              fill
              className="object-cover object-center"
              style={{ 
                objectPosition: '50% 30%' // Moves the focus point up from center (50% 50%) to 30% down - showing more of the top
              }}
              priority={index === 0}
              sizes="100vw"
              quality={85}
            />
            {/* Dynamic overlay based on slide content */}
            <div className={`absolute inset-0 transition-all duration-1000 ${
              index === currentSlide 
                ? 'bg-black/40' 
                : 'bg-black/60'
            }`} />
          </div>
        ))}
      </div>
      
      {/* Enhanced Navigation Controls */}
      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20">
        <button
          onClick={prevSlide}
          disabled={isTransitioning}
          className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md hover:bg-white/30 transition-all duration-300 group shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed border border-white/20"
          aria-label="Previous slide"
        >
          <ChevronLeft className="text-white group-hover:scale-110 transition-transform duration-200" size={26} />
        </button>
      </div>
      
      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20">
        <button
          onClick={nextSlide}
          disabled={isTransitioning}
          className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md hover:bg-white/30 transition-all duration-300 group shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed border border-white/20"
          aria-label="Next slide"
        >
          <ChevronRight className="text-white group-hover:scale-110 transition-transform duration-200" size={26} />
        </button>
      </div>

      {/* Enhanced Service Icon Indicator */}
      <div className="absolute top-8 right-8 z-20">
        <div className={`w-18 h-18 bg-yellow-500/20 rounded-full flex items-center justify-center backdrop-blur-md border border-yellow-400/30 transition-all duration-700 ${
          isTransitioning ? 'scale-90 opacity-70' : 'scale-100 opacity-100'
        }`}>
          <currentSlideData.icon className="text-yellow-400 transition-all duration-500" size={32} />
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="flex items-center justify-center min-h-[500px]">
          {/* Enhanced Content with Staggered Animations */}
          <div 
            key={`${currentSlide}-content`} 
            className={`text-center max-w-4xl transition-all duration-800 ease-out ${
              isTransitioning 
                ? 'opacity-0 transform translate-y-8 scale-95' 
                : 'opacity-100 transform translate-y-0 scale-100'
            }`}
          >
            <div className="mb-8">
              {/* Badge with enhanced animation */}
              <span 
                className={`inline-block bg-yellow-500 text-navy-900 px-6 py-3 rounded-full text-sm font-bold mb-6 transform transition-all duration-500 shadow-lg hover:shadow-xl ${
                  isTransitioning 
                    ? 'translate-y-4 opacity-0 scale-95' 
                    : 'translate-y-0 opacity-100 scale-100'
                }`}
                style={{ transitionDelay: isTransitioning ? '0ms' : '100ms' }}
              >
                {currentSlideData.badge}
              </span>
              
              {/* Title with enhanced animation */}
              <h1 
                className={`text-5xl lg:text-7xl font-bold leading-tight mb-6 transform transition-all duration-600 drop-shadow-2xl ${
                  isTransitioning 
                    ? 'translate-y-6 opacity-0 scale-95' 
                    : 'translate-y-0 opacity-100 scale-100'
                }`}
                style={{ transitionDelay: isTransitioning ? '0ms' : '200ms' }}
              >
                {currentSlideData.title}
                <span className="text-yellow-400 block">{currentSlideData.highlight}</span>
              </h1>
              
              {/* Description with enhanced animation */}
              <p 
                className={`text-xl lg:text-2xl text-gray-100 leading-relaxed mb-8 transform transition-all duration-700 drop-shadow-lg max-w-3xl mx-auto ${
                  isTransitioning 
                    ? 'translate-y-8 opacity-0 scale-95' 
                    : 'translate-y-0 opacity-100 scale-100'
                }`}
                style={{ transitionDelay: isTransitioning ? '0ms' : '300ms' }}
              >
                {currentSlideData.description}
              </p>
            </div>

            {/* Buttons with enhanced animations */}
            <div 
              className={`flex flex-col sm:flex-row gap-4 mb-12 justify-center transform transition-all duration-800 ${
                isTransitioning 
                  ? 'translate-y-10 opacity-0 scale-95' 
                  : 'translate-y-0 opacity-100 scale-100'
              }`}
              style={{ transitionDelay: isTransitioning ? '0ms' : '400ms' }}
            >
              <button
                onClick={() => setActiveSection(currentSlideData.primaryAction.section)}
                className="bg-yellow-500 text-navy-900 px-8 py-4 rounded-lg font-bold hover:bg-yellow-400 transition-all duration-300 flex items-center justify-center group transform hover:scale-105 hover:-translate-y-1 shadow-xl hover:shadow-2xl text-lg"
              >
                {currentSlideData.primaryAction.text}
                <ArrowRight className="ml-2 group-hover:translate-x-2 transition-transform duration-300" size={20} />
              </button>
              <button
                onClick={() => setActiveSection(currentSlideData.secondaryAction.section)}
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold hover:bg-white hover:text-navy-900 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 backdrop-blur-sm shadow-xl hover:shadow-2xl text-lg"
              >
                {currentSlideData.secondaryAction.text}
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Slide Indicators */}
        <div className="flex justify-center mt-12 space-x-3 relative z-20">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              disabled={isTransitioning}
              className={`h-4 rounded-full transition-all duration-500 backdrop-blur-sm border border-white/20 hover:border-white/40 disabled:cursor-not-allowed ${
                index === currentSlide 
                  ? 'bg-yellow-400 w-12 shadow-lg scale-110' 
                  : 'bg-white/30 hover:bg-white/50 w-4 hover:scale-110'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Enhanced Progress Bar */}
        <div className="mt-8 w-full bg-white/20 rounded-full h-3 relative z-20 backdrop-blur-sm border border-white/20 shadow-lg">
          <div 
            className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-3 rounded-full transition-all duration-1000 ease-out shadow-lg"
            style={{ 
              width: `${((currentSlide + 1) / slides.length) * 100}%`,
              boxShadow: '0 0 20px rgba(251, 191, 36, 0.5)'
            }}
          />
        </div>
      </div>

      {/* Enhanced Floating decorative elements */}
      <div className="absolute top-20 right-20 w-32 h-32 bg-yellow-400/10 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-20 left-20 w-40 h-40 bg-yellow-500/10 rounded-full blur-xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-yellow-300/5 rounded-full blur-xl animate-pulse delay-500"></div>
    </section>
  );
};

export default Hero;