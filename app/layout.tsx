import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'BackFlow — Visual Backend Builder',
  description: 'Design Mongoose schemas, hooks, and file upload pipelines visually',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ margin: 0, padding: 0, background: '#09090b' }}>
        {children}
      </body>
    </html>
  );
}