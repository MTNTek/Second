'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';
import { LoginForm, RegisterForm } from './forms/AuthForms';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultView?: 'login' | 'register';
}

export function AuthModal({ isOpen, onClose, defaultView = 'login' }: AuthModalProps) {
  const [currentView, setCurrentView] = useState<'login' | 'register'>(defaultView);

  if (!isOpen) return null;

  const handleSuccess = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="relative max-w-md w-full max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
        >
          <X size={20} className="text-gray-600" />
        </button>

        {currentView === 'login' ? (
          <LoginForm
            onSuccess={handleSuccess}
            onRegisterClick={() => setCurrentView('register')}
          />
        ) : (
          <RegisterForm
            onSuccess={handleSuccess}
            onLoginClick={() => setCurrentView('login')}
          />
        )}
      </div>
    </div>
  );
}
