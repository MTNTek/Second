import React from 'react';
import PaymentMethods from './components/PaymentMethods';
import './styles/PaymentMethods.css';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Secure Payment Options
          </h1>
          <p className="text-gray-600 text-lg">
            Choose from multiple trusted payment methods
          </p>
        </header>
        
        <PaymentMethods />
        
        <footer className="text-center mt-8">
          <p className="text-gray-500 text-sm">
            Ready to integrate your transparent logo images
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
