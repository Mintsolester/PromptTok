export interface User {
  username: string;
  name: string;
  avatar: string;
  bio: string;
  walletBalance: number;
  followers: number;
  following: number;
  earnings: number;
}

export interface Comment {
  id: string;
  username: string;
  avatar: string;
  text: string;
  createdAt: string;
}

export interface Prompt {
  id: string;
  title: string;
  description: string;
  promptText: string;
  creator: User;
  category: string;
  likes: number;
  comments: Comment[];
  clones: number;
  views: number;
  qualityScore?: number;
  qualityFeedback?: string; // Markdown report from Gemini
  isPremium?: boolean;
  price?: number; // In Virtual Coins
  createdAt: string;
  remixedFromId?: string;
  remixedFromTitle?: string;
  videoPromptUrl?: string; // For mock vertical video backgrounds to look like TikTok!
}

export interface WorkflowStep {
  stepNumber: number;
  title: string;
  promptText: string;
  expectedOutput?: string;
}

export interface Workflow {
  id: string;
  title: string;
  description: string;
  steps: WorkflowStep[];
  creator: User;
  likes: number;
  clones: number;
  views: number;
  isPremium?: boolean;
  price?: number; // In Virtual Coins
  category: string;
  createdAt: string;
}

export interface PromptQualityReport {
  score: number;
  clarity: number;
  structure: number;
  specificity: number;
  context: number;
  feedback: string;
  optimizedPrompt: string;
}

export interface PromptCompressionReport {
  originalTokens: number;
  compressedTokens: number;
  percentageCompressed: number;
  compressedPrompt: string;
  explanation: string;
}

export interface PromptComparisonReport {
  promptA_Score: number;
  promptB_Score: number;
  winner: "A" | "B" | "Tie";
  winningReason: string;
  comparisonTable: {
    criteria: string;
    promptA_Eval: string;
    promptB_Eval: string;
  }[];
  simulatedOutputA: string;
  simulatedOutputB: string;
}
