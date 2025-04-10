import type { Metadata } from 'next';
import './globals.css';
import NavBar from './components/NavBar/navBar';
import { HTML_DESCRIPTION, HTML_HEADER } from '@/public/constants/secrets';
import ToastNotifier from './components/ToastNotifier/ToastNotifier';
import { feligne } from '../lib/fonts';
import StoreProvider from './StoreProvider';
import Footer from './components/Footer/Footer';

export const metadata: Metadata = {
  title: HTML_HEADER,
  description: HTML_DESCRIPTION,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' className={feligne.variable}>
      <head>
        <link
          rel='shortcut icon'
          href='/images/favicon.ico'
          type='image/x-icon'
        />
      </head>
      <body>
        <StoreProvider>
          <ToastNotifier />
          <NavBar />
          {children}
          <Footer/>
        </StoreProvider>
      </body>
    </html>
  );
}
