import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import { PromptQualityReport, PromptCompressionReport, PromptComparisonReport } from "./src/types";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client
let ai: GoogleGenAI | null = null;
const api_key = process.env.GEMINI_API_KEY;

if (api_key && api_key !== "MY_GEMINI_API_KEY") {
  try {
    ai = new GoogleGenAI({
      apiKey: api_key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
    console.log("Gemini client successfully initialized server-side.");
  } catch (err) {
    console.error("Failed to initialize GoogleGenAI client:", err);
  }
} else {
  console.log("No valid GEMINI_API_KEY found. AI functions will run in simulation mode with mock fallback.");
}

// Durable local JSON storage config
const DB_FILE = path.join(process.cwd(), "prompt_tok_db.json");

// Default initial dataset for active social feel
const DEFAULT_USERS = {
  "ai_architect": {
    username: "ai_architect",
    name: "Alex Dev",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
    bio: "AI Engineer & System Architect. Writing hyper-optimized backend & code generation prompts.",
    walletBalance: 1250,
    followers: 2400,
    following: 180,
    earnings: 450
  },
  "prompt_queen": {
    username: "prompt_queen",
    name: "Sarah Jenkins",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
    bio: "Digital artist & Midjourney wizard. Curating aesthetic lighting and fine-art textures in prompt craft.",
    walletBalance: 840,
    followers: 5120,
    following: 340,
    earnings: 720
  },
  "growth_hacker": {
    username: "growth_hacker",
    name: "Marcus Tan",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    bio: "Copywriter & SEO specialist. Monetizing high-conversion email marketing structures.",
    walletBalance: 420,
    followers: 1280,
    following: 410,
    earnings: 120
  }
};

const DEFAULT_PROMPTS = [
  {
    id: "p1",
    title: "Midjourney 3D Isometric Cyberpunk Room Master",
    description: "Generates beautiful, grid-aligned, high-detail isometric 3D illustrations of terminal hacker hubs with cozy ambient emission layers.",
    promptText: "A high-fidelity 3D isometric room illustration of a cyberpunk hacker workspace, glowing multiple computer screens, neon purple and teal light accents, floating hologram interface, digital synthesis hardware, octanes render style, 8k resolution, raytracing shadow depth, hyper-detailed cyberpunk aesthetic --ar 16:9 --v 6.0",
    creator: DEFAULT_USERS["prompt_queen"],
    category: "Image Gen",
    likes: 312,
    clones: 198,
    views: 1240,
    qualityScore: 94,
    qualityFeedback: "### PromptTok Quality Assessment\n- **Clarity / Specifity**: Exceptional. Distinct scene instructions provided.\n- **Parameters**: Correctly uses Midjourney v6.0 syntax flags.\n- **Recommendation**: Adding concrete material tags (e.g. 'metallic textures', 'brushed steel') can polish reflections further.",
    isPremium: false,
    price: 0,
    createdAt: new Date(Date.now() - 4 * 3600000).toISOString(),
    videoPromptUrl: "https://assets.mixkit.co/videos/preview/mixkit-flying-through-a-futuristic-sceni-road-with-glowing-lines-41589-large.mp4"
  },
  {
    id: "p2",
    title: "Full-Stack TypeScript Expert Assistant",
    description: "An incredibly precise system instruction prompt to turn any standard model into an elite clean-code TypeScript engineer.",
    promptText: "You are a lead staff TypeScript engineer with expertise in Express v5, React 19, and Vite frameworks. When asked to code, perform custom imports first, separate pure logical services from layout UI render trees, design comprehensive strict types conforming to ES2022 rules, insert short line-pair commentary explaining architecture, and write production-ready code without code mockups or comments to skip files.",
    creator: DEFAULT_USERS["ai_architect"],
    category: "Code",
    likes: 184,
    clones: 122,
    views: 740,
    qualityScore: 97,
    qualityFeedback: "### PromptTok Quality Assessment\n- **Clarity / Style**: Extreme directive consistency. Directives address imports, runtime constraints, and documentation.\n- **Enhancements**: Add a system directive regarding test coverage criteria if required.",
    isPremium: true,
    price: 30,
    createdAt: new Date(Date.now() - 12 * 3600000).toISOString(),
    videoPromptUrl: "https://assets.mixkit.co/videos/preview/mixkit-digital-circuit-board-glowing-in-the-dark-32210-large.mp4"
  },
  {
    id: "p3",
    title: "The Psychological LinkedIn Hook Builder",
    description: "Craft powerful, eye-catching introductory hooks for viral technical or corporate growth marketing threads without sounding like AI-generated garbage.",
    promptText: "Write a high-retention social media hook discussing artificial intelligence workflows. Avoid using cliché buzzwords (unleash, landscape, game-changer, revolutionary). Start with a polar or high-contrast personal scenario that directly breaks an industry myth, followed by an immediate counter-intuitive lesson. Format as standard single-sentence linebreaks for readability.",
    creator: DEFAULT_USERS["growth_hacker"],
    category: "Marketing",
    likes: 89,
    clones: 45,
    views: 310,
    qualityScore: 88,
    qualityFeedback: "### PromptTok Quality Assessment\n- **Clarity**: Very high control over AI style/words to avoid.\n- **Structure**: The myth -> lessons layout works brilliantly to stimulate dopamine curiosity.",
    isPremium: false,
    price: 0,
    createdAt: new Date(Date.now() - 24 * 3600000).toISOString(),
    videoPromptUrl: "https://assets.mixkit.co/videos/preview/mixkit-typing-hands-on-a-glowing-computer-keyboard-40502-large.mp4"
  }
];

const DEFAULT_WORKFLOWS = [
  {
    id: "w1",
    title: "Viral SaaS Product Launch Generator",
    description: "A complete multi-step agent flow that transforms a simple product description into a structured roadmap, viral copy hook, and functional launch pitch.",
    category: "Marketing",
    likes: 245,
    clones: 180,
    views: 890,
    isPremium: true,
    price: 80,
    creator: DEFAULT_USERS["growth_hacker"],
    createdAt: new Date(Date.now() - 36 * 3600000).toISOString(),
    steps: [
      {
        stepNumber: 1,
        title: "Product Value Matrix definition",
        promptText: "Draft a clear, high-contrast value proposition matrix for the following startup description. For each tier, write the primary problem solved, target user profile, and core feature triggers:\n\n startup_description: {{STARTUP_INFO}}",
        expectedOutput: "A structured tables list mapping problems and segments to visual feature triggers."
      },
      {
        stepNumber: 2,
        title: "Platform Launch Hook Suite",
        promptText: "Take the value matrix from step 1 and generate 3 viral Product Hunt opening hooks, 3 high-performance cold email subject lines, and 1 LinkedIn story draft detailing the original inspiration story.",
        expectedOutput: "A collection of social headers completely tailored for immediate copying."
      },
      {
        stepNumber: 3,
        title: "Targeted Customer Feedback Agent Simulator",
        promptText: "Using the launch assets, act as a skeptical early-adopter engineer. Provide 3 direct criticisms regarding security, runtime costs, and setup fatigue, then draft replies to proactively overcome these objections.",
        expectedOutput: "Simulated objection handling matrix to address client anxieties."
      }
    ]
  }
];

// Load and seed DB if empty
function loadDB() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const parsed = JSON.parse(fs.readFileSync(DB_FILE, "utf-8"));
      // Basic schema health validation
      if (parsed.prompts && parsed.users && parsed.workflows) {
        return parsed;
      }
    }
  } catch (error) {
    console.error("Error reading persistence db file, resetting to fallback simulation context.", error);
  }
  const initial = {
    users: { ...DEFAULT_USERS },
    prompts: [...DEFAULT_PROMPTS],
    workflows: [...DEFAULT_WORKFLOWS],
    currentUser: {
      username: "creative_innovator",
      name: "Guest Promptist",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
      bio: "Learning AI prompt crafting and multi-step workflow chains on PromptTok!",
      walletBalance: 350,
      followers: 12,
      following: 88,
      earnings: 0
    },
    likedPrompts: [] as string[],
    clonedPrompts: [] as string[]
  };
  saveDB(initial);
  return initial;
}

