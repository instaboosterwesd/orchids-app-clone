import React, { useState, useRef } from "react";
import {
  ChevronDown,
  AppWindow,
  Gamepad2,
  Wrench,
  Globe,
  PanelsTopLeft,
  Sparkles,
  Atom,
  Paperclip,
  ArrowUp,
  X,
  Briefcase,
} from "lucide-react";

const APP_TYPES = [
  {
    label: "apps",
    color: "bg-blue-500",
    video: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/hero-assets/hero-appdemo.mp4",
    icon: AppWindow,
  },
  {
    label: "games",
    color: "bg-purple-500",
    video: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/hero-assets/hero-gamedemo.mp4",
    icon: Gamepad2,
  },
  {
    label: "tools",
    color: "bg-orange-500",
    video: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/hero-assets/hero-tooldemo.mp4",
    icon: Wrench,
  },
  {
    label: "websites",
    color: "bg-green-500",
    video: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/hero-assets/hero-website.mp4",
    icon: Globe,
  },
  {
    label: "UI",
    color: "bg-pink-500",
    video: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/hero-assets/hero-uidemo.mp4",
    icon: PanelsTopLeft,
  },
  {
    label: "anything",
    color: "bg-yellow-400",
    textColor: "text-black",
    icon: Sparkles,
  },
];

const TagWithVideo = ({ tag }: { tag: (typeof APP_TYPES)[0] }) => {
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const Icon = tag.icon;

  return (
    <span className="relative inline-block group">
      {tag.video && isHovered && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-64 aspect-video bg-card border border-white/10 rounded-sm overflow-hidden shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-200">
          <video
            ref={videoRef}
            src={tag.video}
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <span
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`inline-flex items-center gap-0.5 ${tag.color} ${
          tag.textColor || "text-white"
        } px-1 md:px-1.5 py-0.5 rounded-[3px] leading-tight cursor-pointer transition-all duration-200 hover:scale-105 text-[9px] sm:text-[10px] md:text-xs lg:text-sm font-medium`}
      >
        {tag.label}
        <Icon className="w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 lg:w-3.5 lg:h-3.5" />
      </span>
    </span>
  );
};

export default function HeroSection() {
  const [chatValue, setChatValue] = useState("");

  return (
    <section className="relative md:min-h-screen md:pb-0 pb-8 overflow-hidden bg-background" aria-label="Hero">
      {/* Background pattern managed by globals.css body/canvas overlay */}
      
      <div className="flex flex-col items-center justify-center relative z-10 min-h-[calc(100vh-68px)] pt-12 sm:pt-16 md:pt-20">
        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-0 items-center">
          
          <div className="flex flex-col w-full items-center">
            <div className="flex flex-col gap-1 sm:gap-2 items-center">
              
              {/* Primary Download Button */}
              <div className="flex justify-center mb-6 sm:mb-8 md:mb-10">
                <div className="flex items-stretch shadow-lg">
                  <button className="flex items-center justify-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2 border border-white/10 text-xs sm:text-sm cursor-pointer bg-white text-black transition-all duration-200 hover:bg-white/90 font-medium h-8 sm:h-10 md:h-11 rounded-l-[2px] border-r-0">
                    <span>Download for Linux</span>
                  </button>
                  <button 
                    aria-label="More download options" 
                    className="px-2 sm:px-3 py-2 rounded-r-[2px] border border-white/10 bg-white text-black hover:bg-white/90 transition-all duration-200 flex items-center justify-center h-8 sm:h-10 md:h-11 border-l-0"
                  >
                    <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                </div>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[5rem] font-semibold text-white tracking-tight text-center leading-[1.1]">
                The AI App Builder
              </h1>

              <div className="w-full flex justify-center mt-3 sm:mt-4 md:mt-5">
                <p className="text-center text-[10px] sm:text-xs md:text-sm lg:text-[1rem] text-white/80 leading-relaxed tracking-tight flex flex-wrap justify-center items-center gap-x-1.5 md:gap-x-2">
                  <span className="hidden md:inline">The best way to build </span>
                  <span className="md:hidden">Build </span>
                  {APP_TYPES.map((tag, idx) => (
                    <React.Fragment key={tag.label}>
                      <TagWithVideo tag={tag} />
                      {idx < APP_TYPES.length - 1 && <span className="opacity-40">,</span>}
                    </React.Fragment>
                  ))}
                  <span className="ml-1 opacity-80">with AI</span>
                </p>
              </div>
            </div>

            {/* Chat Interface Container */}
            <div className="w-full max-w-[630px] pt-10 sm:pt-12 md:pt-14 flex justify-center mx-auto flex-col items-center">
              <div className="relative w-full px-2 md:px-0">
                
                {/* Model Update Badge */}
                <div className="flex items-center justify-center mb-4">
                  <button className="group flex items-center gap-2 px-3.5 py-1.5 text-[11px] sm:text-xs rounded-full transition-all duration-200 hover:scale-[1.02] cursor-pointer bg-surface border border-white/5 hover:border-white/20">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M7 0L8.8 5.2H14L9.8 8.4L11.4 13.6L7 10.4L2.6 13.6L4.2 8.4L0 5.2H5.2L7 0Z" fill="#ff6b6b" />
                    </svg>
                    <span className="text-white/60">
                      Try <span className="font-semibold text-white">Claude Opus 4.6</span> — Anthropic's newest model
                    </span>
                    <X className="w-3 h-3 ml-1 opacity-40 group-hover:opacity-100 transition-opacity" />
                  </button>
                </div>

                {/* Main Chat Box */}
                <div className="bg-surface shadow-[0_32px_64px_-16px_rgba(0,0,0,0.8)] p-3 sm:p-4 relative flex flex-col border border-white/5 rounded-[2px] transition-all duration-200">
                  <textarea
                    id="home-chat-input"
                    placeholder="Ask Orchids to build anything..."
                    value={chatValue}
                    onChange={(e) => setChatValue(e.target.value)}
                    className="w-full min-h-[60px] max-h-[200px] resize-none bg-transparent border-none outline-none text-sm md:text-base text-white placeholder:text-muted-foreground overflow-y-auto leading-relaxed"
                  />
                  
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-2">
                      <button className="flex items-center gap-1.5 px-2.5 py-1 h-7 text-xs text-muted-foreground hover:text-white border border-white/10 hover:bg-white/5 rounded-sm transition-all duration-200 cursor-pointer">
                        <Atom className="w-3.5 h-3.5 text-white/80" />
                        <span className="font-medium">Auto</span>
                        <ChevronDown className="w-3 h-3" />
                      </button>
                      <button className="flex items-center gap-1.5 px-2.5 py-1 h-7 text-xs text-muted-foreground hover:text-white border border-white/10 hover:bg-white/5 rounded-sm transition-all duration-200 cursor-pointer">
                        <Briefcase className="w-3.5 h-3.5" />
                        <span className="font-medium">Tools</span>
                        <ChevronDown className="w-3 h-3" />
                      </button>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button 
                        aria-label="Attach files" 
                        className="text-muted-foreground cursor-pointer transition-all duration-200 w-7 h-7 flex items-center justify-center rounded-sm border border-white/10 hover:text-white hover:bg-white/5"
                      >
                        <Paperclip className="w-4 h-4" />
                      </button>
                      <button 
                        disabled={!chatValue}
                        className={`transition-all duration-200 w-7 h-7 flex items-center justify-center rounded-sm border border-white/10 ${
                          chatValue ? "bg-white text-black opacity-100 cursor-pointer" : "opacity-40 cursor-not-allowed bg-background text-white/50"
                        }`}
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}