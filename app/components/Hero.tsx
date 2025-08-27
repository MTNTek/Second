import React, { useState, useEffect } from 'react';
import Image from 'next/image';

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
      image: "/DXB N2.jpg"
    },
    {
      id: 2,
      title: "Seamless Travel",
      highlight: "Experiences",
      image: "/TOURISM.jpg"
    },
    {
      id: 3,
      title: "Visa & Work Permit",
      highlight: "Solutions",
      image: "/AD1.jpg"
    },
    {
      id: 5,
      title: "Document & Business",
      highlight: "Services",
      image: "/WAREHOUSE 1.jpg"
    },
    {
      id: 6,
      title: "Direct Employment for",
      highlight: "Bike Riders",
      image: "/Bike2.jpg"
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
                objectPosition: index === 1 ? '65% 65%' : '50% 30%' // Move slide 2 (airplane/TOURISM.jpg) to the right and show more bottom content
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
            </div>
          </div>
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