function saveDB(data: any) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Critical error saving JSON database", err);
  }
}

// REST APIs
// ----------------------------------------------------------------------------

// Initial state fetch
app.get("/api/state", (req, res) => {
  const db = loadDB();
  res.json(db);
});

// Update the current user wallet or metadata
app.post("/api/user/wallet", (req, res) => {
  const db = loadDB();
  const { amount } = req.body;
  db.currentUser.walletBalance = Math.max(0, db.currentUser.walletBalance + (amount || 0));
  if (amount > 0) {
    db.currentUser.earnings = (db.currentUser.earnings || 0) + amount;
  }
  saveDB(db);
  res.json(db.currentUser);
});

// Reset database
app.post("/api/reset-db", (req, res) => {
  const data = {
    users: { ...DEFAULT_USERS },
    prompts: [...DEFAULT_PROMPTS],
    workflows: [...DEFAULT_WORKFLOWS],
    currentUser: {
      username: "creative_innovator",
      name: "Guest Promptist",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
      bio: "Learning AI prompt crafting and multi-step workflow chains on PromptTok!",
      walletBalance: 350,
      followers: 12,
      following: 88,
      earnings: 0
    },
    likedPrompts: [] as string[],
    clonedPrompts: [] as string[]
  };
  saveDB(data);
  res.json(data);
});

