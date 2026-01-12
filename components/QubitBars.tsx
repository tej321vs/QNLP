
import React from 'react';

interface Props {
  states: number[];
}

const QubitBars: React.FC<Props> = ({ states }) => {
  return (
    <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 backdrop-blur-xl">
      <h3 className="text-xs uppercase tracking-[0.2em] text-purple-400 mb-6 font-bold">Qubit Probability Distribution</h3>
      <div className="flex items-end justify-between h-32 gap-1">
        {states.map((val, i) => (
          <div key={i} className="flex-1 flex flex-col items-center group">
            <div 
              className="w-full bg-gradient-to-t from-purple-600 to-cyan-400 rounded-t-sm transition-all duration-1000 ease-out relative"
              style={{ height: `${Math.max(val * 100, 5)}%` }}
            >
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] mono text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    {val.toFixed(2)}
                </div>
            </div>
            <div className="mt-2 text-[9px] mono text-slate-500">Q{i}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QubitBars;
