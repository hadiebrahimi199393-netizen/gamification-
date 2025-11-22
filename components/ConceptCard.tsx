import React from 'react';
import { X } from 'lucide-react';

interface ConceptCardProps {
  isOpen: boolean;
  onClose: () => void;
}

const ConceptCard: React.FC<ConceptCardProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/90 z-[60] flex items-center justify-center p-4">
      <div className="bg-tech-800 w-full max-w-4xl h-[80vh] rounded-xl border border-tech-600 flex flex-col shadow-2xl relative">
        
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white z-10">
          <X size={24} />
        </button>

        <div className="flex flex-col md:flex-row h-full">
            {/* Content Side */}
            <div className="flex-1 p-8 overflow-y-auto">
                <div className="mb-6">
                    <div className="text-tech-accent font-bold uppercase tracking-widest text-xs mb-2">Intermediate • Level 2</div>
                    <h1 className="text-3xl font-bold text-white mb-2">Reconfigurable Intelligent Surfaces (RIS)</h1>
                    <p className="text-xl text-slate-300 font-light">Programmable Wireless Environments</p>
                </div>

                <div className="space-y-8 text-slate-300">
                    <section>
                        <h3 className="text-white font-bold text-lg mb-2 border-b border-tech-700 pb-1">The Core Idea</h3>
                        <p>A Reconfigurable Intelligent Surface is a flat panel covered with electronically controllable elements that can reflect, absorb, or redirect radio waves on demand—like a "smart mirror" for wireless signals.</p>
                    </section>

                    <section>
                        <h3 className="text-white font-bold text-lg mb-2 border-b border-tech-700 pb-1">Why It Matters</h3>
                        <p>Traditional wireless networks rely on base stations blasting signals in all directions. RIS technology allows us to "paint" signals exactly where needed by bouncing them around obstacles. This is crucial for 6G networks in dense cities where skyscrapers block mmWave signals.</p>
                    </section>
                    
                    <section className="bg-tech-900 p-4 rounded-lg border border-tech-700">
                        <h3 className="text-white font-bold text-lg mb-2">The Physics (Simplified)</h3>
                        <p className="mb-4">Reflected beam angle (θr) depends on the phase gradient across the RIS:</p>
                        <div className="font-mono bg-black p-3 rounded text-center text-tech-accent">
                            θr = arcsin(λ × Δφ / 2πd)
                        </div>
                        <p className="mt-4 text-sm text-slate-400">
                            Where <strong className="text-white">λ</strong> is wavelength and <strong className="text-white">Δφ</strong> is the phase difference. By programming the phase of each element, we can make the RIS "focus" reflected waves like a lens focuses light.
                        </p>
                    </section>
                </div>
            </div>

            {/* Visual Side */}
            <div className="w-full md:w-1/3 bg-tech-900 border-l border-tech-700 p-8 flex flex-col items-center justify-center">
                <div className="relative w-48 h-48 mb-8">
                    {/* Simple CSS diagram of bouncing signal */}
                    <div className="absolute top-0 left-0 w-full h-full border-2 border-slate-700 rounded-lg flex items-center justify-center">
                         {/* Building */}
                         <div className="w-16 h-32 bg-slate-600 absolute right-8 top-8"></div>
                         {/* RIS */}
                         <div className="w-1 h-12 bg-tech-success absolute right-24 top-8 transform -rotate-45 shadow-[0_0_15px_rgba(16,185,129,0.5)]"></div>
                         {/* Path */}
                         <svg className="absolute inset-0 w-full h-full pointer-events-none">
                             <path d="M 20 100 L 110 50 L 180 80" fill="none" stroke="#0ea5e9" strokeWidth="2" strokeDasharray="4" className="animate-pulse" />
                         </svg>
                    </div>
                </div>
                <p className="text-center text-sm text-slate-400 italic">
                    "Instead of blasting through the wall, bounce around it."
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ConceptCard;
