export enum ComponentType {
  BASE_STATION_28GHZ = 'BS_28GHZ',
  PHASED_ARRAY = 'PHASED_ARRAY',
  RIS_PANEL = 'RIS_PANEL',
  OBSTACLE = 'OBSTACLE', // For level design
}

export interface GameComponent {
  id: string;
  type: ComponentType;
  x: number; // Grid X
  y: number; // Grid Y
  rotation: number;
  power?: number; // dBm
  locked?: boolean;
}

export interface LevelObjective {
  id: string;
  description: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  isMet: boolean;
}

export interface SimulationMetrics {
  signalStrength: number; // dBm
  snr: number; // dB
  latency: number; // ms
  powerConsumption: number; // Watts
  coveragePercent: number;
}

export interface LevelConfig {
  id: string;
  name: string;
  description: string;
  context: 'CITY' | 'CIRCUIT' | 'QUANTUM';
  gridSize: number;
  budget: number;
  objectives: LevelObjective[];
  availableComponents: ComponentType[];
  mapImage: string; // Placeholder URL
}

export interface FeedbackMessage {
  step: number;
  text: string;
  options?: { label: string; isCorrect: boolean; response: string }[];
}

export enum SimulationState {
  IDLE = 'IDLE',
  RUNNING = 'RUNNING',
  COMPLETE_SUCCESS = 'SUCCESS',
  COMPLETE_FAILURE = 'FAILURE',
}