// Add Prompt
app.post("/api/prompts", async (req, res) => {
  const db = loadDB();
  const { title, description, promptText, category, isPremium, price } = req.body;

  if (!title || !promptText) {
    return res.status(400).json({ error: "Title and Prompt Text are required" });
  }

  // Generate simulated or real quality scoring immediately
  let score = 75;
  let feedback = "### Prompt Evaluation Report\nOptimizing and examining prompt structure... ";

  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `Evaluate the quality of the following prompt. Make your scoring strict, constructive, and realistic. Return a JSON structure exactly matching this interface:
        {
          "score": number (0-100 based on utility and correctness),
          "clarity": number (0-100),
          "structure": number (0-100),
          "specificity": number (0-100),
          "context": number (0-100),
          "feedback": "string (A Markdown formatted structured summary of comments, criticisms, and suggestions of about 2 paragraphs)",
          "optimizedPrompt": "string (An improved, highly detailed version of the original prompt using professional prompt-engineering methodologies)"
        }
        Do not output any introductory text or closing markdown codeblocks other than pure JSON.
        
        PROMPT TO EVALUATE:
        Title: ${title}
        Description: ${description}
        PromptText: ${promptText}
        Category: ${category}`,
        config: {
          responseMimeType: "application/json"
        }
      });

      const parsedReport = JSON.parse(response.text?.trim() || "{}");
      score = parsedReport.score || 80;
      feedback = parsedReport.feedback || "Processed successfully by AI analyzer.";
    } catch (e) {
      console.error("AI scoring failed inside creation, falling back to simulated analysis:", e);
      score = 80 + Math.floor(Math.random() * 15);
      feedback = `### AI Review\nGood structured initial design. Specify model options clearly to assure optimal outputs.`;
    }
  } else {
    // Simulated feedback
    score = 70 + Math.floor(Math.random() * 25);
    feedback = `### PromptTok Quality Assessment (Simulation Mode)\n- **Clarity / Specifity**: ${score > 85 ? "Excellent" : "Decent"}. Directives are easy for modern models to interpret.\n- **Recommendation**: Adding concrete constraints (such as 'no buzzwords') and structured tags improves deterministic output rendering significantly.`;
  }

  // Pre-configured video list for TikTok aesthetics
  const previewVideos = [
    "https://assets.mixkit.co/videos/preview/mixkit-flying-through-a-futuristic-sceni-road-with-glowing-lines-41589-large.mp4",
    "https://assets.mixkit.co/videos/preview/mixkit-digital-circuit-board-glowing-in-the-dark-32210-large.mp4",
    "https://assets.mixkit.co/videos/preview/mixkit-typing-hands-on-a-glowing-computer-keyboard-40502-large.mp4",
    "https://assets.mixkit.co/videos/preview/mixkit-neon-light-with-a-retro-futuristic-vibe-34208-large.mp4"
  ];
  const videoUrl = previewVideos[db.prompts.length % previewVideos.length];

  const newPrompt = {
    id: "p_" + Date.now(),
    title,
    description,
    promptText,
    creator: db.currentUser,
    category: category || "Other",
    likes: 0,
    comments: [],
    clones: 0,
    views: 1,
    qualityScore: score,
    qualityFeedback: feedback,
    isPremium: !!isPremium,
    price: isPremium ? Number(price || 10) : 0,
    createdAt: new Date().toISOString(),
    videoPromptUrl: videoUrl
  };

  db.prompts.unshift(newPrompt);
  saveDB(db);
  res.json(newPrompt);
});

