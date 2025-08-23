import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'
import { AuthProvider } from '@/context/AuthContext'
import { WebVitals } from '../src/components/WebVitals'

export const metadata: Metadata = {
  title: 'Perry Eden Group of Companies - Global Travel & Business Services',
  description: 'Your trusted partner for global travel, visa services, work permits, and business support. Based in Dubai, UAE.',
  keywords: 'travel services, visa applications, work permits, UAE jobs, document services, Dubai, immigration',
  authors: [{ name: 'Perry Eden Group' }],
  openGraph: {
    title: 'Perry Eden Group - Global Travel & Business Services',
    description: 'Professional travel, visa, and business services in Dubai, UAE',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-sans">
        <AuthProvider>
          {children}
          <WebVitals />
        </AuthProvider>
        
        {/* Tawk.to Live Chat Script */}
        <Script
          id="tawk-to-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
              (function(){
                var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
                s1.async=true;
                s1.src='https://embed.tawk.to/68a8443d2f15d2192f4ff47a/1j38kl48b';
                s1.charset='UTF-8';
                s1.setAttribute('crossorigin','*');
                s0.parentNode.insertBefore(s1,s0);
                
                // Debug logging
                console.log('Tawk.to script injected');
                
                // Force widget to show after load
                setTimeout(function() {
                  if (window.Tawk_API) {
                    console.log('Tawk.to API available, showing widget');
                    if (window.Tawk_API.showWidget) window.Tawk_API.showWidget();
                  }
                }, 3000);
              })();
            `
          }}
        />
      </body>
    </html>
  )
}