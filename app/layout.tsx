import './globals.css';
import type { Metadata } from 'next';
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
      <body><LanguageProvider>{children}</LanguageProvider></body>
    </html>
  );
}
