import localFont from 'next/font/local';

export const feligne = localFont({
  src: [
    {
      path: '../../public/fonts/Feligne-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Feligne-Italic.woff2',
      weight: '400',
      style: 'italic',
    },
  ],
  variable: '--font-feligne',
  display: 'swap',
});
