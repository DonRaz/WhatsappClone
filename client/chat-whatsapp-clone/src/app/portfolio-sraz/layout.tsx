'use client';

import React from 'react';
import Footer from './(sections)/(footer)/components/footer';

export default function PortfolioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow">
        {children}
      </div>
      <Footer />
    </div>
  );
} 