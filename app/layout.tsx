import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'IDA - Editorial Intelligence Agent',
  description: 'Intelligence for the Defender\'s Advantage. Editorial intelligence for The Kansas City Defender.',
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="dark bg-dark-bg text-dark-text-primary antialiased">
        {children}
      </body>
    </html>
  );
}
