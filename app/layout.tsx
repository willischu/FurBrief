import './globals.css';
import type { Metadata } from 'next';
import Script from 'next/script';
import { LanguageProvider } from '../contexts/LanguageContext';

export const metadata: Metadata = {
  title: 'Furbrief — Plain English for Pet Parents',
  description: 'Upload vet discharge papers and get a plain-English care plan in 60 seconds.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://furbrief.com'),
  openGraph: {
    title: 'Furbrief — Plain English for Pet Parents',
    description: 'Upload vet discharge papers and get a plain-English care plan in 60 seconds.',
    images: ['/og-image.png'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <Script id="rewardful-init" strategy="beforeInteractive">{`(function(w,r){w._rwq=r;w[r]=w[r]||function(){(w[r].q=w[r].q||[]).push(arguments)}})(window,'rewardful');`}</Script>
        <Script src="https://r.wdfl.co/rw.js" data-rewardful="e8026d" strategy="beforeInteractive" />
      </head>
      <body><LanguageProvider>{children}</LanguageProvider></body>
    </html>
  );
}
