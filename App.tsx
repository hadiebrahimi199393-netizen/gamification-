import React, { useState, useCallback, useMemo } from 'react';
import { ComponentType, GameComponent, SimulationState, SimulationMetrics } from './types';
import { COMPONENT_DEFINITIONS, LEVEL_FENWAY } from './constants';
import Toolbox from './components/Toolbox';
import Canvas from './components/Canvas';
import ControlPanel from './components/ControlPanel';
import FeedbackModal from './components/FeedbackModal';
import ConceptCard from './components/ConceptCard';

// Main App Controller
const App: React.FC = () => {
  const [components, setComponents] = useState<GameComponent[]>([]);
  const [simState, setSimState] = useState<SimulationState>(SimulationState.IDLE);
  const [metrics, setMetrics] = useState<SimulationMetrics>({
    signalStrength: -110,
    snr: 5,
    latency: 45,
    powerConsumption: 0,
    coveragePercent: 0,
  });
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [isConceptOpen, setIsConceptOpen] = useState(false);

  const level = LEVEL_FENWAY;

  // Calculated values
  const spentBudget = useMemo(() => {
    return components.reduce((total, comp) => total + COMPONENT_DEFINITIONS[comp.type].cost, 0);
  }, [components]);

  const handleDropComponent = useCallback((type: ComponentType, x: number, y: number) => {
    if (simState !== SimulationState.IDLE) return;
    
    const newComp: GameComponent = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      x,
      y,
      rotation: 0,
    };
    setComponents(prev => [...prev, newComp]);
  }, [simState]);

  const handleRemoveComponent = useCallback((id: string) => {
    if (simState !== SimulationState.IDLE) return;
    setComponents(prev => prev.filter(c => c.id !== id));
  }, [simState]);

  const handleRunSimulation = () => {
    setSimState(SimulationState.RUNNING);

    // Mock Simulation Logic for Prototype
    setTimeout(() => {
      // Count components
      const bsCount = components.filter(c => c.type === ComponentType.BASE_STATION_28GHZ).length;
      const risCount = components.filter(c => c.type === ComponentType.RIS_PANEL).length;
      const arrayCount = components.filter(c => c.type === ComponentType.PHASED_ARRAY).length;

      let coverage = 0;
      let signal = -110;
      
      // Basic Scoring Logic
      if (bsCount === 0) {
         coverage = 0;
         signal = -120;
      } else if (bsCount === 1) {
         coverage = 45; // Blocked by bleachers
         signal = -95;
      } else if (bsCount >= 2 && risCount === 0) {
         coverage = 75; // Better, but still shadowing
         signal = -85;
      } else if (bsCount >= 2 && risCount >= 1) {
         coverage = 98; // RIS solves the shadow!
         signal = -65;
      }

      const finalMetrics: SimulationMetrics = {
        signalStrength: signal,
        snr: signal + 105, // Mock SNR calculation
        latency: bsCount > 0 ? 8 : 100,
        powerConsumption: bsCount * 20,
        coveragePercent: coverage,
      };

      setMetrics(finalMetrics);

      // Check Objectives
      const success = coverage >= 95;
      setSimState(success ? SimulationState.COMPLETE_SUCCESS : SimulationState.COMPLETE_FAILURE);

      if (!success) {
        setTimeout(() => setIsFeedbackOpen(true), 1000); // Open Socratic dialogue
      }

    }, 2000); // 2 second sim duration
  };

  const handleReset = () => {
    setSimState(SimulationState.IDLE);
    setMetrics({
        signalStrength: -110,
        snr: 5,
        latency: 45,
        powerConsumption: 0,
        coveragePercent: 0,
    });
  };

  // Derived objectives state for UI
  const currentObjectives = useMemo(() => {
    return level.objectives.map(obj => ({
      ...obj,
      currentValue: obj.id === 'obj_coverage' ? metrics.coveragePercent : metrics.latency,
      isMet: obj.id === 'obj_coverage' 
        ? metrics.coveragePercent >= obj.targetValue 
        : metrics.latency <= obj.targetValue && metrics.latency > 0
    }));
  }, [metrics, level.objectives]);

  const handleDragStart = (type: ComponentType) => {
      // Data transfer logic is handled in onDragStart within Toolbox usually via e.dataTransfer
      // We need to ensure the type is passed. 
      // Since React event handlers wrap native ones, we'll attach a handler to the window for the dragstart 
      // inside the component, or pass a handler that sets a global/ref. 
      // For this simplified version, we rely on the HTML5 drag events in Toolbox.tsx setting dataTransfer.
      // See Toolbox.tsx for implementation.
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-tech-900 text-slate-200 font-sans">
      {/* Left Sidebar: Toolbox */}
      <Toolbox 
        availableComponents={level.availableComponents}
        budget={level.budget}
        spent={spentBudget}
        onDragStart={(type) => {
           // This is a bit of a hack for React drag/drop data transfer in this structure
           // In a real app, I'd use a dnd context, but for this:
           // We assume the event originates in Toolbox and sets dataTransfer there.
           // This callback is just for state tracking if needed.
           // The actual data setting happens in the element's onDragStart
           const event = window.event as DragEvent;
           if(event && event.dataTransfer) {
               event.dataTransfer.setData('componentType', type);
           }
        }}
      />

      {/* Center: Canvas */}
      <Canvas 
        components={components}
        simState={simState}
        onDropComponent={handleDropComponent}
        onRemoveComponent={handleRemoveComponent}
      />

      {/* Right Sidebar: Controls */}
      <ControlPanel 
        simState={simState}
        objectives={currentObjectives}
        metrics={metrics}
        onRunSimulation={handleRunSimulation}
        onReset={handleReset}
      />

      {/* Overlays */}
      <FeedbackModal 
        isOpen={isFeedbackOpen} 
        onClose={() => setIsFeedbackOpen(false)}
        onConceptCardOpen={() => {
            setIsFeedbackOpen(false);
            setIsConceptOpen(true);
        }}
      />

      <ConceptCard 
        isOpen={isConceptOpen}
        onClose={() => setIsConceptOpen(false)}
      />
    </div>
  );
};

export default App;
