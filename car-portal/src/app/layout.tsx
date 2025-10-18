import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { AuthProvider } from './AuthProvider';
import Header from '@/components/Header';
import Chatbot from '@/components/chatbot/Chatbot';
import { prisma } from '@/lib/prisma';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Car Portal',
  description: 'El portal de venta de autos del futuro',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const themeSettings = await prisma.themeSettings.findUnique({
    where: { singleton: true },
  });
  const primaryColor = themeSettings?.primaryColor || '#3B82F6';

  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={{ '--primary-color': primaryColor } as React.CSSProperties}
      >
        <AuthProvider>
          <Header />
          <main>{children}</main>
          <Chatbot />
        </AuthProvider>
      </body>
    </html>
  );
}
