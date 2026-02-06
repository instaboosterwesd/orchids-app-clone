import React from 'react';
import Image from 'next/image';

const Footer = () => {
  const currentYear = 2026;

  return (
    <footer className="w-full bg-[#0c0c0c] text-foreground font-sans pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 pb-16">
          {/* Logo Section */}
          <div className="md:col-span-4 flex flex-col items-start">
            <a href="/" className="inline-block transition-opacity hover:opacity-80">
              <Image
                src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/73d57872-771a-4961-af92-b0e3d7a9c0d3-orchids-app/assets/svgs/orchids-logo-full-1_0-1.svg"
                alt="orchids"
                width={120}
                height={32}
                className="h-8 w-auto"
                priority
              />
            </a>
          </div>

          {/* Links Sections */}
          <div className="md:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-8">
            {/* Company Column */}
            <div className="flex flex-col gap-4">
              <h3 className="text-[12px] font-medium text-muted-foreground uppercase tracking-wider mb-2">
                Company
              </h3>
              <ul className="flex flex-col gap-3">
                <li>
                  <a href="/enterprise" className="text-sm text-foreground/80 hover:text-foreground transition-colors">
                    Enterprise
                  </a>
                </li>
                <li>
                  <button className="text-sm text-foreground/80 hover:text-foreground transition-colors text-left">
                    Pricing
                  </button>
                </li>
                <li>
                  <a 
                    href="https://grove-jelly-78f.notion.site/Work-at-Orchids-22b0af79f8e4800998d7ea5f902455e4" 
                    className="text-sm text-foreground/80 hover:text-foreground transition-colors"
                  >
                    Careers
                  </a>
                </li>
                <li>
                  <a href="/privacy" className="text-sm text-foreground/80 hover:text-foreground transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="/terms" className="text-sm text-foreground/80 hover:text-foreground transition-colors">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>

            {/* Resources Column */}
            <div className="flex flex-col gap-4">
              <h3 className="text-[12px] font-medium text-muted-foreground uppercase tracking-wider mb-2">
                Resources
              </h3>
              <ul className="flex flex-col gap-3">
                <li>
                  <a href="https://docs.orchids.app" className="text-sm text-foreground/80 hover:text-foreground transition-colors">
                    Docs
                  </a>
                </li>
              </ul>
            </div>

            {/* Community Column */}
            <div className="flex flex-col gap-4 col-span-2 md:col-span-1">
              <h3 className="text-[12px] font-medium text-muted-foreground uppercase tracking-wider mb-2">
                Community
              </h3>
              <ul className="flex flex-col gap-3">
                <li>
                  <a href="#" className="flex items-center gap-2 text-sm text-foreground/80 hover:text-foreground transition-colors">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037 19.736 19.736 0 0 0-4.885 1.515.069.069 0 0 0-.032.027C.533 9.048-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.125-.094.249-.192.37-.293a.074.074 0 0 1 .077-.01c3.927 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .077.01c.12.101.246.199.372.293a.077.077 0 0 1-.006.128 12.98 12.98 0 0 1-1.873.891.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.419 0 1.334-.956 2.419-2.157 2.419zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.419 0 1.334-.946 2.419-2.157 2.419z"/>
                    </svg>
                    Discord
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center gap-2 text-sm text-foreground/80 hover:text-foreground transition-colors">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                    X
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center gap-2 text-sm text-foreground/80 hover:text-foreground transition-colors">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 .001-4.125 2.062 2.062 0 0 1 0 4.125zM7.119 20.452H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                    LinkedIn
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col items-center justify-center">
          <p className="text-[12px] text-muted-foreground/60 tracking-tight">
            © {currentYear} Orchids. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;