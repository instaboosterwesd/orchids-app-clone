import React from 'react';
import Image from 'next/image';
import { ChevronDown } from 'lucide-react';

/**
 * BuildFullStackApps Component
 * 
 * Clones the "Build full-stack apps" section showcasing Supabase and Stripe integration.
 * Features a split layout with text/CTA on the left and a high-fidelity app UI screenshot on the right.
 */
export default function BuildFullStackApps() {
  return (
    <section 
      aria-label="Full-stack capabilities"
      className="w-full py-12 sm:py-20 md:py-[150px] overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          
          {/* Content Column */}
          <div className="flex-1 w-full lg:max-w-[440px]">
            <h2 className="text-3xl md:text-4xl font-medium text-foreground leading-tight mb-4">
              Build full-stack apps
            </h2>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-8 max-w-[400px]">
              Orchids natively supports Supabase and Stripe for auth, database, and payments.
            </p>
            
            {/* Download/CTA Button Group */}
            <div className="flex items-stretch w-fit">
              <button 
                className="flex items-center justify-center gap-2 px-4 py-2 border border-border text-sm cursor-pointer bg-foreground text-background transition-all duration-200 hover:bg-foreground/90 h-[36px] whitespace-nowrap focus:outline-none rounded-l-[2px] border-r-0 font-medium"
              >
                <span>Download for free</span>
              </button>
              <button 
                aria-label="More options"
                className="px-2 py-2 border border-border bg-foreground text-background hover:bg-foreground/90 transition-all duration-200 flex items-center justify-center h-[36px] focus:outline-none rounded-r-[2px]"
              >
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Media Column - High Fidelity Screenshot */}
          <div className="flex-[1.5] w-full relative">
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[2px] border border-white/10 bg-[#1d1e1d] shadow-2xl">
              <Image
                src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/73d57872-771a-4961-af92-b0e3d7a9c0d3-orchids-app/assets/images/images_1.png"
                alt="Orchids interface showing Supabase and Stripe integration settings"
                fill
                priority
                className="object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 800px"
              />
              
              {/* Subtle glass overlay to mimic the technical aesthetic if needed, 
                  but the image provided is already high-fidelity */}
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-black/20 to-transparent mix-blend-overlay" />
            </div>
            
            {/* Background Glow Effect - consistent with "Premium Dark Tech" vibe */}
            <div className="absolute -z-10 -top-12 -right-12 w-64 h-64 bg-blue-500/10 blur-[100px] rounded-full" />
            <div className="absolute -z-10 -bottom-12 -left-12 w-64 h-64 bg-purple-500/10 blur-[100px] rounded-full" />
          </div>
          
        </div>
      </div>
    </section>
  );
}