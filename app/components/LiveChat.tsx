'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    Tawk_API?: any;
    Tawk_LoadStart?: Date;
  }
}

const LiveChat = () => {
  useEffect(() => {
    // Remove any existing Tawk.to scripts first
    const existingScript = document.querySelector('script[src*="tawk.to"]');
    if (existingScript) {
      existingScript.remove();
    }

    // Clear any existing Tawk variables
    if (window.Tawk_API) {
      delete window.Tawk_API;
    }
    if (window.Tawk_LoadStart) {
      delete window.Tawk_LoadStart;
    }

    // Initialize fresh Tawk.to
    window.Tawk_API = window.Tawk_API || {};
    window.Tawk_LoadStart = new Date();

    // Create the script element
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://embed.tawk.to/68a8443d2f15d2192f4ff47a/1j38kl48b';
    script.charset = 'UTF-8';
    script.setAttribute('crossorigin', '*');

    // Add error handling
    script.onerror = () => {
      console.error('Failed to load Tawk.to script');
    };

    script.onload = () => {
      console.log('Tawk.to script loaded successfully');
    };

    // Insert the script
    document.head.appendChild(script);

    // Force widget to appear after a delay
    setTimeout(() => {
      if (window.Tawk_API) {
        console.log('Forcing Tawk.to widget to show');
        window.Tawk_API.showWidget?.();
        window.Tawk_API.maximize?.();
      }
    }, 2000);

    // Cleanup
    return () => {
      const tawkScript = document.querySelector('script[src*="tawk.to"]');
      if (tawkScript) {
        tawkScript.remove();
      }
    };
  }, []);

  return null;
};

export default LiveChat;