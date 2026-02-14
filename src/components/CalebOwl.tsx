'use client';

interface CalebOwlProps {
  isTyping?: boolean;
  mood?: 'focused' | 'happy' | 'sleepy' | 'alert';
}

export default function CalebOwl({ isTyping = false, mood = 'focused' }: CalebOwlProps) {
  const moodColors = {
    focused: 'from-cyan-400 to-blue-500',
    happy: 'from-green-400 to-emerald-500',
    sleepy: 'from-purple-400 to-indigo-500',
    alert: 'from-yellow-400 to-orange-500',
  };

  return (
    <div className="relative">
      {/* Glow Effect */}
      <div className={`absolute inset-0 bg-gradient-to-b ${moodColors[mood]} opacity-20 blur-2xl rounded-full`} />
      
      <div 
        className={`relative z-10 ${isTyping ? 'animate-bounce-subtle' : ''}`}
      >
        {/* Pixel Art Owl SVG */}
        <svg 
          width="120" 
          height="120" 
          viewBox="0 0 32 32" 
          className="animate-float-gentle"
          style={{ imageRendering: 'pixelated' }}
        >
          {/* Owl Body */}
          <rect x="8" y="10" width="16" height="18" fill="#4a5568" />
          <rect x="6" y="12" width="2" height="14" fill="#2d3748" />
          <rect x="24" y="12" width="2" height="14" fill="#2d3748" />
          
          {/* Belly */}
          <rect x="10" y="16" width="12" height="10" fill="#718096" />
          
          {/* Head */}
          <rect x="6" y="4" width="20" height="10" fill="#4a5568" />
          
          {/* Ear Tufts */}
          <rect x="6" y="2" width="4" height="4" fill="#2d3748" />
          <rect x="22" y="2" width="4" height="4" fill="#2d3748" />
          
          {/* Eyes Container */}
          <rect x="8" y="6" width="8" height="6" fill="#1a202c" />
          <rect x="16" y="6" width="8" height="6" fill="#1a202c" />
          
          {/* Eyes (with blinking animation) */}
          <g className="animate-owl-blink">
            <rect x="10" y="7" width="4" height="4" fill={isTyping ? "#00ffc8" : "#ffd700"} />
            <rect x="18" y="7" width="4" height="4" fill={isTyping ? "#00ffc8" : "#ffd700"} />
            {/* Pupils */}
            <rect x="12" y="8" width="1" height="2" fill="#000" />
            <rect x="19" y="8" width="1" height="2" fill="#000" />
          </g>
          
          {/* Beak */}
          <rect x="14" y="12" width="4" height="2" fill="#ed8936" />
          <rect x="15" y="14" width="2" height="1" fill="#dd6b20" />
          
          {/* Wings */}
          <rect x="4" y="14" width="3" height="8" fill="#2d3748" />
          <rect x="25" y="14" width="3" height="8" fill="#2d3748" />
          
          {/* Feet */}
          <rect x="10" y="28" width="3" height="2" fill="#ed8936" />
          <rect x="19" y="28" width="3" height="2" fill="#ed8936" />
          
          {/* Glasses (Chief of Staff style) */}
          <rect x="7" y="5" width="10" height="1" fill="#00ffc8" opacity="0.5" />
          <rect x="17" y="5" width="8" height="1" fill="#00ffc8" opacity="0.5" />
          
          {/* Typing Indicator */}
          {isTyping && (
            <>
              <rect x="4" y="20" width="2" height="2" fill="#00ffc8" className="animate-pulse-fast" />
              <rect x="2" y="18" width="2" height="2" fill="#00ffc8" opacity="0.6" className="animate-pulse-fast-delayed" />
            </>
          )}
        </svg>
        
        {/* Chief Badge */}
        <div className="absolute -bottom-1 -right-1 bg-gradient-to-br from-yellow-400 to-orange-500 text-black text-xs px-2 py-0.5 font-pixel text-[8px] border-2 border-yellow-600">
          CHIEF
        </div>
      </div>
      
      {/* Status Bubble */}
      {isTyping && (
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 border-2 border-cyan-400 px-3 py-1 whitespace-nowrap animate-fade-in">
          <div className="flex items-center gap-2">
            <span className="text-cyan-400 font-terminal text-sm">Working</span>
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-gray-900 border-r-2 border-b-2 border-cyan-400" />
        </div>
      )}
    </div>
  );
}
