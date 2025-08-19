import React, { useState } from 'react';
import { CreditCard, DollarSign, Euro, Banknote, Shield, Clock, CheckCircle, ArrowRight } from 'lucide-react';

const Payments: React.FC = () => {
  const [selectedCurrency, setSelectedCurrency] = useState('aed');
  const [paymentMethod, setPaymentMethod] = useState('card');

  const currencies = [
    { id: 'aed', name: 'UAE Dirham', symbol: 'AED', flag: '🇦🇪', icon: Banknote },
    { id: 'usd', name: 'US Dollar', symbol: 'USD', flag: '🇺🇸', icon: DollarSign },
    { id: 'eur', name: 'Euro', symbol: 'EUR', flag: '🇪🇺', icon: Euro }
  ];

  const paymentMethods = {
    aed: [
      { id: 'payfast', name: 'PayTabs', desc: 'Secure local payment gateway', fee: '2.9%' },
      { id: 'network', name: 'Network International', desc: 'UAE bank transfers', fee: '2.5%' },
      { id: 'cash', name: 'Cash Payment', desc: 'Pay at our office', fee: 'Free' }
    ],
    usd: [
      { id: 'stripe', name: 'Stripe', desc: 'International credit cards', fee: '2.9% + $0.30' },
      { id: 'paypal', name: 'PayPal', desc: 'Secure global payments', fee: '3.49%' },
      { id: 'wise', name: 'Wise Transfer', desc: 'Bank transfers worldwide', fee: '0.5-2%' }
    ],
    eur: [
      { id: 'stripe-eur', name: 'Stripe', desc: 'European credit cards', fee: '2.9% + €0.25' },
      { id: 'sepa', name: 'SEPA Transfer', desc: 'European bank transfers', fee: '1%' },
      { id: 'paypal-eur', name: 'PayPal', desc: 'Secure European payments', fee: '3.49%' }
    ]
  };

  const currentCurrency = currencies.find(c => c.id === selectedCurrency);
  const currentMethods = paymentMethods[selectedCurrency as keyof typeof paymentMethods];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold text-navy-900 mb-6">
            Secure Online Payments
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Pay safely in Euro (EUR), US Dollar (USD), or UAE Dirham (AED) using trusted payment gateways. Your security is our priority.
          </p>
        </div>

        {/* Currency Selection */}
        <div className="flex justify-center mb-12">
          <div className="flex space-x-4">
            {currencies.map((currency) => (
              <button
                key={currency.id}
                onClick={() => setSelectedCurrency(currency.id)}
                className={`flex items-center space-x-3 px-6 py-4 rounded-xl font-semibold transition-all duration-200 ${
                  selectedCurrency === currency.id
                    ? 'bg-yellow-500 text-navy-900 shadow-xl'
                    : 'bg-white text-gray-700 hover:bg-gray-50 shadow-lg'
                }`}
              >
                <span className="text-2xl">{currency.flag}</span>
                <div>
                  <currency.icon size={20} />
                </div>
                <div className="text-left">
                  <div className="font-bold">{currency.symbol}</div>
                  <div className="text-sm">{currency.name}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Payment Form */}
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Payment Methods */}
            <div className="lg:col-span-1">
              <h3 className="text-xl font-bold text-navy-900 mb-4">
                Payment Methods ({currentCurrency?.symbol})
              </h3>
              <div className="space-y-3">
                {currentMethods.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id)}
                    className={`w-full p-4 rounded-lg text-left transition-all duration-200 ${
                      paymentMethod === method.id
                        ? 'bg-yellow-500 text-navy-900'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <div className="font-semibold">{method.name}</div>
                    <div className="text-sm opacity-80">{method.desc}</div>
                    <div className="text-sm font-medium mt-1">Fee: {method.fee}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Payment Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="flex items-center mb-6">
                  <CreditCard className="mr-3 text-yellow-500" size={28} />
                  <h3 className="text-2xl font-bold text-navy-900">Payment Details</h3>
                </div>

                <form className="space-y-6">
                  {/* Service Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Service</label>
                    <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent">
                      <option value="">Select service</option>
                      <option value="visa">Visa Services</option>
                      <option value="travel">Travel Booking</option>
                      <option value="work-permit">Work Permit</option>
                      <option value="document">Document Services</option>
                      <option value="other">Other Services</option>
                    </select>
                  </div>

                  {/* Amount */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500">{currentCurrency?.symbol}</span>
                      </div>
                      <input
                        type="number"
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  {/* Personal Information */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                      <input
                        type="text"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                        placeholder="John"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                      <input
                        type="text"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                        placeholder="Doe"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      placeholder="your@email.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      placeholder="+971 55 000 0000"
                    />
                  </div>

                  {/* Payment Information (for card payments) */}
                  {(paymentMethod === 'card' || paymentMethod.includes('stripe') || paymentMethod.includes('paypal')) && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
                        <input
                          type="text"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                          placeholder="1234 5678 9012 3456"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
                          <input
                            type="text"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                            placeholder="MM/YY"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                          <input
                            type="text"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                            placeholder="123"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Payment Description</label>
                    <textarea
                      rows={3}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      placeholder="Brief description of the service or reference number"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-yellow-500 text-navy-900 py-4 px-6 rounded-lg font-semibold hover:bg-yellow-400 transition-colors duration-200 flex items-center justify-center"
                  >
                    Process Payment
                    <ArrowRight className="ml-2" size={20} />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Security Features */}
        <div className="mt-20">
          <h3 className="text-3xl font-bold text-center text-navy-900 mb-12">Secure Payment Features</h3>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: 'SSL Encryption',
                description: 'All transactions are protected with 256-bit SSL encryption for maximum security.'
              },
              {
                icon: CheckCircle,
                title: 'PCI Compliant',
                description: 'Our payment systems meet the highest industry security standards (PCI DSS).'
              },
              {
                icon: Clock,
                title: 'Instant Processing',
                description: 'Most payments are processed instantly with immediate confirmation.'
              }
            ].map((feature, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-lg text-center">
                <feature.icon className="mx-auto mb-4 text-yellow-500" size={48} />
                <h4 className="text-xl font-bold text-navy-900 mb-3">{feature.title}</h4>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Methods Info */}
        <div className="mt-20">
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h3 className="text-3xl font-bold text-center text-navy-900 mb-8">Supported Payment Methods</h3>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl mb-4">🇦🇪</div>
                <h4 className="text-xl font-bold text-navy-900 mb-3">UAE Dirham (AED)</h4>
                <ul className="text-gray-600 text-sm space-y-1">
                  <li>• PayTabs Gateway</li>
                  <li>• Network International</li>
                  <li>• Local Bank Transfers</li>
                  <li>• Cash Payment at Office</li>
                </ul>
              </div>
              
              <div className="text-center">
                <div className="text-4xl mb-4">🇺🇸</div>
                <h4 className="text-xl font-bold text-navy-900 mb-3">US Dollar (USD)</h4>
                <ul className="text-gray-600 text-sm space-y-1">
                  <li>• Stripe Payment Gateway</li>
                  <li>• PayPal</li>
                  <li>• International Wire Transfer</li>
                  <li>• Wise Money Transfer</li>
                </ul>
              </div>
              
              <div className="text-center">
                <div className="text-4xl mb-4">🇪🇺</div>
                <h4 className="text-xl font-bold text-navy-900 mb-3">Euro (EUR)</h4>
                <ul className="text-gray-600 text-sm space-y-1">
                  <li>• Stripe European Gateway</li>
                  <li>• SEPA Bank Transfers</li>
                  <li>• PayPal Europe</li>
                  <li>• European Credit Cards</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payments;