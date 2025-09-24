import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import { Inter } from 'next/font/google';

import './globals.css';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export const metadata: Metadata = {
  title: {
    default: 'Infoverse Learning',
    template: '%s | Infoverse Learning',
  },
  description:
    'High-impact online tutoring for GCSE, A-Level and IB students. Discover personalised pathways, expert tutors and proven exam success.',
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    siteName: 'Infoverse Learning',
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@infoverselearning',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} bg-slate-100 text-slate-900 antialiased`}>
        {children}
        <Script id="analytics" strategy="lazyOnload">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){window.dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XXXXXXX');
          `}
        </Script>
      </body>
    </html>
  );
};

export default RootLayout;
