import React from 'react';
import { ChevronDown } from 'lucide-react';

/**
 * ChatToBuildSection Component
 * 
 * Clones the "Chat to build" feature section with a descriptive text block on the left
 * and a large video preview container on the right.
 */
const ChatToBuildSection = () => {
  const videoUrl = "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/hero-assets/hero-chatbuild-compressed.mp4";

  return (
    <section 
      className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-[150px] overflow-hidden" 
      aria-label="Chat to build feature"
    >
      <div className="flex flex-col md:flex-row items-center gap-12 md:gap-20">
        {/* Left Column: Content */}
        <div className="flex-1 w-full max-w-[400px] md:max-w-none text-left order-2 md:order-1">
          <h2 className="text-[32px] md:text-[36px] font-medium text-white leading-[1.2] mb-4 tracking-[-0.01em]">
            Chat to build
          </h2>
          <p className="text-[14px] md:text-[16px] text-white/60 mb-8 leading-relaxed">
            Ask Orchids to build, edit, and fix.
          </p>
          
          {/* Download Button Group */}
          <div className="flex items-stretch h-[36px]">
            <button 
              className="flex items-center justify-center px-4 bg-white text-black text-[14px] font-medium rounded-l-[2px] border-r border-black/10 hover:bg-white/90 transition-colors"
            >
              Download for free
            </button>
            <button 
              className="flex items-center justify-center px-2 bg-white text-black rounded-r-[2px] hover:bg-white/90 transition-colors border-l border-black/5"
              aria-label="More options"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Column: Video Preview */}
        <div className="flex-1 w-full order-1 md:order-2">
          <div className="relative aspect-[16/10] bg-[#1d1e1d] border border-white/10 rounded-[2px] overflow-hidden shadow-2xl">
            <video
              className="w-full h-full object-cover"
              src={videoUrl}
              autoPlay
              muted
              loop
              playsInline
              poster="/placeholder-video-poster.jpg" // Fallback if video fails
            />
            {/* Subtle overlay to match site aesthetic */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/20 to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChatToBuildSection;