import React from 'react';
import { CreditCard, Smartphone, Globe } from 'lucide-react';

interface PaymentMethodProps {
  name: string;
  imageSrc?: string;
  icon?: React.ReactNode;
  className?: string;
}

const PaymentMethod: React.FC<PaymentMethodProps> = ({ name, imageSrc, icon, className = '' }) => {
  return (
    <div className={`payment-method-card ${className}`}>
      {imageSrc ? (
        <img 
          src={imageSrc} 
          alt={name}
          className="payment-logo"
        />
      ) : (
        <div className="payment-icon">
          {icon}
        </div>
      )}
      <span className="payment-name">{name}</span>
    </div>
  );
};

const PaymentMethods: React.FC = () => {
  return (
    <div className="payment-methods-container">
      <h2 className="section-title">We Accept</h2>
      
      <div className="payment-grid">
        {/* Using actual images with background removal CSS */}
        <PaymentMethod 
          name="PayPal" 
          imageSrc="/paypal.png"
          className="paypal"
        />
        <PaymentMethod 
          name="Visa" 
          imageSrc="/Visa.png"
          className="visa"
        />
        <PaymentMethod 
          name="Visa & Mastercard" 
          imageSrc="/visa and Master .png"
          className="visa-master"
        />
        <PaymentMethod 
          name="Skrill" 
          imageSrc="/Skrill .png"
          className="skrill"
        />
        
        {/* Placeholder icons for additional methods */}
        <PaymentMethod 
          name="Credit Card" 
          icon={<CreditCard size={32} />}
          className="credit-card"
        />
        <PaymentMethod 
          name="Mobile Pay" 
          icon={<Smartphone size={32} />}
          className="mobile-pay"
        />
        <PaymentMethod 
          name="Online Banking" 
          icon={<Globe size={32} />}
          className="online-banking"
        />
      </div>
      
      <div className="payment-security">
        <p className="security-text">
          🔒 All payments are secured with 256-bit SSL encryption
        </p>
      </div>
    </div>
  );
};

export default PaymentMethods;