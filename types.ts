
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