// Like Prompt Toggle
app.post("/api/prompts/:id/like", (req, res) => {
  const db = loadDB();
  const id = req.params.id;
  const index = db.prompts.findIndex((p: any) => p.id === id);

  if (index !== -1) {
    const isLiked = db.likedPrompts.includes(id);
    if (isLiked) {
      db.likedPrompts = db.likedPrompts.filter((item: string) => item !== id);
      db.prompts[index].likes = Math.max(0, db.prompts[index].likes - 1);
    } else {
      db.likedPrompts.push(id);
      db.prompts[index].likes += 1;
    }
    saveDB(db);
    res.json({ prompt: db.prompts[index], likedPrompts: db.likedPrompts });
  } else {
    res.status(404).json({ error: "Prompt not found" });
  }
});

// Clone / Copy Prompt Action
app.post("/api/prompts/:id/clone", (req, res) => {
  const db = loadDB();
  const id = req.params.id;
  const index = db.prompts.findIndex((p: any) => p.id === id);

  if (index !== -1) {
    const prompt = db.prompts[index];
    
    // Check if user is cloning a premium prompt they need to buy (if it's not their own)
    if (prompt.isPremium && prompt.price > 0 && prompt.creator.username !== db.currentUser.username) {
      // For standard prompt copying, we let users copy but encourage simulated wallet check
      if (db.currentUser.walletBalance < prompt.price) {
        return res.status(402).json({ error: `Insufficient simulated wallet balance (Requires ${prompt.price} PromoCoins). Use the Wallet Daily Drop to load tokens!` });
      }
      
      // Charge current user
      db.currentUser.walletBalance -= prompt.price;
      
      // Pay creator
      const seller = prompt.creator.username;
      if (db.users[seller]) {
        db.users[seller].walletBalance += prompt.price;
        db.users[seller].earnings = (db.users[seller].earnings || 0) + prompt.price;
      }
    }

    db.prompts[index].clones += 1;
    if (!db.clonedPrompts.includes(id)) {
      db.clonedPrompts.push(id);
    }

    saveDB(db);
    res.json({ prompt: db.prompts[index], clonedPrompts: db.clonedPrompts, currentUser: db.currentUser });
  } else {
    res.status(404).json({ error: "Prompt not found" });
  }
});

// Comment on Prompt
app.post("/api/prompts/:id/comment", (req, res) => {
  const db = loadDB();
  const id = req.params.id;
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: "Comment text is required" });
  }

  const index = db.prompts.findIndex((p: any) => p.id === id);
  if (index !== -1) {
    const newComment = {
      id: "c_" + Date.now(),
      username: db.currentUser.username,
      avatar: db.currentUser.avatar,
      text,
      createdAt: new Date().toISOString()
    };
    db.prompts[index].comments.push(newComment);
    saveDB(db);
    res.json(db.prompts[index]);
  } else {
    res.status(404).json({ error: "Prompt not found" });
  }
});

