import type { Metadata } from 'next';
import './globals.css';
import NavBar from './components/NavBar/navBar';
import { HTML_DESCRIPTION, HTML_HEADER } from '@/public/constants/secrets';
import ToastNotifier from './components/ToastNotifier/ToastNotifier';

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
    <html lang='en'>
      <body>
        <ToastNotifier />
        <NavBar />
        {children}
      </body>
    </html>
  );
}
