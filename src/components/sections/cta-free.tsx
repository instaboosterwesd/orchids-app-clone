import React from 'react';
import { ChevronDown } from 'lucide-react';

/**
 * Final CTA Section: "Try for free"
 * Centered layout with a large heading and the primary split download button.
 * Maintaining pixel-perfect accuracy with the technical aesthetic (2px radii, shared button styles).
 */
const CTAFree = () => {
  return (
    <section 
      className="relative w-full overflow-hidden bg-background py-32 md:py-[150px]"
      aria-label="Try Orchids for free"
    >
      {/* 
        The background textured finish is inherited from the global body style 
        via radial-gradient in globals.css, but we ensure it feels consistent.
      */}
      <div className="container mx-auto px-4 flex flex-col items-center justify-center relative z-10">
        <h2 className="text-4xl md:text-[3.5rem] font-semibold text-white mb-10 tracking-tight text-center">
          Try for free
        </h2>

        {/* 
          Split Button Component 
          Consistent with Hero and Nav button styling: 
          - Square corners (2px)
          - White background, Black text
          - Thin borders (1px) 
        */}
        <div className="flex items-stretch group">
          <button 
            className="flex items-center justify-center gap-2 px-6 py-2.5 bg-white text-black text-sm md:text-base font-medium rounded-l-[2px] border border-white/10 border-r-0 transition-all duration-200 hover:bg-white/90 active:scale-[0.98] outline-none"
          >
            Download for Linux
          </button>
          
          <div className="w-[1px] bg-black/10 self-stretch" aria-hidden="true" />
          
          <button 
            className="px-3 py-2.5 bg-white text-black rounded-r-[2px] border border-white/10 flex items-center justify-center transition-all duration-200 hover:bg-white/90 active:scale-[0.98] outline-none"
            aria-label="More download options"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 
        Subtle gradient overlay to transition into the footer 
        Replicating the depth seen in screenshots.
      */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent to-background/50 -z-10" />
    </section>
  );
};

export default CTAFree;