import React from 'react';
import { ComponentType } from '../types';
import { COMPONENT_DEFINITIONS } from '../constants';
import { Info, Lock } from 'lucide-react';

interface ToolboxProps {
  availableComponents: ComponentType[];
  budget: number;
  spent: number;
  onDragStart: (type: ComponentType) => void;
}

const Toolbox: React.FC<ToolboxProps> = ({ availableComponents, budget, spent, onDragStart }) => {
  return (
    <div className="w-64 bg-tech-800 border-r border-tech-700 flex flex-col h-full">
      <div className="p-4 border-b border-tech-700 bg-tech-900">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <span className="text-tech-accent">🛠️</span> Toolbox
        </h2>
        <div className="mt-2 bg-tech-800 rounded-md p-2 border border-tech-700">
          <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Research Points</div>
          <div className="flex justify-between items-end">
            <span className="text-xl font-mono text-white">{budget - spent}</span>
            <span className="text-xs text-slate-500">/ {budget} RP</span>
          </div>
          <div className="w-full bg-tech-700 h-1.5 mt-1 rounded-full overflow-hidden">
            <div 
              className={`h-full ${spent > budget ? 'bg-tech-danger' : 'bg-tech-accent'}`} 
              style={{ width: `${Math.min((spent / budget) * 100, 100)}%` }}
            />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div>
          <h3 className="text-xs font-semibold text-slate-400 uppercase mb-2 ml-1">RF Systems</h3>
          <div className="space-y-2">
            {availableComponents.map((type) => {
              const def = COMPONENT_DEFINITIONS[type];
              const canAfford = (budget - spent) >= def.cost;

              return (
                <div
                  key={type}
                  draggable={canAfford}
                  onDragStart={() => canAfford && onDragStart(type)}
                  className={`
                    relative group p-3 rounded-lg border transition-all duration-200
                    ${canAfford 
                      ? 'bg-tech-700 border-tech-600 hover:border-tech-accent hover:shadow-[0_0_10px_rgba(14,165,233,0.3)] cursor-grab active:cursor-grabbing' 
                      : 'bg-tech-800 border-tech-800 opacity-50 cursor-not-allowed'}
                  `}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-tech-900 flex items-center justify-center text-lg border border-tech-700">
                        {def.icon}
                      </div>
                      <div>
                        <div className="font-bold text-sm text-slate-100">{def.name}</div>
                        <div className="text-xs text-tech-accent font-mono">{def.cost} RP</div>
                      </div>
                    </div>
                    <Info className="w-4 h-4 text-slate-500 hover:text-slate-300 cursor-help" />
                  </div>
                  
                  {/* Tooltip */}
                  <div className="absolute left-full top-0 ml-2 w-48 p-3 bg-tech-900 border border-tech-600 rounded-lg shadow-xl z-50 hidden group-hover:block pointer-events-none">
                    <h4 className="font-bold text-white mb-1">{def.name}</h4>
                    <p className="text-xs text-slate-300 leading-relaxed">{def.description}</p>
                  </div>
                </div>
              );
            })}

            {/* Locked Tier Example */}
            <div className="relative p-3 rounded-lg border border-tech-800 bg-tech-900 opacity-60">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-tech-800 flex items-center justify-center text-lg">
                    ❄️
                  </div>
                  <div>
                    <div className="font-bold text-sm text-slate-400">Cryo-CMOS</div>
                    <div className="text-xs text-slate-600 font-mono">Locked (Lvl 3)</div>
                  </div>
                </div>
                <Lock className="w-4 h-4 text-slate-600" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Toolbox;
