import React from 'react';
import { ChevronDown } from 'lucide-react';

const ScreenVoiceSection = () => {
  return (
    <section 
      className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 md:py-[150px]"
      aria-label="Multimodal capabilities"
    >
      <div className="flex flex-col md:flex-row items-center gap-12 md:gap-16">
        {/* Left Side: Video Demonstration */}
        <div className="w-full md:w-1/2 flex justify-center">
          <div className="relative w-full aspect-video md:aspect-[4/3] bg-[#1d1e1d] border border-white/10 overflow-hidden">
            {/* Using the available hero-record-compressed video as a stand-in or if it's the specific content */}
            <video 
              src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/hero-assets/hero-record-compressed.mp4"
              className="w-full h-full object-cover"
              autoPlay
              muted
              loop
              playsInline
            />
          </div>
        </div>

        {/* Right Side: Text Content */}
        <div className="w-full md:w-1/2 flex flex-col items-start text-left">
          <h2 className="text-3xl md:text-4xl font-medium text-foreground leading-tight mb-4 max-w-lg">
            Orchids can see your screen and hear your voice
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base mb-8 max-w-md leading-relaxed">
            Works just like a human developer.
          </p>
          
          <div className="flex items-stretch group">
            <button className="flex items-center justify-center gap-2 px-4 py-2 border border-muted-foreground/20 text-sm cursor-pointer bg-foreground text-background transition-all duration-200 hover:bg-foreground/90 rounded-l-[2px] border-r-0 h-[36px] font-medium">
              <span>Download for free</span>
            </button>
            <button 
              aria-label="More download options"
              className="px-2 py-2 rounded-r-[2px] border border-muted-foreground/20 bg-foreground text-background hover:bg-foreground/90 transition-all duration-200 flex items-center justify-center h-[36px]"
            >
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ScreenVoiceSection;