// View count incrementor when sliding/viewing
app.post("/api/prompts/:id/view", (req, res) => {
  const db = loadDB();
  const id = req.params.id;
  const index = db.prompts.findIndex((p: any) => p.id === id);
  if (index !== -1) {
    db.prompts[index].views += 1;
    saveDB(db);
    res.json({ views: db.prompts[index].views });
  } else {
    res.status(404).json({ error: "Prompt not found" });
  }
});

// Create AI Workflow
app.post("/api/workflows", (req, res) => {
  const db = loadDB();
  const { title, description, steps, isPremium, price, category } = req.body;

  if (!title || !steps || !Array.isArray(steps) || steps.length === 0) {
    return res.status(400).json({ error: "Title and at least one workflow step are required" });
  }

  const newWorkflow = {
    id: "w_" + Date.now(),
    title,
    description: description || "A comprehensive multi-prompt sequential pipeline.",
    steps: steps.map((s, idx) => ({
      stepNumber: idx + 1,
      title: s.title || `Step ${idx + 1}`,
      promptText: s.promptText,
      expectedOutput: s.expectedOutput || "Optimized model text result."
    })),
    creator: db.currentUser,
    likes: 0,
    clones: 0,
    views: 1,
    isPremium: !!isPremium,
    price: isPremium ? Number(price || 40) : 0,
    category: category || "Business",
    createdAt: new Date().toISOString()
  };

  db.workflows.unshift(newWorkflow);
  saveDB(db);
  res.json(newWorkflow);
});

// Buy Workflow
app.post("/api/workflows/:id/buy", (req, res) => {
  const db = loadDB();
  const id = req.params.id;
  const index = db.workflows.findIndex((w: any) => w.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "Workflow not found" });
  }

  const workflow = db.workflows[index];

  if (workflow.creator.username === db.currentUser.username) {
    return res.json({ message: "You already own this workflow since you created it!", currentUser: db.currentUser });
  }

  const coinsCost = workflow.price || 0;
  if (db.currentUser.walletBalance < coinsCost) {
    return res.status(402).json({ error: `Insufficient PromoCoins. Get a Daily Deposit of more virtual tokens to complete the transaction!` });
  }

  // Deduct
  db.currentUser.walletBalance -= coinsCost;
  
  // Pay creator
  const seller = workflow.creator.username;
  if (db.users[seller]) {
    db.users[seller].walletBalance += coinsCost;
    db.users[seller].earnings = (db.users[seller].earnings || 0) + coinsCost;
  }

  db.workflows[index].clones += 1;
  saveDB(db);
  res.json({ message: "Successfully purchased workflow!", workflow: db.workflows[index], currentUser: db.currentUser });
});


// ----------------------------------------------------------------------------
// GEMINI INTELLIGENT ROUTING ENDPOINTS
// ----------------------------------------------------------------------------

