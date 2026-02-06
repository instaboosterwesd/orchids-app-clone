import React from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';

/**
 * BuiltInBrowserSection component
 * Clones the "Built-in browser" section with pixel-perfect accuracy.
 * Features a left-aligned text area and a right-aligned video preview of a browser.
 */
export default function BuiltInBrowserSection() {
  const videoUrl = "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/hero-assets/hero-browser-compressed.mp4";

  return (
    <section 
      className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 md:py-[150px]"
      aria-label="Built-in browser feature"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-8 items-center">
        {/* Left Content Area */}
        <div className="flex flex-col gap-4 md:gap-6">
          <h2 className="text-[32px] md:text-[36px] font-medium text-white leading-tight tracking-[-0.01em] font-sans">
            Built-in browser
          </h2>
          <p className="text-[14px] md:text-[16px] text-white/60 leading-relaxed font-sans max-w-[400px]">
            Select and grab any UI element on the web.
          </p>
          
          <div className="mt-2 flex items-stretch">
            <button 
              className="flex items-center justify-center px-4 py-2 border border-white/10 text-sm font-medium cursor-pointer bg-white text-[#0c0c0c] transition-all duration-200 hover:bg-white/90 rounded-l-[2px] border-r-0 h-[36px] whitespace-nowrap"
            >
              Download for free
            </button>
            <button 
              aria-label="More download options" 
              className="px-2 py-2 rounded-r-[2px] border border-white/10 bg-white text-[#0c0c0c] hover:bg-white/90 transition-all duration-200 flex items-center justify-center h-[36px]"
            >
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right Media Area (Browser Video) */}
        <div className="relative w-full aspect-[16/10] overflow-hidden rounded-[2px] border border-white/10 bg-[#1d1e1d]">
          {/* Subtle Video Container Grid/Overlay for technical feel */}
          <div className="absolute inset-0 pointer-events-none z-10 border border-white/5"></div>
          
          {/* Browser Window Mockup Top Bar (Subtle) */}
          <div className="absolute top-0 left-0 right-0 h-6 bg-[#161616] border-b border-white/5 flex items-center px-3 gap-1.5 z-20">
            <div className="w-1.5 h-1.5 rounded-full bg-white/10"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-white/10"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-white/10"></div>
            <div className="ml-2 h-3 w-32 bg-white/5 rounded-[1px]"></div>
          </div>

          <video 
            src={videoUrl}
            autoPlay 
            loop 
            muted 
            playsInline
            className="w-full h-full object-cover pt-6"
            poster="subtle-placeholder-color" 
          >
            Your browser does not support the video tag.
          </video>
          
          {/* Gradient overlay for depth matching the page theme */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0c]/20 to-transparent pointer-events-none"></div>
        </div>
      </div>
    </section>
  );
}