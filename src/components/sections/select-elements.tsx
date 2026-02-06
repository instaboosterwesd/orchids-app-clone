import React from 'react';
import { ChevronDown } from 'lucide-react';

/**
 * SelectElements (Built-in browser) Section
 * 
 * This component clones the final feature showcase section titled "Built-in browser"
 * and "Select and grab any element", positioned before the final CTA.
 * 
 * Path: src/components/sections/select-elements.tsx
 */

const SelectElements = () => {
  return (
    <section 
      className="relative w-full overflow-hidden" 
      aria-label="Built-in browser feature"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 md:py-[150px]">
        <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-12 lg:gap-24">
          
          {/* Text Content Area */}
          <div className="flex flex-col items-start text-left order-2 md:order-1">
            <h2 className="text-3xl md:text-4xl font-medium text-foreground leading-tight mb-4 font-display">
              Built-in browser
            </h2>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-8 max-w-md">
              Select and grab any UI element on the web.
            </p>
            
            {/* Split Download/Action Button */}
            <div className="flex items-stretch h-[36px]">
              <button className="flex items-center justify-center gap-2 px-4 py-2 border border-border text-sm cursor-pointer bg-white text-black transition-all duration-200 hover:bg-white/90 rounded-l-[2px] border-r-0 font-sans font-medium whitespace-nowrap">
                Download for free
              </button>
              <button 
                aria-label="More options"
                className="px-2 py-2 rounded-r-[2px] border border-border bg-white text-black hover:bg-white/90 transition-all duration-200 flex items-center justify-center"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Media / Video Demonstration Area */}
          <div className="relative order-1 md:order-2">
            <div className="relative aspect-video w-full bg-[#1d1e1d] border border-white/10 overflow-hidden shadow-2xl">
              {/* Using the provided video asset for selection demo */}
              <video
                src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/hero-assets/hero-select-compressed.mp4"
                className="w-full h-full object-cover"
                autoPlay
                loop
                muted
                playsInline
              />
              
              {/* Subtle glass overlay for that depth look if needed */}
              <div className="absolute inset-0 pointer-events-none border border-white/5" />
            </div>
            
            {/* Background Glow Effect */}
            <div 
              className="absolute -inset-4 bg-primary/5 blur-3xl -z-10 rounded-full opacity-50"
              style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)' }}
            />
          </div>

        </div>
      </div>
      
      {/* Visual Separator if needed (matches the huge vertical spacing of the high level design) */}
      <div className="w-full h-[1px] bg-white/5 mx-auto max-w-5xl" />
    </section>
  );
};

export default SelectElements;