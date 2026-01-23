import React, { useMemo } from 'react';

const Rosco = ({ questions, currentIndex, letterStates, letterTimes }) => {
  const letters = useMemo(() => {
    return questions.map((q, index) => {
      const angle = (360 / 26) * index;
      const radius = 180; // Slightly smaller for better fit on standard screens
      // Correction: -90 degrees to start at top (12 o'clock) if needed, 
      // but standard Rosco starts at right (3 o'clock) or top.
      // The original code used sin for X and -cos for Y, which starts at top (0 degrees).
      const x = Math.sin((angle * Math.PI) / 180) * radius;
      const y = -Math.cos((angle * Math.PI) / 180) * radius;
      return { ...q, x, y, index };
    });
  }, [questions]);

  return (
    <div className="relative w-[320px] h-[320px] md:w-[500px] md:h-[500px] flex items-center justify-center mx-auto my-4 transition-all duration-500">
      {/* Center decoration */}
      <div className="absolute inset-0 rounded-full border-2 border-white/5 pointer-events-none animate-pulse"></div>
      <div className="absolute inset-[15%] rounded-full bg-slate-800/50 backdrop-blur-xl border border-white/10 shadow-inner flex items-center justify-center">
        <span className="text-4xl filter grayscale opacity-20">🎯</span>
      </div>

      {letters.map((q, index) => {
        const isActive = index === currentIndex;
        const state = letterStates[q.letter];
        const letterTime = letterTimes[q.letter];
        const isLowTime = letterTime <= 5;

        let bgColorClass = 'bg-gradient-to-br from-slate-700 to-slate-800 border-slate-600 text-gray-400 shadow-lg'; // Default

        if (state === 'correct') bgColorClass = 'bg-gradient-to-br from-green-400 to-green-600 border-green-400 text-white shadow-[0_0_20px_rgba(74,222,128,0.6)] scale-110';
        else if (state === 'incorrect') bgColorClass = 'bg-gradient-to-br from-red-500 to-red-700 border-red-400 text-white shadow-[0_0_20px_rgba(248,113,113,0.6)] scale-90 opacity-80';
        else if (state === 'pasapalabra') bgColorClass = 'bg-gradient-to-br from-blue-400 to-blue-600 border-blue-300 text-white shadow-[0_0_15px_rgba(96,165,250,0.5)]';
        else if (isActive) bgColorClass = 'bg-gradient-to-br from-yellow-300 to-yellow-500 border-yellow-200 text-yellow-900 scale-125 z-50 shadow-[0_0_30px_rgba(250,204,21,0.8)] ring-4 ring-yellow-400/30';

        // Responsive positioning calculation for smaller screen
        const angle = (360 / 26) * index;

        // We use CSS variables or classes, but here we can just compute coordinates for simple inline styles
        // Or better yet, reuse the math but with a CSS transform scale? 
        // No, let's keep the prop-based coords but apply a class that scales the whole wrapper? 
        // Actually, the previous 'letters' useMemo hardcoded the radius. Let's make that responsive via CSS variables or percentages.

        // Re-calculating positions based on percentage to be fully responsive would be best.
        // Let's use % based positioning from center. Center is 50% 50%.
        const angleRad = (angle - 90) * (Math.PI / 180); // -90 to start at top
        const xPercent = 50 + 45 * Math.cos(angleRad); // 45% radius for more spacing
        const yPercent = 50 + 45 * Math.sin(angleRad);

        const showTime = (!state && isActive) || state === 'pasapalabra';

        return (
          <div
            key={q.letter}
            className={`absolute flex flex-col items-center justify-center w-7 h-7 md:w-14 md:h-14 rounded-full border-2 font-black text-xs md:text-2xl transition-all duration-300 ease-out cursor-default select-none
                ${bgColorClass}
                ${isLowTime && !state && isActive ? 'animate-bounce-fast border-orange-500 text-orange-900 bg-orange-200' : ''}
            `}
            style={{
              left: `${xPercent}%`,
              top: `${yPercent}%`,
              transform: 'translate(-50%, -50%)', // Center the element on its point
            }}
          >
            <span className="drop-shadow-sm">{q.letter}</span>
            {showTime && (
              <span className={`leading-none absolute -bottom-3 md:-bottom-5 font-mono text-white/90 bg-slate-900/70 px-1.5 py-0.5 rounded-md backdrop-blur-sm shadow-sm
                  ${state === 'pasapalabra' ? 'text-[0.5rem] md:text-xs' : 'text-[0.6rem] md:text-sm font-bold animate-pulse'}
              `}>
                {letterTime}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Rosco;