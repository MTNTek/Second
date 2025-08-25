import React, { useState } from 'react';
import { Shield, CheckCircle, CreditCard, Lock } from 'lucide-react';

const Payments: React.FC = () => {
  const [selectedMethod, setSelectedMethod] = useState('');

  const paymentMethods = [
    {
      id: 'visa',
      name: 'Visa',
      logo: '/Visa.png',
      description: 'Credit & Debit Cards',
      processing: '3D Secure authentication',
      security: 'Worldwide acceptance'
    },
    {
      id: 'visa-master',
      name: 'Visa & Mastercard',
      logo: '/visa and Master .png',
      description: 'Major credit cards',
      processing: 'Real-time processing',
      security: 'Advanced fraud protection'
    }
  ];

  const handleMethodSelect = (methodId: string) => {
    setSelectedMethod(methodId);
  };

  return (
    <div className="payment-methods-container">
      {/* Security Badge */}
      <div className="security-badge">
        <Shield className="shield-icon" size={32} />
        <div className="security-text">
          <h3>256-bit SSL Encryption</h3>
          <p>Your payments are fully secured</p>
        </div>
        <Lock className="lock-icon" size={32} />
      </div>

      {/* Header */}
      <div className="header-section">
        <h1>Secure Payment Options</h1>
        <p>Choose from multiple trusted payment methods with secure SSL encryption and fraud protection for all transactions.</p>
      </div>

      {/* Payment Methods Grid */}
      <div className="payment-methods-grid">
        {paymentMethods.map((method) => (
          <div
            key={method.id}
            className={`payment-method-card ${selectedMethod === method.id ? 'selected' : ''}`}
            onClick={() => handleMethodSelect(method.id)}
          >
            <div className="payment-logo-container">
              <img
                src={method.logo}
                alt={`${method.name} logo`}
                className="payment-logo"
                onError={(e) => {
                  // Hide image and show fallback if image fails to load
                  e.currentTarget.style.display = 'none';
                  const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                  if (fallback) fallback.style.display = 'flex';
                }}
              />
              <div className="fallback-container" style={{ display: 'none' }}>
                {method.id === 'visa' ? (
                  <div className="fallback-logo visa-fallback">VISA</div>
                ) : method.id === 'visa-master' ? (
                  <div className="fallback-logos">
                    <div className="fallback-logo visa-fallback">VISA</div>
                    <div className="fallback-logo master-fallback">MC</div>
                  </div>
                ) : null}
              </div>
            </div>
            <div className="payment-info">
              <h3>{method.name}</h3>
              <p className="payment-description">{method.description}</p>
              <div className="payment-features">
                <div className="feature">
                  <CheckCircle size={16} />
                  <span>{method.processing}</span>
                </div>
                <div className="feature">
                  <CheckCircle size={16} />
                  <span>{method.security}</span>
                </div>
              </div>
              <button className={`select-button ${selectedMethod === method.id ? 'selected' : ''}`}>
                {selectedMethod === method.id ? 'Selected' : 'Select Method'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Security Features */}
      <div className="security-features">
        <h2>Why Choose Our Payment System</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon ssl">
              <Shield size={32} />
            </div>
            <h4>SSL Encrypted</h4>
            <p>256-bit SSL encryption protects all transactions and personal data</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon pci">
              <CreditCard size={32} />
            </div>
            <h4>PCI Compliant</h4>
            <p>Payment Card Industry compliant processing ensures highest security</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon instant">
              <CheckCircle size={32} />
            </div>
            <h4>Instant Processing</h4>
            <p>Real-time payment processing with immediate confirmation</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .payment-methods-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          padding: 2rem;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .security-badge {
          max-width: 600px;
          margin: 0 auto 3rem;
          background: white;
          border-radius: 16px;
          padding: 1.5rem;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          border: 2px solid #10b981;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
        }

        .shield-icon, .lock-icon {
          color: #10b981;
        }

        .security-text h3 {
          margin: 0;
          font-size: 1.25rem;
          font-weight: 700;
          color: #1f2937;
        }

        .security-text p {
          margin: 0;
          font-size: 0.875rem;
          color: #6b7280;
        }

        .header-section {
          text-align: center;
          margin-bottom: 3rem;
          max-width: 800px;
          margin-left: auto;
          margin-right: auto;
        }

        .header-section h1 {
          font-size: 3rem;
          font-weight: 800;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 1rem;
        }

        .header-section p {
          font-size: 1.25rem;
          color: #6b7280;
          line-height: 1.6;
        }

        .payment-methods-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2rem;
          max-width: 1200px;
          margin: 0 auto 4rem;
        }

        .payment-method-card {
          background: white;
          border-radius: 20px;
          padding: 1.5rem;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
          cursor: pointer;
          border: 3px solid transparent;
          position: relative;
          overflow: hidden;
        }

        .payment-method-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #667eea, #764ba2);
          transform: scaleX(0);
          transition: transform 0.3s ease;
        }

        .payment-method-card:hover::before {
          transform: scaleX(1);
        }

        .payment-method-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        }

        .payment-method-card.selected {
          border-color: #10b981;
          transform: translateY(-5px);
          box-shadow: 0 15px 35px rgba(16, 185, 129, 0.2);
        }

        .payment-logo-container {
          text-align: center;
          margin-bottom: 1.5rem;
          height: 80px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          border-radius: 12px;
          padding: 0.5rem;
        }

        .payment-logo {
          max-width: 120px;
          max-height: 60px;
          object-fit: contain;
          transition: transform 0.3s ease;
          /* Clean display for actual logo images */
        }

        .fallback-container {
          width: 100%;
          height: 100%;
          justify-content: center;
          align-items: center;
        }

        /* Fallback logo styling */
        .fallback-logo {
          padding: 0.5rem 1rem;
          border-radius: 8px;
          font-weight: bold;
          font-size: 1rem;
          color: white;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        }

        .visa-fallback {
          background: linear-gradient(135deg, #1a365d, #2b77cb);
        }

        .master-fallback {
          background: linear-gradient(135deg, #eb1c26, #f79e1b);
        }

        .fallback-logos {
          display: flex;
          gap: 0.75rem;
          align-items: center;
        }

        /* Fallback styling for missing images */
        .payment-logo-container {
          text-align: center;
          margin-bottom: 1.5rem;
          height: 80px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          border-radius: 12px;
          padding: 1rem;
          position: relative;
        }

        /* Fallback text when image fails to load */
        .payment-logo-container::after {
          content: attr(data-fallback);
          position: absolute;
          font-weight: bold;
          color: #374151;
          font-size: 0.875rem;
          display: none;
        }

        .payment-logo:not([src]) + *::after,
        .payment-logo[src=""] + *::after {
          display: block;
        }

        .payment-method-card:hover .payment-logo {
          transform: scale(1.1);
        }

        .payment-info h3 {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 0.5rem;
          text-align: center;
        }

        .payment-description {
          color: #6b7280;
          text-align: center;
          margin-bottom: 1.5rem;
          font-size: 1rem;
        }

        .payment-features {
          margin-bottom: 2rem;
        }

        .feature {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.75rem;
          color: #374151;
          font-size: 0.875rem;
        }

        .feature svg {
          color: #10b981;
          flex-shrink: 0;
        }

        .select-button {
          width: 100%;
          padding: 0.875rem 1.5rem;
          border-radius: 12px;
          font-weight: 600;
          font-size: 1rem;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .select-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
        }

        .select-button.selected {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        }

        .security-features {
          max-width: 1000px;
          margin: 0 auto;
          text-align: center;
        }

        .security-features h2 {
          font-size: 2.5rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 3rem;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
        }

        .feature-card {
          background: white;
          border-radius: 16px;
          padding: 2rem;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease;
        }

        .feature-card:hover {
          transform: translateY(-5px);
        }

        .feature-icon {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.5rem;
        }

        .feature-icon.ssl {
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
        }

        .feature-icon.pci {
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
          color: white;
        }

        .feature-icon.instant {
          background: linear-gradient(135deg, #f59e0b, #d97706);
          color: white;
        }

        .feature-card h4 {
          font-size: 1.25rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 1rem;
        }

        .feature-card p {
          color: #6b7280;
          line-height: 1.6;
        }

        @media (max-width: 768px) {
          .payment-methods-container {
            padding: 1rem;
          }

          .header-section h1 {
            font-size: 2rem;
          }

          .payment-methods-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }

          .security-features h2 {
            font-size: 2rem;
          }

          .features-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Payments;