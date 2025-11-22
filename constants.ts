import { ComponentType, LevelConfig } from './types';

export const COMPONENT_DEFINITIONS = {
  [ComponentType.BASE_STATION_28GHZ]: {
    name: '28 GHz Base Station',
    cost: 30,
    icon: '📡',
    description: 'Standard mmWave transmitter. High speed, low penetration.',
    range: 5, // Grid units
    color: '#0ea5e9',
  },
  [ComponentType.PHASED_ARRAY]: {
    name: 'Phased Array',
    cost: 45,
    icon: '🛰️',
    description: 'Steerable beam antenna. Focused gain, higher cost.',
    range: 8,
    color: '#8b5cf6',
  },
  [ComponentType.RIS_PANEL]: {
    name: 'RIS Panel',
    cost: 15,
    icon: '🪞',
    description: 'Reconfigurable Intelligent Surface. Reflects signals around obstacles.',
    range: 3,
    color: '#10b981',
  },
  [ComponentType.OBSTACLE]: {
    name: 'Obstacle',
    cost: 0,
    icon: '🏢',
    description: 'Building or structure blocking RF signals.',
    range: 0,
    color: '#64748b',
  },
};

export const LEVEL_FENWAY: LevelConfig = {
  id: '2-1',
  name: 'Fenway Park Challenge',
  description: 'Deploy 6G infrastructure to ensure seamless connectivity for IMS2026 attendees at the stadium.',
  context: 'CITY',
  gridSize: 20,
  budget: 100,
  mapImage: 'https://picsum.photos/800/600', // Placeholder for Fenway map
  availableComponents: [
    ComponentType.BASE_STATION_28GHZ,
    ComponentType.PHASED_ARRAY,
    ComponentType.RIS_PANEL,
  ],
  objectives: [
    {
      id: 'obj_coverage',
      description: 'Coverage Area',
      targetValue: 95,
      currentValue: 0,
      unit: '%',
      isMet: false,
    },
    {
      id: 'obj_latency',
      description: 'Max Latency',
      targetValue: 10, // Less than 10
      currentValue: 0,
      unit: 'ms',
      isMet: false,
    },
  ],
};

export const SOCRATIC_DIALOGUE = {
  metal_blockage: [
    {
      step: 1,
      text: "I see the signal didn't quite reach the entire stadium. Notice the red zone behind the metal bleachers?",
      options: [
        { label: "Metal absorbs all RF energy", isCorrect: false, response: "Not quite. While some absorption happens, it's not the primary behavior at 28 GHz." },
        { label: "Metal reflects RF waves", isCorrect: true, response: "Correct! At 28 GHz (mmWave), metal structures cause significant shadowing and reflection." },
        { label: "Metal is transparent to RF", isCorrect: false, response: "Incorrect. Metal is a conductor and interacts strongly with EM waves." },
      ]
    },
    {
      step: 2,
      text: "Since the bleachers block the line-of-sight, how can we get the signal around them without moving the stadium?",
      options: [
        { label: "Increase power to burn through", isCorrect: false, response: "That would violate safety regulations and drain the battery!" },
        { label: "Use lower frequency", isCorrect: false, response: "We need the bandwidth of 28 GHz for 6G speeds." },
        { label: "Reflect the signal", isCorrect: true, response: "Exactly. We can bounce the signal using a passive surface." },
      ]
    },
    {
      step: 3,
      text: "Check your toolbox. Which component acts like a 'smart mirror' for radio waves?",
      options: [
        { label: "Phased Array", isCorrect: false, response: "A Phased Array transmits active signals. We need a passive reflector." },
        { label: "RIS Panel", isCorrect: true, response: "Spot on. A Reconfigurable Intelligent Surface (RIS) can steer reflections into dead zones." },
      ]
    }
  ]
};
