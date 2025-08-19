'use client';

import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Services from './components/Services';
import TravelServices from './components/TravelServices';
import VisaServices from './components/VisaServices';
import WorkPermits from './components/WorkPermits';
import UAEJobs from './components/UAEJobs';
import DocumentServices from './components/DocumentServices';
import Payments from './components/Payments';
import About from './components/About';
import Contact from './components/Contact';
import Footer from './components/Footer';

export default function Home() {
  const [activeSection, setActiveSection] = useState('home');

  return (
    <div className="min-h-screen bg-white">
      <Header activeSection={activeSection} setActiveSection={setActiveSection} />
      
      {activeSection === 'home' && (
        <>
          <Hero setActiveSection={setActiveSection} />
          <Services setActiveSection={setActiveSection} />
        </>
      )}
      
      {activeSection === 'travel' && <TravelServices />}
      {activeSection === 'visa' && <VisaServices />}
      {activeSection === 'work-permits' && <WorkPermits />}
      {activeSection === 'uae-jobs' && <UAEJobs />}
      {activeSection === 'documents' && <DocumentServices />}
      {activeSection === 'payments' && <Payments />}
      {activeSection === 'about' && <About />}
      {activeSection === 'contact' && <Contact />}
      
      <Footer setActiveSection={setActiveSection} />
    </div>
  );
}