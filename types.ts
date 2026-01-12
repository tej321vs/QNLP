
export interface QuantumStats {
  entanglement: number;
  entropy: number;
  superposition: number;
  qubitStates: number[];
  semanticVector: { x: number; y: number; z: number };
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: Date;
  stats?: QuantumStats;
}

export interface QuantumResponse {
  response: string;
  stats: QuantumStats;
}