// 1. Quality Scoring Endpoint
app.post("/api/ai/score", async (req, res) => {
  const { title, promptText, category } = req.body;
  if (!promptText) {
    return res.status(400).json({ error: "Prompt text is required for quality audit" });
  }

  if (ai) {
    try {
      const gRes = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `Analyze the structure, clarity, and overall utility of the following AI prompt. Grade it with concrete metrics. Return a raw JSON block with values structure exactly as described:
        {
          "score": number (0-100),
          "clarity": number (0-100),
          "structure": number (0-100),
          "specificity": number (0-100),
          "context": number (0-100),
          "feedback": "string (A Markdown formatted bulleted list of constructive review comments, weaknesses identified, and expected improvements. Include a clear sub-header explaining the design philosophy.)",
          "optimizedPrompt": "string (An improved, highly detailed, professional prompt engineering equivalent that includes custom format instructions, background boundaries, and system parameters)"
        }
        
        PROMPT DETAIL:
        Title: ${title || "Untitled Prompt"}
        Category: ${category || "General"}
        PromptContent: "${promptText}"`,
        config: {
          responseMimeType: "application/json"
        }
      });

      const report: PromptQualityReport = JSON.parse(gRes.text?.trim() || "{}");
      res.json(report);
    } catch (err: any) {
      console.error("Gemini AI scoring route failed:", err);
      res.status(500).json({ error: "Failed to score prompt via Gemini: " + err.message });
    }
  } else {
    // Elegant fallback simulation
    const simulatedScore = Math.floor(65 + Math.random() * 30);
    res.json({
      score: simulatedScore,
      clarity: Math.floor(60 + Math.random() * 40),
      structure: Math.floor(60 + Math.random() * 40),
      specificity: Math.floor(55 + Math.random() * 45),
      context: Math.floor(50 + Math.random() * 50),
      feedback: `### PromptTok Automated Evaluation (Simulation Mode)\n- **Clarity Check**: The model understands the initial core concept easily.\n- **Structural Gaps**: Needs clearer variable constraints and delimiters.\n- **Action Plan**: Specify standard input-output delimiters (e.g. \`"""\`) and guide response tone rules explicitly.`,
      optimizedPrompt: `[System Instruction: You are an expert strategist.]\n\n"${promptText}"\n\nEnsure that you structure your response step-by-step, avoiding generic advice, and using clear headings to organize sections.`
    });
  }
});

// 2. Prompt Compression Endpoint
app.post("/api/ai/compress", async (req, res) => {
  const { promptText } = req.body;
  if (!promptText) {
    return res.status(400).json({ error: "Prompt text is required for token compression" });
  }

  if (ai) {
    try {
      const gRes = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `You are an AI context-saving prompt optimizer. Your goal is to compress the following prompt by stripping verbose phrases, redundant wording, and filler vocabulary while preserving 100% of its semantic instructions, constraints, and variables.
        Return a JSON object exactly matching this interface:
        {
          "originalTokens": number (approx, count words * 1.3),
          "compressedTokens": number (approx, count words * 1.3 of compressed),
          "percentageCompressed": number (e.g. 42),
          "compressedPrompt": "string (The fully compressed, structured, punchy prompt utilizing symbols and ultra-dense phrasing)",
          "explanation": "string (Brief line describing what filler text was successfully trimmed to save context tokens)"
        }
        
        PROMPT TO COMPRESS:
        "${promptText}"`,
        config: {
          responseMimeType: "application/json"
        }
      });

      const report: PromptCompressionReport = JSON.parse(gRes.text?.trim() || "{}");
      res.json(report);
    } catch (err: any) {
      console.error("AI Compression failed:", err);
      res.status(500).json({ error: "Failed to compress via Gemini: " + err.message });
    }
  } else {
    const originalLen = Math.floor(promptText.length / 4);
    const compressedLen = Math.floor(originalLen * 0.6);
    res.json({
      originalTokens: originalLen,
      compressedTokens: compressedLen,
      percentageCompressed: 40,
      compressedPrompt: `[Dense: Role=Expert, Goal=Instructional]\n${promptText.split(" ").slice(0, Math.ceil(promptText.split(" ").length * 0.6)).join(" ")}...`,
      explanation: "Removed conversational greetings, redundant filler adjectives, and transitioned instructions into direct imperative syntax."
    });
  }
});

