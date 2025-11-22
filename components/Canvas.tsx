import React, { useRef, useState } from 'react';
import { GameComponent, ComponentType, SimulationState } from '../types';
import { COMPONENT_DEFINITIONS } from '../constants';
import { Trash2, RotateCw } from 'lucide-react';

interface CanvasProps {
  components: GameComponent[];
  simState: SimulationState;
  onDropComponent: (type: ComponentType, x: number, y: number) => void;
  onRemoveComponent: (id: string) => void;
}

const GRID_SIZE = 20;
const CELL_SIZE = 40; // px

const Canvas: React.FC<CanvasProps> = ({ components, simState, onDropComponent, onRemoveComponent }) => {
  const [dragOverPos, setDragOverPos] = useState<{ x: number, y: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = Math.floor((e.clientX - rect.left) / CELL_SIZE);
      const y = Math.floor((e.clientY - rect.top) / CELL_SIZE);
      setDragOverPos({ x, y });
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const type = e.dataTransfer.getData('componentType') as ComponentType;
    if (dragOverPos && type) {
      onDropComponent(type, dragOverPos.x, dragOverPos.y);
    }
    setDragOverPos(null);
  };

  const isSimulating = simState === SimulationState.RUNNING || simState === SimulationState.COMPLETE_SUCCESS || simState === SimulationState.COMPLETE_FAILURE;

  return (
    <div className="flex-1 bg-black relative overflow-hidden flex items-center justify-center">
      {/* Background Map & Grid Container */}
      <div 
        ref={containerRef}
        className="relative shadow-2xl border-2 border-tech-700 bg-tech-900"
        style={{ 
          width: GRID_SIZE * CELL_SIZE, 
          height: GRID_SIZE * CELL_SIZE,
          backgroundImage: `
            radial-gradient(circle, #1e293b 1px, transparent 1px),
            linear-gradient(to right, rgba(30, 41, 59, 0.5) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(30, 41, 59, 0.5) 1px, transparent 1px)
          `,
          backgroundSize: `${CELL_SIZE}px ${CELL_SIZE}px, ${CELL_SIZE}px ${CELL_SIZE}px, ${CELL_SIZE}px ${CELL_SIZE}px`
        }}
        onDragOver={handleDragOver}
        onDragLeave={() => setDragOverPos(null)}
        onDrop={handleDrop}
      >
        
        {/* Map Overlay (Simplified Fenway representation) */}
        <div className="absolute inset-0 pointer-events-none opacity-30">
           <svg width="100%" height="100%">
             {/* Stadium Outline */}
             <path d="M 200 200 L 600 200 L 500 600 L 200 500 Z" fill="none" stroke="#10b981" strokeWidth="2" />
             {/* Bleachers (Obstacle) */}
             <rect x="200" y="200" width="100" height="300" fill="#334155" stroke="#475569" />
             <text x="230" y="350" fill="#94a3b8" fontSize="14" transform="rotate(-90 230 350)">BLEACHERS (METAL)</text>
           </svg>
        </div>

        {/* Placement Ghost */}
        {dragOverPos && !isSimulating && (
          <div 
            className="absolute bg-tech-accent bg-opacity-20 border border-tech-accent z-10"
            style={{
              left: dragOverPos.x * CELL_SIZE,
              top: dragOverPos.y * CELL_SIZE,
              width: CELL_SIZE,
              height: CELL_SIZE,
            }}
          />
        )}

        {/* Components */}
        {components.map((comp) => {
            const def = COMPONENT_DEFINITIONS[comp.type];
            return (
                <div
                    key={comp.id}
                    className="absolute flex items-center justify-center group z-20"
                    style={{
                        left: comp.x * CELL_SIZE,
                        top: comp.y * CELL_SIZE,
                        width: CELL_SIZE,
                        height: CELL_SIZE,
                    }}
                >
                    {/* Component Icon */}
                    <div 
                        className="w-8 h-8 rounded-full shadow-lg flex items-center justify-center text-lg border-2 relative transition-transform"
                        style={{ 
                            backgroundColor: def.color,
                            borderColor: '#fff' 
                        }}
                    >
                        {def.icon}
                        
                        {/* Controls (Delete/Rotate) */}
                        {!isSimulating && (
                            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-tech-900 rounded border border-tech-700 flex gap-1 p-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-auto">
                                <button onClick={() => onRemoveComponent(comp.id)} className="p-1 hover:bg-red-900 rounded text-red-400">
                                    <Trash2 size={12} />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Simulation Waves */}
                    {isSimulating && comp.type === ComponentType.BASE_STATION_28GHZ && (
                         <>
                            <div className="absolute w-full h-full rounded-full border border-tech-accent opacity-50 animate-wave-expand" style={{ animationDelay: '0s' }}></div>
                            <div className="absolute w-full h-full rounded-full border border-tech-accent opacity-50 animate-wave-expand" style={{ animationDelay: '0.6s' }}></div>
                            <div className="absolute w-full h-full rounded-full border border-tech-accent opacity-50 animate-wave-expand" style={{ animationDelay: '1.2s' }}></div>
                         </>
                    )}
                     
                    {/* RIS Reflection Visualization */}
                    {isSimulating && comp.type === ComponentType.RIS_PANEL && (
                         <div className="absolute w-32 h-1 bg-gradient-to-r from-transparent via-tech-success to-transparent transform -rotate-45 origin-left animate-pulse"></div>
                    )}

                </div>
            );
        })}

        {/* Failure Zone Highlight (Only on failure) */}
        {simState === SimulationState.COMPLETE_FAILURE && (
            <div className="absolute top-[200px] left-[300px] w-[200px] h-[200px] bg-red-500 bg-opacity-10 border-2 border-red-500 border-dashed animate-pulse flex items-center justify-center">
                <span className="text-red-500 font-bold bg-black px-2">Dead Zone</span>
            </div>
        )}

      </div>
      
      <div className="absolute bottom-4 right-4 bg-tech-900 bg-opacity-80 p-2 rounded text-xs text-slate-400 border border-tech-700">
        Grid: {GRID_SIZE}x{GRID_SIZE} | Scale: 1m/cell
      </div>
    </div>
  );
};

export default Canvas;
