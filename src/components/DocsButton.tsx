"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { FileText } from 'lucide-react';

export default function DocsButton() {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    // Check if user is on desktop
    const checkDesktop = () => {
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
        window.innerWidth < 768;
      setIsDesktop(!isMobile);
    };

    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  // Don't render on mobile
  if (!isDesktop) {
    return null;
  }

  return (
    <Link
      href="/docs"
      className="fixed bottom-6 right-6 bg-[#0071E3] text-white rounded-full p-4 shadow-lg hover:bg-[#0051CC] transition-all duration-200 hover:scale-105 z-50 flex items-center gap-2 group"
      title="API Documentation"
    >
      <FileText className="w-5 h-5" />
      <span className="hidden group-hover:inline-block text-sm font-medium">API Docs</span>
    </Link>
  );
}