// 3. Prompt Comparison Analyzer Endpoint
app.post("/api/ai/compare", async (req, res) => {
  const { promptA, promptB } = req.body;
  if (!promptA || !promptB) {
    return res.status(400).json({ error: "Two prompts (A & B) must be specified for comparative analysis." });
  }

  if (ai) {
    try {
      const gRes = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `You are an elite LLM benchmark evaluator. Examine the following two prompts (Prompt A and Prompt B) side-by-side. Score them, decide a winner, generate simulated responses explaining the key outcome difference.
        Return a JSON object matching this structure:
        {
          "promptA_Score": number (0-100),
          "promptB_Score": number (0-100),
          "winner": "string ('A' or 'B' or 'Tie')",
          "winningReason": "string (Markdown description of why the winner performs statistically better)",
          "comparisonTable": [
            { "criteria": "Context Depth", "promptA_Eval": "string", "promptB_Eval": "string" },
            { "criteria": "Instruction Specificity", "promptA_Eval": "string", "promptB_Eval": "string" },
            { "criteria": "Formatting Integrity", "promptA_Eval": "string", "promptB_Eval": "string" }
          ],
          "simulatedOutputA": "string (Markdown showing the typical response Prompt A would yield)",
          "simulatedOutputB": "string (Markdown showing the typical response Prompt B would yield)"
        }
        
        PROMPT A:
        "${promptA}"
        
        PROMPT B:
        "${promptB}"`,
        config: {
          responseMimeType: "application/json"
        }
      });

      const report: PromptComparisonReport = JSON.parse(gRes.text?.trim() || "{}");
      res.json(report);
    } catch (err: any) {
      console.error("Gemini comparing route failed:", err);
      res.status(500).json({ error: "Failed to compare prompts: " + err.message });
    }
  } else {
    // Mock simulation
    res.json({
      promptA_Score: 84,
      promptB_Score: 92,
      winner: "B",
      winningReason: "Prompt B incorporates explicit negative constraints (what *not* to do) and demands clear output markers. This ensures high-integrity logical consistency.",
      comparisonTable: [
        {
          criteria: "Negative Filters",
          promptA_Eval: "No negative constraints declared; prone to formatting fluff.",
          promptB_Eval: "Explicitly outlines elements/words to skip for a clean output."
        },
        {
          criteria: "Formatting Guidance",
          promptA_Eval: "Explains layout in loose prose.",
          promptB_Eval: "Defines output format structures clearly."
        }
      ],
      simulatedOutputA: "### Standard Output\nHere is a list of creative headlines you requested. Tell me if you like them!",
      simulatedOutputB: "### Raw Output\n1. [Hook Type: Paradox] 'Why clean code is slow to build...'"
    });
  }
});

// 4. Run Agent / Playground Testing Endpoint
app.post("/api/ai/run-agent", async (req, res) => {
  const { systemPrompt, userMessage, chatHistory } = req.body;
  if (!systemPrompt || !userMessage) {
    return res.status(400).json({ error: "System Prompt and User Message are required to act as an agent." });
  }

  if (ai) {
    try {
      const msgs = [];
      if (chatHistory && Array.isArray(chatHistory)) {
        for (const h of chatHistory) {
          msgs.push({
            role: h.role === "user" ? "user" : "model",
            parts: [{ text: h.text }]
          });
        }
      }
      msgs.push({
        role: "user",
        parts: [{ text: userMessage }]
      });

      const gRes = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: msgs as any,
        config: {
          systemInstruction: `You are an AI Agent configured with the following system rules:\n${systemPrompt}\n\nConform extremely strictly to these rules.`
        }
      });

      res.json({ text: gRes.text });
    } catch (err: any) {
      console.error("Gemini Sandbox Agent failed:", err);
      res.status(500).json({ error: "AI Agent run failed: " + err.message });
    }
  } else {
    // Sandbox simulation
    let output = `[PromptTok Agent Sandbox Simulation Mode]\nThis model is acting under the system rules:\n"${systemPrompt}"\n\nResponse to your request: "${userMessage}"\n\nI have evaluated your parameters and recommend optimizing your variable injection keys. Please install a valid GEMINI_API_KEY to witness live AI model responses!`;
    res.json({ text: output });
  }
});


// Boot local db on startup
loadDB();

// Setup dev server or static static assets
async function start() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Mounted Vite middleware for active reactive development.");
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Serving static production build from /dist directory.");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`PromptTok server listening proudly on host 0.0.0.0 port ${PORT}`);
  });
}

start();
