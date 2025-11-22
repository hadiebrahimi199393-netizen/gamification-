import React from 'react';
import { SimulationState, LevelObjective, SimulationMetrics } from '../types';
import { Play, FastForward, RefreshCw, CheckCircle, XCircle } from 'lucide-react';

interface ControlPanelProps {
  simState: SimulationState;
  objectives: LevelObjective[];
  metrics: SimulationMetrics;
  onRunSimulation: () => void;
  onReset: () => void;
}

const MetricGauge: React.FC<{ label: string; value: string; unit: string; status: 'good' | 'bad' | 'neutral' }> = ({ label, value, unit, status }) => {
  const color = status === 'good' ? 'text-tech-success' : status === 'bad' ? 'text-tech-danger' : 'text-slate-200';
  return (
    <div className="bg-tech-800 p-3 rounded-lg border border-tech-700 flex flex-col items-center">
      <span className="text-xs text-slate-400 uppercase">{label}</span>
      <div className={`text-2xl font-mono font-bold ${color}`}>
        {value}<span className="text-sm ml-1 text-slate-500">{unit}</span>
      </div>
    </div>
  );
};

const ControlPanel: React.FC<ControlPanelProps> = ({ simState, objectives, metrics, onRunSimulation, onReset }) => {
  const isRunning = simState === SimulationState.RUNNING;
  const isComplete = simState === SimulationState.COMPLETE_SUCCESS || simState === SimulationState.COMPLETE_FAILURE;

  return (
    <div className="w-80 bg-tech-800 border-l border-tech-700 flex flex-col h-full">
      
      {/* Header */}
      <div className="p-4 border-b border-tech-700 bg-tech-900">
        <h2 className="text-lg font-bold text-white">Mission Control</h2>
        <p className="text-xs text-slate-400">Level 2-1: Fenway Park</p>
      </div>

      {/* Main Action Button */}
      <div className="p-6 flex justify-center">
        {!isRunning && !isComplete ? (
          <button
            onClick={onRunSimulation}
            className="w-full py-4 bg-gradient-to-r from-tech-accent to-tech-purple rounded-xl font-bold text-white shadow-lg hover:shadow-tech-accent/50 hover:scale-[1.02] transition-all flex items-center justify-center gap-2 text-lg group"
          >
            <Play className="fill-current group-hover:animate-pulse" />
            RUN SIMULATION
          </button>
        ) : isRunning ? (
          <button className="w-full py-4 bg-tech-700 rounded-xl font-bold text-slate-400 cursor-wait flex items-center justify-center gap-2">
             <RefreshCw className="animate-spin" /> Processing...
          </button>
        ) : (
           <button
            onClick={onReset}
            className="w-full py-4 bg-tech-700 hover:bg-tech-600 rounded-xl font-bold text-white flex items-center justify-center gap-2"
          >
            <RotateCw /> RESET DESIGN
          </button>
        )}
      </div>

      {/* Live Metrics */}
      <div className="px-4 space-y-3 mb-6">
        <h3 className="text-xs font-bold text-slate-500 uppercase">Real-time Telemetry</h3>
        <div className="grid grid-cols-2 gap-3">
          <MetricGauge 
            label="Coverage" 
            value={metrics.coveragePercent.toFixed(1)} 
            unit="%" 
            status={metrics.coveragePercent >= 95 ? 'good' : isComplete ? 'bad' : 'neutral'} 
          />
          <MetricGauge 
            label="Latency" 
            value={metrics.latency.toFixed(0)} 
            unit="ms" 
            status={metrics.latency <= 10 ? 'good' : isComplete ? 'bad' : 'neutral'} 
          />
          <MetricGauge 
            label="Signal" 
            value={metrics.signalStrength.toFixed(0)} 
            unit="dBm" 
            status={metrics.signalStrength > -80 ? 'good' : 'neutral'} 
          />
          <MetricGauge 
            label="SNR" 
            value={metrics.snr.toFixed(1)} 
            unit="dB" 
            status={metrics.snr > 15 ? 'good' : 'neutral'} 
          />
        </div>
      </div>

      {/* Objectives List */}
      <div className="flex-1 bg-tech-900 p-4 border-t border-tech-700 overflow-y-auto">
        <h3 className="text-xs font-bold text-slate-500 uppercase mb-3">Mission Objectives</h3>
        <div className="space-y-2">
          {objectives.map((obj) => (
            <div key={obj.id} className={`flex items-center gap-3 p-3 rounded border ${obj.isMet ? 'bg-tech-success/10 border-tech-success/30' : 'bg-tech-800 border-tech-700'}`}>
              {obj.isMet ? <CheckCircle className="text-tech-success w-5 h-5" /> : <div className="w-5 h-5 rounded-full border-2 border-slate-600" />}
              <div className="flex-1">
                <div className="text-sm font-medium text-slate-200">{obj.description}</div>
                <div className="text-xs text-slate-500">
                  Current: {obj.currentValue}{obj.unit} / Target: {obj.targetValue === 95 ? '>' : '<'}{obj.targetValue}{obj.unit}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default ControlPanel;

function RotateCw(props: React.SVGProps<SVGSVGElement>) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
        <path d="M21 3v5h-5" />
      </svg>
    )
}
