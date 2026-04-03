import React from 'react';
import Link from 'next/link';
import { Github, ExternalLink, FileText, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-[#E5E5EA]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#0071E3] rounded-lg flex items-center justify-center">
                <FileText className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-[#1D1D1F]">BSEB Result Portal</h3>
            </div>
            <p className="text-sm text-[#6E6E73] leading-relaxed">
              Official portal for Bihar School Examination Board Class 10th results. 
              Instant access to examination results with comprehensive details.
            </p>
            <div className="flex gap-3">
              <Link
                href="/docs"
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#0071E3] text-white rounded-lg hover:bg-[#0051CC] transition-colors text-sm font-medium"
              >
                <FileText className="w-4 h-4" />
                API Docs
              </Link>
              <a
                href="https://github.com"
                className="inline-flex items-center gap-2 px-4 py-2 border border-[#E5E5EA] rounded-lg hover:bg-[#F5F5F7] transition-colors text-sm font-medium text-[#1D1D1F]"
              >
                <Github className="w-4 h-4" />
                GitHub
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#1D1D1D1F]">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-[#6E6E73] hover:text-[#0071E3] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/docs" className="text-[#6E6E73] hover:text-[#0071E3] transition-colors">
                  API Documentation
                </Link>
              </li>
              <li>
                <Link href="/result" className="text-[#6E6E73] hover:text-[#0071E3] transition-colors">
                  Check Result
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#1D1D1D1F]">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://biharboard.bihar.gov.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#6E6E73] hover:text-[#0071E3] transition-colors flex items-center gap-1"
                >
                  <ExternalLink className="w-3 h-3" />
                  BSEB Official
                </a>
              </li>
              <li>
                <a
                  href="https://results.biharboardonline.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#6E6E73] hover:text-[#0071E3] transition-colors flex items-center gap-1"
                >
                  <ExternalLink className="w-3 h-3" />
                  Results Portal
                </a>
              </li>
              <li>
                <a
                  href="/docs"
                  className="text-[#6E6E73] hover:text-[#0071E3] transition-colors flex items-center gap-1"
                >
                  <FileText className="w-3 h-3" />
                  API Docs
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#1D1D1D1F]">Contact</h3>
            <div className="space-y-3">
              <p className="text-sm text-[#6E6E73]">
                For technical support or API inquiries:
              </p>
              <a
                href="mailto:support@bsebresult.com"
                className="inline-flex items-center gap-2 px-4 py-2 border border-[#E5E5EA] rounded-lg hover:bg-[#F5F5F7] transition-colors text-sm font-medium text-[#1D1D1F]"
              >
                <Mail className="w-4 h-4" />
                support@bsebresult.com
              </a>
              <div className="flex gap-3">
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#6E6E73] hover:text-[#0071E3] transition-colors"
                >
                  Twitter
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#6E6E73] hover:text-[#0071E3] transition-colors"
                >
                  Facebook
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-[#E5E5EA]">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-[#6E6E73]">
              © 2026 BSEB Result Portal. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm text-[#6E6E73]">
              <Link href="/privacy" className="hover:text-[#0071E3] transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-[#0071E3] transition-colors">
                Terms of Service
              </Link>
              <Link href="/docs" className="hover:text-[#0071E3] transition-colors flex items-center gap-1">
                <FileText className="w-3 h-3" />
                API
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
