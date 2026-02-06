import React from 'react';
import Image from 'next/image';
import { ChevronDown, Menu } from 'lucide-react';

/**
 * Header component for Orchids - The AI App Builder.
 * Features a fixed navigation with logo, central links, and right-aligned actions.
 */
const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-[100]">
      <div className="w-full py-2.5 sm:py-3 md:py-4 transition-all duration-300 bg-[#0c0c0c]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <nav className="w-full flex items-center justify-between relative" aria-label="Main navigation">
            {/* Logo Section */}
            <div className="flex-1 min-w-0">
              <a href="/" className="inline-block outline-none">
                <div className="flex items-center shrink-0">
                  <Image 
                    src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/73d57872-771a-4961-af92-b0e3d7a9c0d3-orchids-app/assets/svgs/orchids-logo-full-1_0-1.svg" 
                    alt="orchids" 
                    width={120} 
                    height={32} 
                    priority
                    className="h-8 w-auto"
                  />
                </div>
              </a>
            </div>

            {/* Central Links - Desktop Only */}
            <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-6">
              <a 
                className="text-sm font-medium text-white hover:text-white/80 transition-colors" 
                href="https://docs.orchids.app"
              >
                Docs
              </a>
              <button 
                className="hidden md:block text-sm font-medium text-white hover:text-white/80 transition-colors cursor-pointer outline-none"
              >
                Pricing
              </button>
              <a 
                className="text-sm font-medium text-white hover:text-white/80 transition-colors" 
                href="/enterprise"
              >
                Enterprise
              </a>
              <a 
                className="text-sm font-medium text-white hover:text-white/80 transition-colors whitespace-nowrap" 
                href="https://grove-jelly-78f.notion.site/Work-at-Orchids-22b0af79f8e4800998d7ea5f902455e4"
              >
                Careers
              </a>
            </div>

            {/* Right Actions */}
            <div className="flex-1 flex items-center gap-2 sm:gap-3 justify-end">
              {/* Split Download Button */}
              <div className="flex items-stretch">
                <button className="flex items-center justify-center gap-2 px-3 sm:px-4 py-1.5 border border-white/10 text-xs sm:text-sm font-medium cursor-pointer bg-white text-[#0c0c0c] transition-all duration-200 hover:bg-white/90 rounded-l-[2px] border-r-0 h-[28px] sm:h-[36px] whitespace-nowrap outline-none">
                  <span>Download for Linux</span>
                </button>
                <div className="w-[1px] bg-black/10 z-10"></div>
                <button 
                  aria-label="More download options" 
                  className="px-1.5 sm:px-2 rounded-r-[2px] border border-white/10 bg-white text-[#0c0c0c] hover:bg-white/90 transition-all duration-200 flex items-center justify-center h-[28px] sm:h-[36px] outline-none"
                >
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Sign In - Desktop Only */}
              <div className="hidden md:block">
                <button className="text-xs font-medium text-white shrink-0 cursor-pointer transition-all duration-200 px-3 h-[28px] sm:h-[36px] flex items-center justify-center rounded-[2px] border border-white/10 bg-[#1d1e1d] hover:bg-white/10 outline-none">
                  Sign in
                </button>
              </div>

              {/* Mobile Menu Trigger */}
              <button 
                className="md:hidden text-white shrink-0 cursor-pointer transition-all duration-200 px-2.5 h-[28px] sm:h-[36px] flex items-center justify-center rounded-[2px] border border-white/10 bg-[#1d1e1d] hover:bg-white/10 ml-1 outline-none"
                aria-label="Open menu"
              >
                <Menu className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </nav>
        </div>
      </div>
      {/* Subtle bottom border line for the header */}
      <div className="w-full h-[1px] bg-white/10"></div>
    </header>
  );
};

export default Header;