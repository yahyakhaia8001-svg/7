
export interface SVGHistoryItem {
  id: string;
  prompt: string;
  code: string;
  timestamp: number;
}

export interface AppState {
  currentCode: string;
  currentPrompt: string;
  history: SVGHistoryItem[];
  isGenerating: boolean;
  error: string | null;
}
