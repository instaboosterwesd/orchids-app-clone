import React from 'react';
import Image from 'next/image';
import { ChevronRight } from 'lucide-react';

interface BenchmarkRowProps {
  label: string;
  value: number | string;
  percentage: number;
  isPrimary?: boolean;
}

const BenchmarkRow: React.FC<BenchmarkRowProps> = ({ 
  label, 
  value, 
  percentage, 
  isPrimary = false 
}) => {
  return (
    <div className="grid grid-cols-[80px_1fr] sm:grid-cols-[100px_1fr] md:grid-cols-[110px_1fr] gap-2 sm:gap-3 md:gap-6 items-center text-xs">
      <div className={`font-medium text-[10px] sm:text-xs md:text-sm truncate ${isPrimary ? 'text-foreground' : 'text-muted-foreground'}`}>
        {label}
      </div>
      <div className="h-5 flex items-center gap-1.5 sm:gap-3">
        <div className="flex-1 h-5 flex items-center">
          <div 
            className={`h-3 md:h-3.5 rounded-[1px] transition-all duration-1000 ease-out ${isPrimary ? 'bg-white' : 'bg-white/20'}`}
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        <span className={`text-[9px] sm:text-[10px] md:text-xs font-mono w-9 text-right text-foreground ${isPrimary ? 'font-semibold' : 'opacity-60'}`}>
          {value}{typeof value === 'number' && label === 'Orchids' ? '%' : (typeof value === 'number' ? '%' : '')}
        </span>
      </div>
    </div>
  );
};

const BenchmarkCard: React.FC<{
  title: string;
  link: string;
  data: BenchmarkRowProps[];
  footerLabels: string[];
  footerUnit: string;
}> = ({ title, link, data, footerLabels, footerUnit }) => {
  return (
    <article className="flex flex-col h-full bg-[#1d1e1d] border border-white/10 rounded-[2px] overflow-hidden">
      <header className="flex flex-col gap-2 p-4 sm:p-6 pb-3">
        <div className="flex items-center justify-between gap-3 sm:gap-4">
          <h3 className="text-lg sm:text-xl md:text-2xl font-medium text-foreground leading-tight">
            {title}
          </h3>
          <a 
            href={link} 
            className="inline-flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 border border-white/10 text-[10px] sm:text-xs cursor-pointer bg-white text-black transition-all duration-200 hover:bg-white/90 rounded-[2px] shrink-0 font-medium"
          >
            <span>View benchmark</span>
            <ChevronRight className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
          </a>
        </div>
      </header>
      
      <div className="w-full px-4 sm:px-6 pb-4 pt-2">
        <div className="w-full bg-[#111111] p-3 sm:p-4 md:p-6 rounded-[2px]">
          <div className="flex flex-col gap-2">
            {data.map((row, idx) => (
              <React.Fragment key={row.label}>
                <BenchmarkRow {...row} />
                {idx < data.length - 1 && (
                  <div className="border-b border-white/5 w-full"></div>
                )}
              </React.Fragment>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-white/5">
            <div className="grid grid-cols-[80px_1fr] sm:grid-cols-[100px_1fr] md:grid-cols-[110px_1fr] gap-2 sm:gap-3 md:gap-6 items-center">
              <div className="text-[9px] sm:text-[10px] md:text-xs text-muted-foreground font-mono uppercase tracking-wider">
                {footerUnit}
              </div>
              <div className="flex justify-between text-[9px] sm:text-[10px] text-muted-foreground font-mono">
                {footerLabels.map((label) => (
                  <span key={label}>{label}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default function Benchmarks() {
  const appBenchData = [
    { label: 'Orchids', value: 76, percentage: 76, isPrimary: true },
    { label: 'Claude Code', value: 68, percentage: 68 },
    { label: 'v0', value: 64, percentage: 64 },
    { label: 'Bolt', value: 54, percentage: 54 },
    { label: 'Google AI Studio', value: 50, percentage: 50 },
    { label: 'Codex CLI', value: 38, percentage: 38 },
    { label: 'Replit', value: 34, percentage: 34 },
    { label: 'Cursor', value: 27, percentage: 27 },
    { label: 'Lovable', value: 25, percentage: 25 },
    { label: 'Gemini CLI', value: 0, percentage: 2 },
  ];

  const uiBenchData = [
    { label: 'Orchids', value: 30.08, percentage: 95, isPrimary: true },
    { label: 'Figma Make', value: 27.46, percentage: 86 },
    { label: 'Lovable', value: 27.14, percentage: 84 },
    { label: 'Anything', value: 25.46, percentage: 78 },
    { label: 'Bolt', value: 24.44, percentage: 74 },
    { label: 'Magic Patterns', value: 24.23, percentage: 73 },
    { label: 'Same.new', value: 23.57, percentage: 70 },
    { label: 'Base44', value: 23.47, percentage: 69 },
    { label: 'v0', value: 22.24, percentage: 64 },
    { label: 'Replit', value: 20.95, percentage: 58 },
  ];

  return (
    <section className="relative w-full" aria-label="Benchmarks">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 md:py-[150px]">
        {/* Product Hunt Badge */}
        <div className="flex justify-center mb-8">
          <a 
            href="https://www.producthunt.com/products/orchids" 
            aria-label="View Orchids on Product Hunt"
            className="transition-transform hover:scale-[1.02] duration-200"
          >
            <Image 
              src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/73d57872-771a-4961-af92-b0e3d7a9c0d3-orchids-app/assets/svgs/top-post-badge-2.svg"
              alt="Orchids - #1 Product of the Day | Product Hunt"
              width={200}
              height={43}
              className="w-[180px] sm:w-[200px] h-auto"
            />
          </a>
        </div>

        <h2 className="text-3xl md:text-4xl lg:text-[40px] font-medium text-white leading-tight mb-12 text-center tracking-tight">
          The best tool to build with AI
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8" role="list">
          <div role="listitem">
            <BenchmarkCard 
              title="#1 on App Bench"
              link="https://appbench.ai"
              data={appBenchData}
              footerUnit="Score"
              footerLabels={['0%', '20%', '40%', '60%', '80%']}
            />
          </div>
          <div role="listitem">
            <BenchmarkCard 
              title="#1 on UI Bench"
              link="https://appbench.ai" // Using placeholder or generic link if specific UI Bench link not provided
              data={uiBenchData}
              footerUnit="Score"
              footerLabels={['20', '24', '28', '32']}
            />
          </div>
        </div>
      </div>
    </section>
  );
}