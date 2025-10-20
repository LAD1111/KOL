
export interface ScriptScene {
  visual: string;
  voiceover: string;
}

export interface Script {
  id: string;
  title: string;
  hook: string;
  scenes: ScriptScene[];
  cta: string;
  postContent?: string;
  hashtags?: string[];
  saved?: boolean;
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  productLink: string;
  scripts: Script[];
}

declare global {
  // FIX: Moved AIStudio interface inside `declare global` to properly augment the global scope
  // and resolve the "Subsequent property declarations must have the same type" error.
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }

  interface Window {
    aistudio?: AIStudio;
  }
}
