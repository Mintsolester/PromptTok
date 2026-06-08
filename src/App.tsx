import React, { useState, useEffect, useRef } from "react";
import {
  Flame,
  Play,
  Plus,
  Copy,
  Award,
  Sparkles,
  Scissors,
  RotateCcw,
  Coins,
  MessageSquare,
  Heart,
  Eye,
  User as UserIcon,
  Layers,
  ArrowRight,
  Share2,
  Check,
  AlertCircle,
  Code,
  Search,
  Terminal,
  Compass,
  FileText,
  BadgeDollarSign,
  TrendingUp,
  Sliders,
  Sparkle,
  Bookmark,
  ChevronDown,
  ChevronUp,
  X,
  PlusCircle,
  Send,
  UserCheck
} from "lucide-react";
import { Prompt, Workflow, User, Comment, PromptQualityReport, PromptCompressionReport, PromptComparisonReport } from "./types";

export default function App() {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<"feed" | "workflows" | "optimize" | "compare" | "playground" | "profile">("feed");
  
  // App state from backend
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [currentUser, setCurrentUser] = useState<User>({
    username: "creative_innovator",
    name: "Guest Promptist",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
    bio: "Learning AI prompt crafting and multi-step workflow chains on PromptTok!",
    walletBalance: 350,
    followers: 12,
    following: 88,
    earnings: 0
  });
  const [users, setUsers] = useState<Record<string, User>>({});
  const [likedPrompts, setLikedPrompts] = useState<string[]>([]);
  const [clonedPrompts, setClonedPrompts] = useState<string[]>([]);

  // Filtering / Search
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // TikTok Feed playback variables
  const [currentFeedIndex, setCurrentFeedIndex] = useState(0);

  // New prompt form modal
  const [isNewPromptOpen, setIsNewPromptOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newText, setNewText] = useState("");
  const [newCategory, setNewCategory] = useState("Image Gen");
  const [newIsPremium, setNewIsPremium] = useState(false);
  const [newPrice, setNewPrice] = useState(20);

  // New workflow modal
  const [isNewWorkflowOpen, setIsNewWorkflowOpen] = useState(false);
  const [workTitle, setWorkTitle] = useState("");
  const [workDesc, setWorkDesc] = useState("");
  const [workCategory, setWorkCategory] = useState("Marketing");
  const [workIsPremium, setWorkIsPremium] = useState(false);
  const [workPrice, setWorkPrice] = useState(50);
  const [workSteps, setWorkSteps] = useState<{ title: string; promptText: string; expectedOutput: string }[]>([
    { title: "Define Goals", promptText: "Create list of goals for {{TOPIC}}", expectedOutput: "Goals report" }
  ]);

  // Comments drawer layout
  const [isCommentDrawerOpen, setIsCommentDrawerOpen] = useState(false);
  const [commentPromptId, setCommentPromptId] = useState<string>("");
  const [commentText, setCommentText] = useState("");

  // AI Lab Optmizer Interactive States
  const [labPromptText, setLabPromptText] = useState("");
  const [labPromptTitle, setLabPromptTitle] = useState("My Creative Helper");
  const [labCategory, setLabCategory] = useState("General");
  const [auditLoading, setAuditLoading] = useState(false);
  const [auditReport, setAuditReport] = useState<PromptQualityReport | null>(null);

  // Compression Interactive States
  const [compressLoading, setCompressLoading] = useState(false);
  const [compressReport, setCompressReport] = useState<PromptCompressionReport | null>(null);

  // Comparative Benchmarking Interactive States
  const [comparePromptA, setComparePromptA] = useState("Generate an email to ask for a remote job recommendation.");
  const [comparePromptB, setComparePromptB] = useState("You are an expert HR manager. Formulate a hyper-persuasive, action-driven, 3-sentence email pitching a freelance web design lead. Use lists, specify standard values, and keep it free of jargon.");
  const [compareLoading, setCompareLoading] = useState(false);
  const [compareReport, setCompareReport] = useState<PromptComparisonReport | null>(null);

  // Run Workflow Pipeline Simulation Inputs
  const [activeWorkflowRun, setActiveWorkflowRun] = useState<Workflow | null>(null);
  const [workflowVariableInput, setWorkflowVariableInput] = useState("SaaS platform for gardening enthusiasts");
  const [workflowSimulatedSteps, setWorkflowSimulatedSteps] = useState<{ stepNumber: number; title: string; runPrompt: string; output: string }[]>([]);
  const [workflowRunning, setWorkflowRunning] = useState(false);

  // Interactive Sandbox Sandbox / Custom Prompt Playground Controls
  const [customSandboxInstruction, setCustomSandboxInstruction] = useState(
    "You are a humorous tech recruiter. Provide overly sarcastic code criticism for every block the user shares."
  );
  const [sandboxHistory, setSandboxHistory] = useState<{ role: "user" | "model"; text: string }[]>([
    { role: "model", text: "Ready to roast your code snippet. Fire away!" }
  ]);
  const [sandboxMessage, setSandboxMessage] = useState("");
  const [sandboxLoading, setSandboxLoading] = useState(false);

  // Alert & Copied status Toast
  const [toastMsg, setToastMsg] = useState("");

  const categories = ["All", "Image Gen", "Code", "Marketing", "Business", "Copywriting", "Other"];

  // Fetch initial app state on mount
  const fetchState = async () => {
    try {
      const res = await fetch("/api/state");
      const data = await res.json();
      if (data) {
        setPrompts(data.prompts || []);
        setWorkflows(data.workflows || []);
        setCurrentUser(data.currentUser || currentUser);
        setUsers(data.users || {});
        setLikedPrompts(data.likedPrompts || []);
        setClonedPrompts(data.clonedPrompts || []);
      }
    } catch (e) {
      console.error("Error loaded PromptTok state from backend server:", e);
    }
  };

  useEffect(() => {
    fetchState();
  }, []);

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg("");
    }, 3800);
  };

  // Add virtual PromoCoins Daily check-in drop simulation helper
  const handleDailyCheckIn = async () => {
    try {
      const res = await fetch("/api/user/wallet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: 250 }),
      });
      const updatedUser = await res.json();
      setCurrentUser((prev) => ({
        ...prev,
        walletBalance: updatedUser.walletBalance,
        earnings: updatedUser.earnings
      }));
      triggerToast("Claimed +250 daily PromoCoins virtual gift tokens!");
    } catch (err) {
      console.error(err);
    }
  };

  // Like prompt handler call
  const handleLikePrompt = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      const res = await fetch(`/api/prompts/${id}/like`, { method: "POST" });
      const data = await res.json();
      if (data) {
        setPrompts((prev) =>
          prev.map((p) => (p.id === id ? { ...p, likes: data.prompt.likes } : p))
        );
        setLikedPrompts(data.likedPrompts);
        
        // Play subtle custom audio trigger context
        try {
          const context = new (window.AudioContext || (window as any).webkitAudioContext)();
          const osc = context.createOscillator();
          const gain = context.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(440, context.currentTime); // A4 notch
          osc.frequency.exponentialRampToValueAtTime(750, context.currentTime + 0.12);
          gain.gain.setValueAtTime(0.08, context.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.15);
          osc.connect(gain);
          gain.connect(context.destination);
          osc.start();
          osc.stop(context.currentTime + 0.18);
        } catch (e) {}

        const isNowLiked = data.likedPrompts.includes(id);
        triggerToast(isNowLiked ? "Added prompt to your favorites collection!" : "Removed liked prompt.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Remix/Copy Code snippet Clone click trigger
  const handleCopyPrompt = async (prompt: Prompt, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const res = await fetch(`/api/prompts/${prompt.id}/clone`, { method: "POST" });
      if (!res.ok) {
        const errorData = await res.json();
        triggerToast(errorData.error || "Failed to clone check balance.");
        return;
      }
      const data = await res.json();
      
      // Update prompts list & clones rating count
      setPrompts((prev) =>
        prev.map((p) => (p.id === prompt.id ? { ...p, clones: data.prompt.clones } : p))
      );
      setClonedPrompts(data.clonedPrompts);
      if (data.currentUser) {
        setCurrentUser(data.currentUser);
      }

      // Copy text to physical clipboard
      navigator.clipboard.writeText(prompt.promptText);
      
      triggerToast(`Successfully remixed: Copied original system prompt to clipboard! ${prompt.isPremium ? `Paid ${prompt.price} PromoCoins.` : ""}`);

      // Sound feedback
      try {
        const context = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = context.createOscillator();
        const gain = context.createGain();
        osc.frequency.setValueAtTime(587.33, context.currentTime); // D5
        osc.frequency.exponentialRampToValueAtTime(880, context.currentTime + 0.08);
        gain.gain.setValueAtTime(0.06, context.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.15);
        osc.connect(gain);
        gain.connect(context.destination);
        osc.start();
        osc.stop(context.currentTime + 0.15);
      } catch (e) {}

    } catch (err) {
      console.error(err);
    }
  };

  // Submit Comments
  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      const res = await fetch(`/api/prompts/${commentPromptId}/comment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: commentText }),
      });
      if (res.ok) {
        const updatedPrompt = await res.json();
        setPrompts((prev) =>
          prev.map((p) => (p.id === commentPromptId ? { ...p, comments: updatedPrompt.comments } : p))
        );
        setCommentText("");
        triggerToast("Comment posted live to community thread!");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // View count slide tracker
  const handlePromptViewedEvent = async (id: string) => {
    try {
      const res = await fetch(`/api/prompts/${id}/view`, { method: "POST" });
      const data = await res.json();
      if (data && data.views) {
        setPrompts((prev) =>
          prev.map((p) => (p.id === id ? { ...p, views: data.views } : p))
        );
      }
    } catch (e) {}
  };

  // Create prompt handler call
  const handleCreatePrompt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newText.trim()) {
      triggerToast("Please provide primary parameters for target prompt code.");
      return;
    }

    try {
      const res = await fetch("/api/prompts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle,
          description: newDesc,
          promptText: newText,
          category: newCategory,
          isPremium: newIsPremium,
          price: newPrice
        }),
      });

      if (res.ok) {
        const added = await res.json();
        setPrompts((prev) => [added, ...prev]);
        setIsNewPromptOpen(false);
        setNewTitle("");
        setNewDesc("");
        setNewText("");
        setNewIsPremium(false);
        setNewPrice(20);
        triggerToast(`Successfully indexed '${added.title}' into PromptTok feeds! AI generated rating: ${added.qualityScore}%`);
        setCurrentFeedIndex(0); // View their new prompt first
        setActiveTab("feed");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Create sequence workflow pipeline
  const handleCreateWorkflow = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!workTitle.trim()) {
      triggerToast("Pipeline title is mandatory.");
      return;
    }

    try {
      const res = await fetch("/api/workflows", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: workTitle,
          description: workDesc,
          steps: workSteps,
          category: workCategory,
          isPremium: workIsPremium,
          price: workPrice
        }),
      });

      if (res.ok) {
        const added = await res.json();
        setWorkflows((prev) => [added, ...prev]);
        setIsNewWorkflowOpen(false);
        setWorkTitle("");
        setWorkDesc("");
        setWorkSteps([{ title: "Initial Stage", promptText: "Define list regarding {{TOPIC}}", expectedOutput: "Report list" }]);
        triggerToast(`Succeeded: Pipeline workflow '${added.title}' created!`);
        setActiveTab("workflows");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Buy sequential pipeline workflow
  const handleBuyWorkflow = async (workflow: Workflow) => {
    try {
      const res = await fetch(`/api/workflows/${workflow.id}/buy`, {
        method: "POST"
      });
      if (!res.ok) {
        const err = await res.json();
        triggerToast(err.error || "Transaction error.");
        return;
      }
      const data = await res.json();
      triggerToast(data.message);
      
      setWorkflows((prev) =>
        prev.map((w) => (w.id === workflow.id ? { ...w, clones: data.workflow.clones } : w))
      );
      if (data.currentUser) {
        setCurrentUser(data.currentUser);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Run AI optimization analysis live
  const handleAuditLabPrompt = async () => {
    if (!labPromptText.trim()) {
      triggerToast("Please input some original instruction texts first.");
      return;
    }
    setAuditLoading(true);
    setAuditReport(null);

    try {
      const res = await fetch("/api/ai/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: labPromptTitle,
          promptText: labPromptText,
          category: labCategory
        })
      });
      if (res.ok) {
        const report = await res.json();
        setAuditReport(report);
        triggerToast(`Gemini Audit Report loaded successfully! Score: ${report.score}%`);
      } else {
        triggerToast("Failed to compile expert Gemini assessment checklist.");
      }
    } catch (ex) {
      console.error(ex);
    } finally {
      setAuditLoading(false);
    }
  };

  // Run Compression on lab prompt
  const handleCompressLabPrompt = async () => {
    if (!labPromptText.trim()) {
      triggerToast("Empty text prompt cannot be compressed.");
      return;
    }
    setCompressLoading(true);
    setCompressReport(null);

    try {
      const res = await fetch("/api/ai/compress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ promptText: labPromptText })
      });
      if (res.ok) {
        const doc = await res.json();
        setCompressReport(doc);
        triggerToast(`Gemini Prompt Compression Complete! Trimmed ${doc.percentageCompressed}% of raw tokens.`);
      }
    } catch (ek) {
      console.error(ek);
    } finally {
      setCompressLoading(false);
    }
  };

  // Run head-to-head prompt comparative benchmark
  const handleRunComparativeChallenge = async () => {
    if (!comparePromptA.trim() || !comparePromptB.trim()) {
      triggerToast("Two non-empty templates are required for a benchmark match.");
      return;
    }
    setCompareLoading(true);
    setCompareReport(null);

    try {
      const res = await fetch("/api/ai/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ promptA: comparePromptA, promptB: comparePromptB })
      });
      if (res.ok) {
        const report = await res.json();
        setCompareReport(report);
        triggerToast(`Comparative Battle Judgement Completed! Winner: Prompt ${report.winner}`);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setCompareLoading(false);
    }
  };

  // Play sandbox simulation response live
  const handleSendSandboxObj = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sandboxMessage.trim()) return;

    const userMsg = { role: "user" as const, text: sandboxMessage };
    setSandboxHistory((prev) => [...prev, userMsg]);
    setSandboxMessage("");
    setSandboxLoading(true);

    try {
      const res = await fetch("/api/ai/run-agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemPrompt: customSandboxInstruction,
          userMessage: sandboxMessage,
          chatHistory: sandboxHistory
        })
      });
      if (res.ok) {
        const payload = await res.json();
        setSandboxHistory((prev) => [...prev, { role: "model", text: payload.text }]);
      } else {
        setSandboxHistory((prev) => [...prev, { role: "model", text: "[Error: Could not retrieve sandbox report response. Register a valid operational key to receive live responses.]" }]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSandboxLoading(false);
    }
  };

  // Run sequence of Multi-Prompt Workflows Pipeline Sequencer simulation
  const handleTriggerPipelineRun = async (workflow: Workflow) => {
    setActiveWorkflowRun(workflow);
    setWorkflowSimulatedSteps([]);
    setWorkflowRunning(true);

    // Simulate multi-step sequential execution delays to look super technical and epic!
    for (let i = 0; i < workflow.steps.length; i++) {
      const step = workflow.steps[i];
      // Generate prompt text replacing parameter mustache placeholders
      const processedPrompt = step.promptText.replace(/\{\{STARTUP_INFO\}\}/g, workflowVariableInput).replace(/\{\{TOPIC\}\}/g, workflowVariableInput);
      
      // Delay to represent agent compute
      await new Promise((resolve) => setTimeout(resolve, 1400));

      const mockResponses = [
        `### Value Matrix Structure\n| Target Segment | Main Problem | Feature Trigger |\n| --- | --- | --- |\n| Early Hobbyists | Lacks garden mapping framework | Drag-and-Drop Virtual Garden Designer |\n| Busy Landscapers | Inefficient quote structures | Instant WhatsApp PDF Invoicer |\n\n*Successfully matched objectives with zero filler adjectives!*`,
        `### Marketing Suite Hooks\n\n1. "Stop guessing screen dimensions for backyard soil layout. The AI did the trigonometry inside 4 seconds."\n2. "Most gardening advice assumes you have 18 hours free a week. Our tool automates growth tracking in 3 minutes."\n\n*Drafted following precise high-retention structured instructions.*`,
        `### Objections & Proactive Responses\n\n- **Objection**: "I do not want another complex SaaS tool."\n- **Counter**: Integrated automatic SMS triggers, requiring no password set up.\n\n- **Objection**: "AI does not have local weed knowledge."\n- **Counter**: Leveraged regional geolocation weather APIs with fine-tuned parameters.`
      ];

      const simOutput = mockResponses[i % mockResponses.length];

      setWorkflowSimulatedSteps((p) => [
        ...p,
        {
          stepNumber: step.stepNumber,
          title: step.title,
          runPrompt: processedPrompt,
          output: simOutput
        }
      ]);
    }
    setWorkflowRunning(false);
    triggerToast(`Execution of pipeline '${workflow.title}' finalized!`);
  };

  // Reset database completely to initial state
  const resetDatabaseState = async () => {
    if (confirm("Are you sure you want to reset the platform data to defaults? This will erase custom prompts.")) {
      try {
        const res = await fetch("/api/reset-db", { method: "POST" });
        if (res.ok) {
          await fetchState();
          triggerToast("All PromptTok records restored to factory defaults.");
          setActiveTab("feed");
          setCurrentFeedIndex(0);
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Filtering list formula
  const filteredPrompts = prompts.filter((p) => {
    const matchesCategory = selectedCategory === "All" || p.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.promptText.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.creator.username.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const activePrompt: Prompt | undefined = filteredPrompts[currentFeedIndex];

  // Side event view count update triggered once index changes
  useEffect(() => {
    if (activePrompt) {
      handlePromptViewedEvent(activePrompt.id);
    }
  }, [currentFeedIndex, activePrompt?.id]);

  return (
    <div className="min-h-screen bg-[#0d0f12] text-slate-100 flex flex-col font-sans selection:bg-teal-500 selection:text-black">
      
      {/* Toast Alert Banner */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-teal-500 to-emerald-600 text-black font-semibold px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 animate-bounce border border-teal-300">
          <Sparkle className="w-5 h-5 animate-spin" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Main Top Header Navigation */}
      <header className="border-b border-slate-800 bg-[#0f1216]/95 backdrop-blur-md sticky top-0 z-40 px-4 py-3">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Logo Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 via-pink-500 to-teal-400 p-0.5 flex items-center justify-center shadow-lg shadow-pink-500/20">
              <div className="w-full h-full bg-[#111318] rounded-[10px] flex items-center justify-center">
                <span className="font-extrabold text-[#ff1d53] text-[20px] tracking-tighter">P</span>
                <span className="font-extrabold text-teal-400 text-[18px] tracking-tighter -ml-0.5">T</span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent tracking-tight">PromptTok</h1>
                <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 font-bold border border-rose-500/20 animate-pulse">LIVE</span>
              </div>
              <p className="text-[11px] text-slate-400">Discover & Remix Optimized Gemini Prompts</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center gap-1 bg-[#151921] p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => { setActiveTab("feed"); }}
              className={`px-3 py-2 text-xs font-bold rounded-lg transition-all duration-150 flex items-center gap-1.5 ${
                activeTab === "feed" ? "bg-rose-500 text-white shadow-md shadow-rose-500/20" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              TikTok Feed
            </button>
            <button
              onClick={() => { setActiveTab("workflows"); }}
              className={`px-3 py-2 text-xs font-bold rounded-lg transition-all duration-150 flex items-center gap-1.5 ${
                activeTab === "workflows" ? "bg-purple-600 text-white shadow-md shadow-purple-600/20" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              Workflows
            </button>
            <button
              onClick={() => { setActiveTab("optimize"); }}
              className={`px-3 py-2 text-xs font-bold rounded-lg transition-all duration-150 flex items-center gap-1.5 ${
                activeTab === "optimize" ? "bg-teal-500 text-slate-950 font-extrabold shadow-md shadow-teal-500/20" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              AI Optimize
            </button>
            <button
              onClick={() => { setActiveTab("compare"); }}
              className={`px-3 py-2 text-xs font-bold rounded-lg transition-all duration-150 flex items-center gap-1.5 ${
                activeTab === "compare" ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              Compare
            </button>
            <button
              onClick={() => { setActiveTab("playground"); }}
              className={`px-3 py-2 text-xs font-bold rounded-lg transition-all duration-150 flex items-center gap-1.5 ${
                activeTab === "playground" ? "bg-amber-500 text-black font-extrabold shadow-md shadow-amber-500/20" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              Playground
            </button>
            <button
              onClick={() => { setActiveTab("profile"); }}
              className={`px-3 py-2 text-xs font-bold rounded-lg transition-all duration-150 flex items-center gap-1.5 ${
                activeTab === "profile" ? "bg-slate-700 text-white" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <UserIcon className="w-3.5 h-3.5" />
              Creator Hub
            </button>
          </nav>

          {/* Coins Credit Indicator & Daily check-in button */}
          <div className="flex items-center gap-3">
            <div className="bg-[#1a1f29] rounded-xl px-3 py-1.5 border border-slate-800 flex items-center gap-2 shrink-0">
              <Coins className="w-4 h-4 text-amber-400" />
              <div className="text-left">
                <p className="text-[10px] text-slate-400 leading-none">Wallet Balance</p>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-black text-amber-300">{currentUser.walletBalance}</span>
                  <span className="text-[9px] text-amber-500 font-bold">Coins</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleDailyCheckIn}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-xs hover:scale-105 active:scale-95 transition-all duration-150 shadow-md shadow-amber-500/10 flex items-center gap-1 py-2"
            >
              <BadgeDollarSign className="w-3.5 h-3.5" />
              Daily +250
            </button>

            {/* Post Prompt Action Button */}
            <button
              onClick={() => setIsNewPromptOpen(true)}
              className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white px-3 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 shadow-lg shadow-rose-500/20 active:scale-95 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Post Prompt</span>
            </button>
          </div>

        </div>
      </header>

      {/* Main Container Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 flex flex-col gap-6">

        {/* Global Stats bar banner */}
        <div className="bg-gradient-to-r from-[#141b27] to-[#0f1420] border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-left">
            <TrendingUp className="w-5 h-5 text-rose-500" />
            <div>
              <p className="text-xs text-slate-400">Total Prompts Active</p>
              <p className="text-lg font-black text-slate-100">{prompts.length} Verified Snippets</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-6 text-xs text-slate-400">
            <div>
              <span className="text-slate-200 font-bold text-sm block">100% Client Managed</span>
              Local durable JSON db
            </div>
            <div className="w-px h-8 bg-slate-800"></div>
            <div>
              <span className="text-slate-200 font-bold text-sm block">Gemini 3.5 Engine</span>
              Automated scoring models
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={resetDatabaseState}
              className="text-[11px] text-slate-500 hover:text-rose-400 flex items-center gap-1 px-3 py-1 bg-slate-900 border border-slate-800/80 rounded-lg hover:bg-slate-950 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Platform Data
            </button>
          </div>
        </div>

        {/* TAB 1: IMMERSIVE TIKTOK FEED */}
        {activeTab === "feed" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left sidebar: Filter categories and search */}
            <div className="lg:col-span-3 bg-[#0f1217] border border-slate-800/80 rounded-2xl p-4 flex flex-col gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search prompts..."
                  className="w-full bg-[#181d26] border border-slate-800 rounded-xl px-3 py-2.5 pl-9 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-rose-500"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentFeedIndex(0);
                  }}
                />
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              </div>

              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Categories</h3>
                <div className="flex flex-col gap-1">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        setSelectedCategory(cat);
                        setCurrentFeedIndex(0);
                      }}
                      className={`text-left px-3 py-2 text-xs font-bold rounded-lg transition-all duration-150 flex items-center justify-between ${
                        selectedCategory === cat 
                          ? "bg-rose-500/10 text-rose-400 border-l-2 border-rose-500" 
                          : "text-slate-400 hover:text-slate-200 hover:bg-[#151921]"
                      }`}
                    >
                      <span>{cat}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-950 text-slate-400">
                        {cat === "All" 
                          ? prompts.length 
                          : prompts.filter(p => p.category.toLowerCase() === cat.toLowerCase()).length
                        }
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Feed navigation actions */}
              <div className="border-t border-slate-800/80 pt-4 mt-2">
                <h4 className="text-xs font-bold text-slate-400 mb-2">Feed Control</h4>
                <div className="grid grid-cols-2 gap-2 text-center">
                  <button
                    disabled={currentFeedIndex === 0}
                    onClick={() => setCurrentFeedIndex(p => Math.max(0, p - 1))}
                    className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-black text-slate-200 hover:bg-slate-800 disabled:opacity-40 transition-colors"
                  >
                    Previous <ChevronUp className="w-3 h-3 inline ml-1" />
                  </button>
                  <button
                    disabled={currentFeedIndex >= filteredPrompts.length - 1}
                    onClick={() => setCurrentFeedIndex(p => Math.min(filteredPrompts.length - 1, p + 1))}
                    className="px-3 py-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs font-black hover:bg-rose-500/20 disabled:opacity-40 transition-colors"
                  >
                    Next <ChevronDown className="w-3 h-3 inline ml-1" />
                  </button>
                </div>
                <p className="text-[10px] text-slate-500 mt-2 text-center">
                  Showing prompt {filteredPrompts.length > 0 ? currentFeedIndex + 1 : 0} of {filteredPrompts.length} matches
                </p>
              </div>

              <div className="bg-[#151a24] p-3 rounded-xl border border-slate-800 text-xs">
                <div className="flex items-center gap-1 text-slate-300 font-bold mb-1">
                  <Coins className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                  <span>PromoCoins Hub</span>
                </div>
                <p className="text-[11px] text-slate-400">Premium prompts require virtual tokens to clone. The creator automatically receives 100% of the simulated royalty!</p>
              </div>
            </div>

            {/* Middle and Right: The Main TikTok-Style vertical feed card layout */}
            <div className="lg:col-span-9 grid grid-cols-1 md:grid-cols-12 gap-6">
              
              {/* Vertical TikTok Video + Right Overlay actions: md:col-span-6 */}
              <div className="md:col-span-7 flex flex-col items-center">
                
                {filteredPrompts.length === 0 ? (
                  <div className="w-full bg-[#0f1217] rounded-3xl border border-slate-800 text-center p-12 flex flex-col items-center justify-center">
                    <AlertCircle className="w-12 h-12 text-slate-500 mb-3" />
                    <p className="font-bold text-slate-300">No matching prompts found</p>
                    <p className="text-xs text-slate-400 mt-1">Try changing your category filter or starting search filters query.</p>
                    <button
                      onClick={() => { setSelectedCategory("All"); setSearchQuery(""); }}
                      className="mt-4 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 rounded-xl"
                    >
                      Clear Filters
                    </button>
                  </div>
                ) : (
                  <div className="relative w-full aspect-[9/16] max-h-[640px] bg-black rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-800 p-0 flex items-center justify-center">
                    
                    {/* Background Loop Video to emulate TikTok aesthetic layout */}
                    <video
                      key={activePrompt?.videoPromptUrl || activePrompt?.id}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-screen"
                    >
                      <source src={activePrompt?.videoPromptUrl} type="video/mp4" />
                    </video>

                    {/* Left shadow shade overlay for text readability */}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent p-6 pt-32 text-left flex flex-col justify-end h-1/2 z-10 pointer-events-none">
                      
                      {/* Creator badge */}
                      <div className="flex items-center gap-2 mb-3 pointer-events-auto">
                        <img
                          src={activePrompt?.creator?.avatar}
                          alt={activePrompt?.creator?.name}
                          className="w-10 h-10 rounded-full border-2 border-rose-500 object-cover"
                        />
                        <div className="text-xs leading-none">
                          <p className="text-white font-black hover:underline cursor-pointer">@{activePrompt?.creator?.username}</p>
                          <p className="text-[10px] text-rose-400 mt-0.5 font-semibold">Verified Creator</p>
                        </div>
                      </div>

                      {/* Title & Description */}
                      <h2 className="text-base font-black text-white leading-tight tracking-tight mb-2 drop-shadow-md">
                        {activePrompt?.title}
                      </h2>
                      <p className="text-xs text-slate-300 line-clamp-3 bg-black/30 backdrop-blur-xs p-2 rounded-lg border border-white/5 drop-shadow-sm mb-2">
                        {activePrompt?.description}
                      </p>

                      {/* Premium Indicator Badge */}
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] px-2.5 py-1 rounded bg-[#ff1d53] text-white font-black tracking-wider uppercase">
                          {activePrompt?.category}
                        </span>
                        {activePrompt?.isPremium ? (
                          <span className="text-[10px] px-2 py-1 rounded bg-amber-400 text-black font-extrabold flex items-center gap-0.5">
                            <Coins className="w-3 h-3" /> PREMIUM ({activePrompt?.price} Coins)
                          </span>
                        ) : (
                          <span className="text-[10px] px-2 py-1 rounded bg-teal-500 text-black font-black">
                            FREE
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Absolute panel floating on right margin inside player device */}
                    <div className="absolute right-4 bottom-14 flex flex-col items-center gap-5 z-20">
                      
                      {/* Profile Bubble representation */}
                      <div className="relative mb-2">
                        <img
                          src={activePrompt?.creator?.avatar}
                          className="w-12 h-12 rounded-full border-2 border-white object-cover shadow-lg"
                        />
                        <button className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 bg-rose-500 hover:bg-rose-600 rounded-full p-1 text-white hover:scale-110 active:scale-95 transition-all">
                          <Plus className="w-3.5 h-3.5 stroke-[3px]" />
                        </button>
                      </div>

                      {/* Likes button */}
                      <div className="flex flex-col items-center">
                        <button
                          onClick={(e) => handleLikePrompt(activePrompt!.id, e)}
                          className={`w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-md shadow-lg transition-all active:scale-75 ${
                            likedPrompts.includes(activePrompt?.id || "")
                              ? "bg-rose-600 text-white"
                              : "bg-black/60 hover:bg-black/80 hover:text-rose-400 text-white"
                          }`}
                        >
                          <Heart className="w-5 h-5 fill-current" />
                        </button>
                        <span className="text-[11px] font-black text-white mt-1 drop-shadow-lg">{activePrompt?.likes}</span>
                      </div>

                      {/* Comments Drawer click */}
                      <div className="flex flex-col items-center">
                        <button
                          onClick={() => {
                            setCommentPromptId(activePrompt!.id);
                            setIsCommentDrawerOpen(true);
                          }}
                          className="w-12 h-12 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-md shadow-lg transition-all active:scale-75 cursor-pointer"
                        >
                          <MessageSquare className="w-5 h-5" />
                        </button>
                        <span className="text-[11px] font-black text-white mt-1 drop-shadow-lg">{activePrompt?.comments?.length}</span>
                      </div>

                      {/* Clone / One-click Copy script button */}
                      <div className="flex flex-col items-center">
                        <button
                          onClick={(e) => handleCopyPrompt(activePrompt!, e)}
                          className={`w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-md shadow-lg transition-all active:scale-75 ${
                            clonedPrompts.includes(activePrompt?.id || "")
                              ? "bg-teal-500 text-black border-2 border-white animate-pulse"
                              : "bg-black/60 hover:bg-black/80 text-white hover:text-teal-400"
                          }`}
                          title="Click to copy system instruction prompt structure."
                        >
                          {clonedPrompts.includes(activePrompt?.id || "") ? (
                            <Check className="w-5 h-5 stroke-[3px]" />
                          ) : (
                            <Copy className="w-5 h-5" />
                          )}
                        </button>
                        <span className="text-[11px] font-black text-white mt-1 drop-shadow-lg">
                          {activePrompt?.clones} Remixed
                        </span>
                      </div>

                      {/* Remix action triggering AI optimization panel directly */}
                      <div className="flex flex-col items-center">
                        <button
                          onClick={() => {
                            setLabPromptTitle(`Remix of ${activePrompt?.title}`);
                            setLabPromptText(activePrompt?.promptText || "");
                            setLabCategory(activePrompt?.category || "General");
                            setActiveTab("optimize");
                            triggerToast("Transferred template to AI Optimization Lab!");
                          }}
                          className="w-12 h-12 rounded-full bg-black/60 hover:bg-black/80 text-white hover:text-purple-400 flex items-center justify-center backdrop-blur-md shadow-lg transition-all active:scale-75"
                          title="Improve prompt in AI Lab Tool"
                        >
                          <Share2 className="w-5 h-5" />
                        </button>
                        <span className="text-[10px] text-slate-300 font-bold mt-1 uppercase">Remix</span>
                      </div>

                    </div>

                    {/* Views status panel */}
                    <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1.5 text-xs text-white z-10 font-mono">
                      <Eye className="w-3.5 h-3.5 text-rose-400" />
                      <span>{activePrompt?.views || 1} Views</span>
                    </div>

                    {/* Progress tracking line indicator of feed */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-800">
                      <div
                        className="bg-rose-500 h-full transition-all duration-300"
                        style={{ width: `${((currentFeedIndex + 1) / filteredPrompts.length) * 100}%` }}
                      ></div>
                    </div>

                  </div>
                )}
              </div>

              {/* Right panel: Prompt Text Details & Quality Grade cards: md:col-span-5 */}
              {activePrompt && (
                <div className="md:col-span-5 flex flex-col gap-5 text-left">
                  
                  {/* Detailed original System Prompt template block */}
                  <div className="bg-[#0f1217] border border-slate-800 rounded-2xl p-5 flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                        <Code className="w-4 h-4 text-rose-500" />
                        Prompt Template
                      </h4>
                      <button
                        onClick={(e) => handleCopyPrompt(activePrompt, e)}
                        className="text-xs text-teal-400 hover:text-white flex items-center gap-1 font-bold"
                      >
                        <Copy className="w-3 h-3" /> Copy Snippet
                      </button>
                    </div>

                    <div className="relative group mt-1">
                      <div className="bg-[#151921] border border-slate-800/80 rounded-xl p-4 font-mono text-xs text-slate-300 overflow-x-auto max-h-[180px] break-words whitespace-pre-wrap leading-relaxed select-all">
                        {activePrompt.promptText}
                      </div>
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900/90 text-white px-2 py-1 rounded text-[10px] pointer-events-none">
                        Double-click to select all
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
                      <span>Approx {Math.ceil(activePrompt.promptText.length / 4)} tokens saved</span>
                      <span>Durable Sandbox Ready</span>
                    </div>
                  </div>

                  {/* Gemini Quality Assessment Report dashboard card */}
                  <div className="bg-[#0f1217] border border-slate-800 rounded-2xl p-5 flex flex-col gap-4">
                    <div className="flex items-center gap-2">
                      <Award className="w-5 h-5 text-teal-400" />
                      <h4 className="text-sm font-bold text-slate-200">Gemini Automated Grade</h4>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-left">
                        <span className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">
                          {activePrompt.qualityScore || 85}%
                        </span>
                        <span className="text-xs text-slate-400 block mt-1">Prompt Engineering Score</span>
                      </div>
                      <div className="w-24 h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-teal-400 to-emerald-400 h-full"
                          style={{ width: `${activePrompt.qualityScore || 85}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="bg-[#151921] rounded-xl p-3 border border-slate-800/50 text-xs text-slate-300 overflow-y-auto max-h-[190px] prose prose-invert">
                      {activePrompt.qualityFeedback ? (
                        <div className="space-y-2 whitespace-pre-wrap font-sans leading-relaxed">
                          {activePrompt.qualityFeedback}
                        </div>
                      ) : (
                        <p className="text-slate-400 italic">No feedback requested for this custom prompt yet. Click "Remix" to run live Gemini diagnostics!</p>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setCustomSandboxInstruction(activePrompt.promptText);
                          setSandboxHistory([
                            { role: "model", text: `I am now running live with custom system instruction:\n"${activePrompt.promptText.slice(0, 80)}..."\n\nHow can I help you today?` }
                          ]);
                          setActiveTab("playground");
                          triggerToast("Copied prompt instruction to interactive chat playground!");
                        }}
                        className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 font-black text-xs px-4 py-2.5 rounded-xl hover:scale-103 active:scale-97 transition-all flex items-center justify-center gap-1.5"
                      >
                        <Play className="w-3.5 h-3.5" />
                        Test in Playground
                      </button>
                    </div>
                  </div>

                </div>
              )}

            </div>
          </div>
        )}


        {/* TAB 2: MULTI-PROMPT SEQUENTIAL WORKFLOWS MARKETPLACE */}
        {activeTab === "workflows" && (
          <div className="space-y-6">
            
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-left">
                <h2 className="text-2xl font-black text-white flex items-center gap-2">
                  <Layers className="w-6 h-6 text-purple-500" />
                  Multi-Prompt Pipeline Marketplace
                </h2>
                <p className="text-slate-400 text-sm">Chain sequential AI instructions together. Input variables once and execute complete agent roadmaps.</p>
              </div>
              <button
                onClick={() => setIsNewWorkflowOpen(true)}
                className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-black flex items-center gap-2 active:scale-95 transition-all w-full md:w-auto"
              >
                <PlusCircle className="w-4 h-4" />
                Construct New Pipeline
              </button>
            </div>

            {/* Pipeline Sequencer Split Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left Side: Pipeline list (lg:col-span-8) */}
              <div className="lg:col-span-8 space-y-4">
                {workflows.length === 0 ? (
                  <div className="bg-[#0f1217] rounded-2xl border border-slate-800 p-8 text-center">
                    <p className="text-slate-400 text-sm">No custom workflows created yet. Click "Construct New Pipeline" to register one.</p>
                  </div>
                ) : (
                  workflows.map((flow) => {
                    const ownsWorkflow = flow.creator.username === currentUser.username || (currentUser.walletBalance >= (flow.price || 0));
                    return (
                      <div
                        key={flow.id}
                        className={`bg-[#0f1217] border rounded-2xl p-5 hover:border-slate-700 transition-all ${
                          activeWorkflowRun?.id === flow.id ? "border-purple-500 shadow-lg shadow-purple-500/5 ring-1 ring-purple-500/20" : "border-slate-800"
                        }`}
                      >
                        <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                          <div className="text-left">
                            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 font-bold border border-purple-500/20 mr-2">
                              {flow.category}
                            </span>
                            <h3 className="text-base font-black text-slate-100 inline-block mt-1">{flow.title}</h3>
                            <p className="text-xs text-slate-400 mt-1 leading-relaxed">{flow.description}</p>
                          </div>

                          <div className="flex items-center gap-2">
                            {flow.isPremium ? (
                              <span className="px-2.5 py-1 rounded bg-amber-400/10 text-amber-300 border border-amber-400/20 text-xs font-extrabold flex items-center gap-1">
                                <Coins className="w-3 h-3 text-amber-400" />
                                {flow.price} Coins
                              </span>
                            ) : (
                              <span className="px-2.5 py-1 rounded bg-teal-500/10 text-teal-400 border border-teal-500/20 text-xs font-black">
                                FREE
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Sequencer Pipeline Visualizer Nodes */}
                        <div className="my-4 bg-slate-950/60 p-4 rounded-xl border border-slate-900 flex flex-col md:flex-row items-stretch justify-between gap-4">
                          {flow.steps.map((st, idx) => (
                            <div key={idx} className="flex-1 flex flex-col md:flex-row items-center gap-3">
                              <div className="bg-[#151921] border border-slate-800 rounded-lg p-3 text-left w-full relative">
                                <span className="absolute -top-2.5 -left-2 w-5 h-5 rounded-full bg-purple-600 text-[10px] text-white font-black flex items-center justify-center border border-[#0d0f12]">
                                  {st.stepNumber}
                                </span>
                                <p className="text-[11px] font-black text-slate-300 truncate mt-1">{st.title}</p>
                                <p className="text-[9px] text-slate-500 font-mono truncate mt-0.5">{st.promptText}</p>
                              </div>
                              {idx < flow.steps.length - 1 && (
                                <ArrowRight className="w-4 h-4 text-slate-600 shrink-0 transform rotate-90 md:rotate-0" />
                              )}
                            </div>
                          ))}
                        </div>

                        {/* Trigger / Unlock Options */}
                        <div className="flex items-center justify-between border-t border-slate-800/80 pt-3 mt-4 text-xs">
                          <div className="flex items-center gap-2">
                            <img src={flow.creator.avatar} className="w-6 h-6 rounded-full object-cover" />
                            <span className="text-slate-400 font-bold text-[11px]">Crafted by @{flow.creator.username}</span>
                          </div>

                          <div className="flex gap-2">
                            {flow.isPremium && flow.creator.username !== currentUser.username ? (
                              <button
                                onClick={() => handleBuyWorkflow(flow)}
                                className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 text-xs font-extrabold rounded-lg flex items-center gap-1 active:scale-95 transition-all"
                              >
                                <Coins className="w-3.5 h-3.5" />
                                Unlock to Execute
                              </button>
                            ) : null}

                            <button
                              onClick={() => handleTriggerPipelineRun(flow)}
                              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-black rounded-lg flex items-center gap-1.5 active:scale-95 transition-all"
                            >
                              <Play className="w-3.5 h-3.5" />
                              Simulate Run Sequence
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Right Side: Interactive Pipeline Runner Output (lg:col-span-4) */}
              <div className="lg:col-span-4 space-y-4 sticky top-24">
                <div className="bg-[#0f1217] border border-slate-800 rounded-2xl p-5 text-left">
                  <h3 className="text-sm font-bold text-slate-200 mb-2 flex items-center gap-1.5">
                    <Terminal className="w-4 h-4 text-purple-400" />
                    Seq Pipeline Run Panel
                  </h3>
                  
                  {activeWorkflowRun ? (
                    <div className="space-y-4">
                      <div className="p-3 bg-purple-950/20 rounded-xl border border-purple-500/20 text-xs">
                        <p className="text-slate-400 leading-tight">Currently Run Sequence:</p>
                        <p className="font-extrabold text-purple-400 text-sm mt-0.5">{activeWorkflowRun.title}</p>
                      </div>

                      {/* Variable Inputs */}
                      <div>
                        <label className="text-[11px] font-black text-slate-400 uppercase block mb-1">DYNAMIC PIPELINE PARAMETERS</label>
                        <input
                          type="text"
                          className="w-full bg-[#151921] border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-purple-500"
                          value={workflowVariableInput}
                          onChange={(e) => setWorkflowVariableInput(e.target.value)}
                          placeholder="Inject variable text..."
                        />
                        <p className="text-[10px] text-slate-500 mt-1">This context replaces any <code className="text-slate-400 font-mono">{"{{STARTUP_INFO}}"}</code> occurrences</p>
                      </div>

                      <div className="border-t border-slate-800/80 pt-3">
                        <button
                          onClick={() => handleTriggerPipelineRun(activeWorkflowRun)}
                          disabled={workflowRunning}
                          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:opacity-40 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95"
                        >
                          {workflowRunning ? "Agent Computing Steps..." : "Execute Chain Pipeline"}
                        </button>
                      </div>

                      {/* Step Execution Logs */}
                      <div className="space-y-3 mt-2">
                        <p className="text-[11px] font-black text-slate-400 uppercase block">EXECUTION TRACE OVERVIEW</p>
                        
                        {workflowSimulatedSteps.length === 0 && !workflowRunning && (
                          <p className="text-xs text-slate-500 italic">No runs executed yet. Fill keywords above and hit Execute.</p>
                        )}

                        {workflowRunning && workflowSimulatedSteps.length < activeWorkflowRun.steps.length && (
                          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center gap-2 text-xs text-slate-400 animate-pulse">
                            <Sparkle className="w-4 h-4 text-purple-500 animate-spin" />
                            <span>Synthesizing output for step {workflowSimulatedSteps.length + 1}...</span>
                          </div>
                        )}

                        {workflowSimulatedSteps.map((log, lidx) => (
                          <div key={lidx} className="bg-slate-950 rounded-xl p-3 border border-slate-800 text-xs">
                            <div className="flex items-center gap-2 mb-1.5">
                              <span className="text-[10px] font-black bg-purple-600 text-white rounded px-1.5">Step {log.stepNumber}</span>
                              <span className="font-bold text-slate-300">{log.title}</span>
                            </div>
                            <div className="text-[10px] text-slate-500 font-mono bg-[#111] p-1.5 rounded border border-slate-900/80 mb-2 truncate">
                              PROMPT: {log.runPrompt}
                            </div>
                            <div className="text-slate-300 whitespace-pre-wrap font-sans prose prose-sm leading-relaxed p-2 bg-[#121620] border-l-2 border-purple-500 rounded">
                              {log.output}
                            </div>
                          </div>
                        ))}
                      </div>

                    </div>
                  ) : (
                    <div className="text-center p-6 bg-slate-900/40 rounded-xl border border-dashed border-slate-800">
                      <p className="text-xs text-slate-500 leading-relaxed">Select any Pipeline Workflow from the list and click "Simulate Run Sequence" to preview multi-prompt execution!</p>
                    </div>
                  )}

                </div>
              </div>

            </div>
          </div>
        )}


        {/* TAB 3: AI LAB OPTIMIZER (QUALITY DISGNOSTIC & AUTO-COMPRESSION) */}
        {activeTab === "optimize" && (
          <div className="space-y-6">
            
            <div className="text-left">
              <h2 className="text-2xl font-black text-white flex items-center gap-2">
                <Sparkles className="w-7 h-7 text-teal-400" />
                Gemini AI Optimization and Diagnostic Laboratory
              </h2>
              <p className="text-slate-400 text-sm">Fine-tune system instructions, optimize variable scopes, and compress tokens live via Google Gemini API.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left Side: Input Arena */}
              <div className="lg:col-span-7 bg-[#0f1217] border border-slate-800 rounded-2xl p-6 text-left space-y-4">
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1">PROMPT WORKSPACE TITLE</label>
                    <input
                      type="text"
                      className="w-full bg-[#151921] border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-teal-500"
                      value={labPromptTitle}
                      onChange={(e) => setLabPromptTitle(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1">CATEGORY FILTER</label>
                    <select
                      className="w-full bg-[#151921] border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-teal-500"
                      value={labCategory}
                      onChange={(e) => setLabCategory(e.target.value)}
                    >
                      <option value="Image Gen">Image Gen</option>
                      <option value="Code">Code</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Business">Business</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1">ORIGINAL TARGET PROMPT TEXT</label>
                  <textarea
                    rows={8}
                    className="w-full bg-[#151921] border border-slate-800 rounded-xl p-4 font-mono text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-rose-500 leading-relaxed"
                    value={labPromptText}
                    onChange={(e) => setLabPromptText(e.target.value)}
                    placeholder="Paste or write your raw system prompt or visual Midjourney query right here..."
                  />
                  <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
                    <span>Approx {Math.ceil(labPromptText.length / 4)} original vocabulary tokens</span>
                    <span>Supports variable placeholders (e.g. {"{{TOPIC}}"})</span>
                  </div>
                </div>

                <div className="bg-[#151a24] p-3 rounded-xl border border-slate-800 text-xs">
                  <div className="flex items-center gap-1.5 text-slate-300 font-bold mb-1">
                    <AlertCircle className="w-4 h-4 text-rose-500" />
                    <span>How it works</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    <strong>Score & Quality Audit:</strong> Evaluates prompt against clarity, structure boundaries & output determinism rules.
                    <br />
                    <strong>Compress Context:</strong> Strips redundant filler text to save budget tokens while maintaining 100% semantic alignment.
                  </p>
                </div>

                {/* Submits buttons */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={handleAuditLabPrompt}
                    disabled={auditLoading || compressLoading}
                    className="bg-teal-500 hover:bg-teal-600 disabled:opacity-40 text-slate-950 font-black text-xs px-4 py-3 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Award className="w-4 h-4" />
                    {auditLoading ? "Gemini Auditing..." : "Calculate Quality Score"}
                  </button>

                  <button
                    onClick={handleCompressLabPrompt}
                    disabled={auditLoading || compressLoading}
                    className="bg-slate-900 border border-slate-700 hover:bg-slate-800 hover:text-white disabled:opacity-40 text-slate-300 font-extrabold text-xs px-4 py-3 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Scissors className="w-4 h-4" />
                    {compressLoading ? "Compressing..." : "Compress Token Budget"}
                  </button>
                </div>

              </div>

              {/* Right Side: Analysis Grade Results */}
              <div className="lg:col-span-5 space-y-4">
                
                {/* Audit Quality Report Panel */}
                {auditReport && (
                  <div className="bg-[#0f1217] border border-teal-500/30 rounded-2xl p-5 text-left space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <h3 className="font-bold text-slate-200 text-sm flex items-center gap-1">
                        <Award className="w-4 h-4 text-teal-400" />
                        Diagnostic Evaluation
                      </h3>
                      <span className="text-xl font-black text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20">{auditReport.score}%</span>
                    </div>

                    {/* Quality score criteria values */}
                    <div className="space-y-2 mt-2">
                      <div>
                        <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                          <span>Instructional Clarity</span>
                          <span className="font-bold text-slate-200">{auditReport.clarity || 80}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-teal-400" style={{ width: `${auditReport.clarity || 80}%` }}></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                          <span>Syntactic Structure</span>
                          <span className="font-bold text-slate-200">{auditReport.structure || 75}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-teal-400" style={{ width: `${auditReport.structure || 75}%` }}></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                          <span>Negative Constraints</span>
                          <span className="font-bold text-slate-200">{auditReport.specificity || 85}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-teal-400" style={{ width: `${auditReport.specificity || 85}%` }}></div>
                        </div>
                      </div>
                    </div>

                    {/* Markdown structured feedback */}
                    <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl max-h-[190px] overflow-y-auto text-xs text-slate-300 whitespace-pre-wrap leading-relaxed prose prose-invert">
                      {auditReport.feedback}
                    </div>

                    {/* Improved Version output */}
                    {auditReport.optimizedPrompt && (
                      <div className="space-y-2 border-t border-slate-800/80 pt-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-teal-400 uppercase block">GEMINI OPTIMIZED EQUIVALENT</span>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(auditReport.optimizedPrompt);
                              triggerToast("Copied optimized equivalent prompt to clipboard!");
                            }}
                            className="text-[10px] text-slate-400 hover:text-white flex items-center gap-1"
                          >
                            <Copy className="w-3 h-3" /> Copy Clean Improved
                          </button>
                        </div>
                        <div className="bg-slate-950 p-3 rounded-lg text-xs font-mono text-slate-300 max-h-[130px] overflow-y-auto border border-slate-900-50 select-all leading-relaxed break-words whitespace-pre-wrap select-all">
                          {auditReport.optimizedPrompt}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Token Compress Report panel */}
                {compressReport && (
                  <div className="bg-[#0f1217] border border-amber-500/20 rounded-2xl p-5 text-left space-y-4">
                    <div className="flex items-center justify-between border-b border-rose-800 pb-2">
                      <h3 className="font-bold text-slate-200 text-sm flex items-center gap-1">
                        <Scissors className="w-4 h-4 text-amber-400" />
                        Prompt Compression Results
                      </h3>
                      <span className="text-xs font-black text-amber-300 bg-amber-500/15 px-2.5 py-1.5 rounded-lg border border-amber-500/20">
                        -{compressReport.percentageCompressed}% Savings
                      </span>
                    </div>

                    {/* Stats metrics */}
                    <div className="grid grid-cols-2 gap-3 text-center">
                      <div className="bg-[#151921] p-3 rounded-xl border border-slate-800">
                        <span className="text-slate-400 text-[10px] block">ORIGINAL ESTIMATED BUDGET</span>
                        <span className="text-sm font-extrabold text-slate-200">{compressReport.originalTokens} Tokens</span>
                      </div>
                      <div className="bg-[#151921] p-3 rounded-xl border border-slate-800">
                        <span className="text-slate-400 text-[10px] block">COMPRESSED ULTRA-DENSE</span>
                        <span className="text-sm font-extrabold text-amber-300">{compressReport.compressedTokens} Tokens</span>
                      </div>
                    </div>

                    {/* Trim description */}
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-900/60 text-xs text-slate-400 italic leading-relaxed">
                      <strong>AI Explanation: </strong> {compressReport.explanation}
                    </div>

                    {/* Dense prompt output code block */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">COMPRESSED PROMPT SNIPPET</span>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(compressReport.compressedPrompt);
                            triggerToast("Compressed dense prompt copied successfully!");
                          }}
                          className="text-[10px] text-slate-300 hover:text-white flex items-center gap-1"
                        >
                          <Copy className="w-3 h-3" /> Copy Compact Code
                        </button>
                      </div>
                      <div className="bg-slate-950 p-3 rounded-lg border border-slate-900 text-xs font-mono text-slate-300 max-h-[140px] overflow-y-auto leading-relaxed break-all whitespace-pre-wrap">
                        {compressReport.compressedPrompt}
                      </div>
                    </div>
                  </div>
                )}

                {/* Stale Placeholder instruction */}
                {!auditReport && !compressReport && (
                  <div className="bg-slate-900/20 rounded-2xl border border-dashed border-slate-800/80 p-8 text-center h-64 flex flex-col items-center justify-center">
                    <Sparkle className="w-8 h-8 text-slate-600 mb-2 animate-spin" />
                    <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">Calculate quality dimensions or optimize context tokens to receive live interactive metrics reports.</p>
                  </div>
                )}

              </div>

            </div>
          </div>
        )}


        {/* TAB 4: SYSTEM COMPARISON BATTLE PANEL */}
        {activeTab === "compare" && (
          <div className="space-y-6">
            
            <div className="text-left">
              <h2 className="text-2xl font-black text-white flex items-center gap-2">
                <Sliders className="w-7 h-7 text-indigo-400 animate-pulse" />
                Prompt Comparative Arena (H2H Battle Trial)
              </h2>
              <p className="text-slate-400 text-sm">Compare two prompts head-to-head. Decide a mechanical winner, evaluate syntax variations, and simulate response outputs side-by-side.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left Column: Side-by-Side Prompt editors */}
              <div className="lg:col-span-8 bg-[#0f1217] border border-slate-800 rounded-2xl p-6 text-left space-y-4">
                
                <p className="text-xs text-slate-400">Put your baseline simple prompt (Prompt A) in the left arena. Inject specialized directives/roles to create (Prompt B) on the right to compare relative quality.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Prompt A */}
                  <div className="space-y-1.5 animate-fade-in">
                    <div className="bg-rose-500/10 text-rose-400 border border-rose-500/20 px-3 py-1 rounded text-[10px] font-black uppercase text-center">
                      MATCH CONTENDER: PROMPT A
                    </div>
                    <textarea
                      rows={10}
                      className="w-full bg-[#151921] border border-slate-800 rounded-xl p-3 font-mono text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-rose-500 focus:border-rose-500 leading-relaxed"
                      value={comparePromptA}
                      onChange={(e) => setComparePromptA(e.target.value)}
                    />
                  </div>

                  {/* Prompt B */}
                  <div className="space-y-1.5">
                    <div className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-3 py-1 rounded text-[10px] font-black uppercase text-center">
                      MATCH CONTENDER: PROMPT B
                    </div>
                    <textarea
                      rows={10}
                      className="w-full bg-[#151921] border border-slate-800 rounded-xl p-3 font-mono text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 leading-relaxed"
                      value={comparePromptB}
                      onChange={(e) => setComparePromptB(e.target.value)}
                    />
                  </div>
                </div>

                <div className="border-t border-slate-800/80 pt-4 flex justify-end">
                  <button
                    onClick={handleRunComparativeChallenge}
                    disabled={compareLoading}
                    className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white text-xs font-black px-6 py-3 rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg shadow-indigo-600/10"
                  >
                    <Sliders className="w-4 h-4 animate-spin" />
                    {compareLoading ? "Benchmarking Battle..." : "Run Head-to-Head Comparative Battle"}
                  </button>
                </div>

              </div>

              {/* Right Column: Comparative results */}
              <div className="lg:col-span-4 space-y-4">
                
                {compareReport ? (
                  <div className="bg-[#0f1217] border border-indigo-500/30 rounded-2xl p-5 text-left space-y-4">
                    
                    {/* Winner announcement header */}
                    <div className="bg-gradient-to-r from-teal-500/20 to-indigo-600/20 border border-indigo-500/30 rounded-xl p-4 text-center">
                      <Award className="w-8 h-8 text-teal-400 mx-auto mb-1 stroke-[2.5px]" />
                      <p className="text-[10px] text-indigo-300 font-bold uppercase tracking-wider leading-none">JUDGEMENT DECISION</p>
                      <p className="text-lg font-black text-white mt-1">
                        Winner selected: <span className="text-teal-400 font-extrabold text-xl">PROMPT {compareReport.winner}</span>
                      </p>
                      <p className="text-[11px] text-slate-300 mt-1 leading-relaxed text-left max-h-[140px] overflow-y-auto whitespace-pre-line bg-black/40 p-2 rounded border border-white/5 font-sans">
                        {compareReport.winningReason}
                      </p>
                    </div>

                    {/* Scores comparatives bars */}
                    <div className="grid grid-cols-2 gap-4">
                      
                      <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
                        <span className="text-slate-400 text-[10px] block">PROMPT A GRADE</span>
                        <span className="text-xl font-bold tracking-tight text-rose-400">{compareReport.promptA_Score}%</span>
                        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mt-1">
                          <div className="h-full bg-rose-400" style={{ width: `${compareReport.promptA_Score}%` }}></div>
                        </div>
                      </div>

                      <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
                        <span className="text-slate-400 text-[10px] block">PROMPT B GRADE</span>
                        <span className="text-xl font-bold tracking-tight text-indigo-400">{compareReport.promptB_Score}%</span>
                        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mt-1">
                          <div className="h-full bg-indigo-400" style={{ width: `${compareReport.promptB_Score}%` }}></div>
                        </div>
                      </div>

                    </div>

                    {/* Critique specifications layout */}
                    <div className="space-y-2 border-t border-slate-800/80 pt-3">
                      <span className="text-[10px] text-indigo-300 font-bold uppercase tracking-wider block">CRITERIA SCORE CARD</span>
                      <div className="space-y-2">
                        {compareReport.comparisonTable?.map((crit, cIdx) => (
                          <div key={cIdx} className="bg-slate-950 p-2.5 rounded-lg border border-slate-900 text-[11px]">
                            <p className="font-extrabold text-slate-200 mb-1">{crit.criteria}</p>
                            <p className="text-rose-400 italic">Prompt A: {crit.promptA_Eval}</p>
                            <p className="text-indigo-400 italic mt-1 font-semibold">Prompt B: {crit.promptB_Eval}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                ) : (
                  <div className="bg-slate-900/20 border border-dashed border-slate-800/80 rounded-2xl p-8 text-center h-80 flex flex-col items-center justify-center">
                    <Sliders className="w-8 h-8 text-slate-600 mb-2 animate-bounce" />
                    <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">Launch a comparative diagnostics run to inspect head-to-head scorecards and automated winner analysis report files.</p>
                  </div>
                )}

              </div>
            </div>

            {/* Simulated Response outputs side-by-side comparison below */}
            {compareReport && (
              <div className="bg-[#0f1217] border border-slate-800 rounded-2xl p-6 text-left space-y-4">
                <h3 className="font-bold text-slate-200 text-sm flex items-center gap-1.5">
                  <Sliders className="w-4 h-4 text-teal-400" />
                  Expected Model Output Comparative Visualizer
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">Simulates standard response outcomes demonstrating structural discrepancies created by advanced syntax optimizations under standard model executions.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Simulated output for A */}
                  <div className="bg-[#151921] border border-slate-800 p-4 rounded-xl space-y-2">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 font-bold">PROMPT A REACTION</span>
                    <div className="text-xs font-mono text-slate-400 whitespace-pre-wrap leading-relaxed max-h-[160px] overflow-y-auto">
                      {compareReport.simulatedOutputA}
                    </div>
                  </div>

                  {/* Simulated output for B */}
                  <div className="bg-[#151921] border border-slate-800 p-4 rounded-xl space-y-2">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 font-bold">PROMPT B REACTION</span>
                    <div className="text-xs font-mono text-slate-200 whitespace-pre-wrap leading-relaxed max-h-[160px] overflow-y-auto">
                      {compareReport.simulatedOutputB}
                    </div>
                  </div>

                </div>
              </div>
            )}

          </div>
        )}


        {/* TAB 5: PLAYGROUND / ACTIVE AGENT RUNNER */}
        {activeTab === "playground" && (
          <div className="space-y-6">
            
            <div className="text-left">
              <h2 className="text-2xl font-black text-white flex items-center gap-2">
                <Terminal className="w-7 h-7 text-amber-400" />
                Durable System Playground Sandbox
              </h2>
              <p className="text-slate-400 text-sm">Assign a system identity below and interact with an active model sandbox directly inside PromptTok. Test parameters, variables and tone filters.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left sidebar instructions parameters (lg:col-span-4) */}
              <div className="lg:col-span-4 bg-[#0f1217] border border-slate-800 rounded-2xl p-5 text-left space-y-4">
                
                <div className="space-y-1">
                  <label className="text-[11px] font-black text-amber-400 uppercase tracking-wider block">SYSTEM RULES IDENTITY</label>
                  <p className="text-[10px] text-slate-400 mb-2">Configure custom rules the AI model will commit to strictly during active discussions.</p>
                  <textarea
                    rows={8}
                    className="w-full bg-[#151921] border border-slate-800 rounded-xl p-3 font-mono text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500 leading-relaxed"
                    value={customSandboxInstruction}
                    onChange={(e) => setCustomSandboxInstruction(e.target.value)}
                    placeholder="Enter system prompt identities..."
                  />
                </div>

                <div className="border-t border-slate-800/80 pt-4 space-y-2">
                  <button
                    onClick={() => {
                      setSandboxHistory([
                        { role: "model", text: "[System Identity has been refreshed. State memory reset. Type a message on the right to start!]" }
                      ]);
                      triggerToast("Sandbox chat state memory flushed!");
                    }}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-slate-300 font-extrabold text-xs px-4 py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all active:scale-95 border border-slate-800"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Reset Sandbox Chat State
                  </button>
                  <p className="text-[10px] text-slate-500 text-center">Refreshing identity flushes current thread memory to prevent system parameter dilution.</p>
                </div>

                <div className="bg-[#181d26] rounded-xl p-3.5 border border-slate-800 text-xs">
                  <div className="flex items-center gap-1.5 text-slate-300 font-bold mb-1">
                    <Compass className="w-4 h-4 text-amber-400 animate-spin" />
                    <span>Gemini Grounding Mode</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">While standard models operate in offline-simulation parameters, activating systemic models using standard instructions operates on full operational capabilities.</p>
                </div>

              </div>

              {/* Right column: The interactive messaging chat interface (lg:col-span-8) */}
              <div className="lg:col-span-8 bg-[#0f1217] border border-slate-800 rounded-2xl p-5 flex flex-col min-h-[500px]">
                
                {/* Chat header identity representation */}
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-4">
                  <div className="text-left flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse"></div>
                    <div>
                      <h3 className="font-extrabold text-slate-200 text-xs uppercase tracking-wider">Active Sandbox Context</h3>
                      <p className="text-[10px] text-slate-400 mt-0.5 truncate max-w-sm font-mono">{customSandboxInstruction.slice(0, 90)}...</p>
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 border border-slate-800 font-mono text-slate-400">Sandbox v1.0.4</span>
                </div>

                {/* Messages pane */}
                <div className="flex-1 overflow-y-auto space-y-4 pr-1 max-h-[360px] text-xs">
                  {sandboxHistory.map((chat, cIdx) => (
                    <div
                      key={cIdx}
                      className={`flex flex-col max-w-[85%] whitespace-pre-wrap leading-relaxed p-3.5 rounded-2xl ${
                        chat.role === "user"
                          ? "ml-auto bg-amber-500 text-slate-950 font-bold items-end rounded-tr-none"
                          : "mr-auto bg-[#151921] border border-slate-800 rounded-tl-none text-left"
                      }`}
                    >
                      <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block mb-1">
                        {chat.role === "user" ? "You (Dynamic Message)" : "Assigned Identity Agent Output"}
                      </span>
                      <p className="font-sans leading-relaxed">{chat.text}</p>
                    </div>
                  ))}

                  {sandboxLoading && (
                    <div className="mr-auto bg-[#151921] border border-slate-800 rounded-2xl rounded-tl-none p-3.5 space-y-2 animate-pulse text-left max-w-[85%]">
                      <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">Evaluating logical constraints...</span>
                      <div className="flex items-center gap-2 text-slate-400">
                        <Sparkle className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                        <span>Composing responsive report payload...</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* New Input Arena */}
                <form onSubmit={handleSendSandboxObj} className="mt-4 pt-3 border-t border-slate-800/80 flex items-center gap-2">
                  <input
                    type="text"
                    disabled={sandboxLoading}
                    className="flex-1 bg-[#151921] border border-slate-800 rounded-xl px-3 py-3 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    placeholder="Provide sample constraints input and hit send..."
                    value={sandboxMessage}
                    onChange={(e) => setSandboxMessage(e.target.value)}
                  />
                  <button
                    type="submit"
                    disabled={sandboxLoading || !sandboxMessage.trim()}
                    className="bg-amber-500 hover:bg-amber-600 disabled:opacity-40 text-slate-950 font-black p-3.5 rounded-xl transition-all active:scale-95"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>

              </div>

            </div>
          </div>
        )}


        {/* TAB 6: CUSTOM USER PROFILE / CREATOR HUB */}
        {activeTab === "profile" && (
          <div className="space-y-6">
            
            {/* Header branding profile block */}
            <div className="bg-[#0f1217] border border-slate-800 rounded-3xl p-6 md:p-8 text-left relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
              
              {/* Profile details */}
              <div className="flex flex-col md:flex-row items-center gap-5 z-10">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-24 h-24 rounded-full border-4 border-rose-500/30 object-cover"
                />
                <div className="text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-2">
                    <h2 className="text-2xl font-black text-white">{currentUser.name}</h2>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 font-bold border border-rose-500/20">Guest Host Tier</span>
                  </div>
                  <p className="text-slate-400 text-xs mt-1">@{currentUser.username}</p>
                  <p className="text-slate-300 text-xs mt-2 max-w-md">{currentUser.bio}</p>

                  <div className="flex items-center justify-center md:justify-start gap-4 mt-3">
                    <span className="text-xs text-slate-400">
                      <strong className="text-slate-200">{currentUser.followers}</strong> Followers
                    </span>
                    <span className="text-xs text-slate-400">
                      <strong className="text-slate-200">{currentUser.following}</strong> Following
                    </span>
                    <span className="text-xs text-rose-400">
                      <strong className="text-slate-200">{currentUser.earnings}</strong> Coins Earned
                    </span>
                  </div>
                </div>
              </div>

              {/* Action monetization buttons */}
              <div className="bg-[#151921] border border-slate-800 p-5 rounded-2xl text-left min-w-[240px] z-10 w-full md:w-auto">
                <p className="text-xs text-slate-400 font-bold mb-1.5 uppercase">Estimated Coins Balance</p>
                <div className="flex items-center gap-2 mb-3">
                  <Coins className="w-5 h-5 text-amber-400" />
                  <span className="text-2xl font-black text-amber-300">{currentUser.walletBalance} Coins</span>
                </div>
                <div className="space-y-1">
                  <button
                    onClick={handleDailyCheckIn}
                    className="w-full py-2 bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 font-black text-xs rounded-xl hover:scale-103 active:scale-97 transition-all flex items-center justify-center gap-1.5"
                  >
                    Claim Daily Free Drop Coins
                  </button>
                  <p className="text-[9px] text-slate-500 mt-1 text-center">Resets every 24 hours locally.</p>
                </div>
              </div>

              {/* Ambient radial shader behind elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/5 rounded-full blur-3xl pointer-events-none"></div>

            </div>

            {/* Creations split Grid listing personal posted elements */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Prompts uploaded by guest */}
              <div className="lg:col-span-12 space-y-4">
                <h3 className="text-base font-black text-slate-200 text-left flex items-center gap-1.5">
                  <Compass className="w-5 h-5 text-rose-500" />
                  Index of Your Custom Promps ({prompts.filter(p => p.creator.username === currentUser.username).length})
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {prompts.filter(p => p.creator.username === currentUser.username).map((prompt) => (
                    <div key={prompt.id} className="bg-[#0f1217] border border-slate-800/80 rounded-2xl p-4 text-left flex flex-col justify-between hover:border-slate-700 transition-all">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] px-2 py-0.5 rounded bg-slate-950 text-slate-400 font-bold">
                            {prompt.category}
                          </span>
                          <span className="text-xs text-slate-500 font-mono">Score: {prompt.qualityScore}%</span>
                        </div>
                        <h4 className="font-extrabold text-white text-sm line-clamp-1">{prompt.title}</h4>
                        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{prompt.description}</p>
                        
                        <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-900 text-[11px] font-mono text-slate-300 truncate">
                          {prompt.promptText}
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-800 pb-0.5 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5" /> {prompt.views} Views
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className="w-3.5 h-3.5 text-rose-500" /> {prompt.likes} Likes
                        </span>
                        <span className="flex items-center gap-1">
                          <Copy className="w-3.5 h-3.5 text-teal-400" /> {prompt.clones} Remixed
                        </span>
                      </div>
                    </div>
                  ))}

                  {prompts.filter(p => p.creator.username === currentUser.username).length === 0 && (
                    <div className="col-span-full bg-slate-900/10 rounded-2xl border-2 border-dashed border-slate-800 p-8 text-center text-slate-500 text-xs">
                      No custom prompts uploaded yet. Click "Post Prompt" in the top header menu to share your instructions!
                    </div>
                  )}
                </div>
              </div>

            </div>

          </div>
        )}

      </main>


      {/* COMMENT SECTION DRAWER OVERLAY */}
      {isCommentDrawerOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-[#0f1217] border border-slate-800 w-full max-w-md rounded-3xl p-5 text-left flex flex-col max-h-[85vh] shadow-2xl animate-scale-up">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
              <div>
                <h3 className="font-black text-slate-100 text-sm">Thread Comments</h3>
                <p className="text-[10px] text-slate-400 leading-none mt-1">PromptTok Community Discussion board</p>
              </div>
              <button
                onClick={() => setIsCommentDrawerOpen(false)}
                className="p-1.5 rounded-full bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto space-y-3 pb-3 max-h-[340px]">
              {prompts.find((p) => p.id === commentPromptId)?.comments?.length === 0 ? (
                <p className="text-xs text-slate-500 italic text-center py-6">No discussions launched yet. Be the first to hook recommendations!</p>
              ) : (
                prompts.find((p) => p.id === commentPromptId)?.comments?.map((com) => (
                  <div key={com.id} className="bg-[#151921] p-3 rounded-xl border border-slate-800/60 leading-normal">
                    <div className="flex items-center gap-2 mb-1.5">
                      <img src={com.avatar} className="w-5 h-5 rounded-full object-cover" />
                      <span className="font-black text-[11px] text-slate-300">@{com.username}</span>
                      <span className="text-[9px] text-slate-500 font-mono ml-auto">Posted</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed pl-1">{com.text}</p>
                  </div>
                ))
              )}
            </div>

            {/* Input form */}
            <form onSubmit={handleAddComment} className="border-t border-slate-800/80 pt-3 flex items-center gap-2">
              <input
                type="text"
                placeholder="Hook realistic feedback..."
                className="flex-1 bg-[#151921] border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />
              <button
                type="submit"
                className="bg-rose-500 hover:bg-rose-600 text-white font-extrabold text-xs px-3.5 py-2 rounded-xl transition-all"
              >
                Post
              </button>
            </form>

          </div>
        </div>
      )}


      {/* MODAL: POST NEW PROMPT */}
      {isNewPromptOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <form
            onSubmit={handleCreatePrompt}
            className="bg-[#0f1217] border border-slate-800 w-full max-w-lg rounded-3xl p-6 text-left space-y-4 shadow-2xl animate-scale-up"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500 animate-pulse"></div>
                <h3 className="font-black text-slate-100 text-base">Index New Prompt</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsNewPromptOpen(false)}
                className="p-1 px-1.5 rounded bg-slate-900 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1">PROMPT SNIPPET TITLE</label>
                <input
                  type="text"
                  required
                  className="w-full bg-[#151921] border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-rose-500"
                  placeholder="e.g. Clean Code Express Generator Expert"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1">DESCRIPTION</label>
                <input
                  type="text"
                  className="w-full bg-[#151921] border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none"
                  placeholder="Explain what the instruct model expects..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">CATEGORY</label>
                  <select
                    className="w-full bg-[#151921] border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                  >
                    <option value="Image Gen">Image Gen</option>
                    <option value="Code">Code</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Business">Business</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 pt-5">
                  <input
                    type="checkbox"
                    id="isPremiumFlag"
                    className="w-4 h-4 rounded border-slate-800 bg-[#151921]"
                    checked={newIsPremium}
                    onChange={(e) => setNewIsPremium(e.target.checked)}
                  />
                  <label htmlFor="isPremiumFlag" className="text-xs font-bold text-slate-300 cursor-pointer">
                    Monetize Prompt?
                  </label>
                </div>
              </div>

              {newIsPremium && (
                <div>
                  <label className="text-[10px] font-bold text-amber-400 block mb-1">ROYALTY COINS VALUE (10 to 200 Coins)</label>
                  <input
                    type="number"
                    min={10}
                    max={200}
                    className="w-full bg-[#151921] border border-slate-800 rounded-xl px-3 py-2 text-xs text-amber-200 focus:outline-none"
                    value={newPrice}
                    onChange={(e) => setNewPrice(Number(e.target.value))}
                  />
                </div>
              )}

              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1">SYSTEM INSTRUCTION / QUERY SNIPPET TEXT</label>
                <textarea
                  rows={4}
                  required
                  className="w-full bg-[#151921] border border-slate-800 rounded-xl p-3 font-mono text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-rose-500"
                  placeholder="Paste raw prompts text block here..."
                  value={newText}
                  onChange={(e) => setNewText(e.target.value)}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-800/80">
              <button
                type="button"
                onClick={() => setIsNewPromptOpen(false)}
                className="px-4 py-2 text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-gradient-to-r from-rose-500 to-pink-500 text-white font-extrabold text-xs rounded-xl hover:scale-102 active:scale-98 transition-all"
              >
                Validate and Publish snip
              </button>
            </div>
          </form>
        </div>
      )}


      {/* MODAL: CREATE WORKFLOW PIPELINE NODE */}
      {isNewWorkflowOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <form
            onSubmit={handleCreateWorkflow}
            className="bg-[#0f1217] border border-slate-800 w-full max-w-xl rounded-3xl p-6 text-left space-y-4 shadow-2xl animate-scale-up overflow-y-auto max-h-[90vh]"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 rounded-full bg-purple-500 animate-pulse"></div>
                <h3 className="font-black text-slate-100 text-base">Construct Agent Workflow Pipeline</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsNewWorkflowOpen(false)}
                className="p-1 px-1.5 rounded bg-slate-900 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1">PIPELINE TITLE</label>
                <input
                  type="text"
                  required
                  className="w-full bg-[#151921] border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none"
                  placeholder="e.g. Comprehensive Brand Strategy Pipeline"
                  value={workTitle}
                  onChange={(e) => setWorkTitle(e.target.value)}
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1">PIPELINE WORKFLOW PURPOSE</label>
                <input
                  type="text"
                  className="w-full bg-[#151921] border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none"
                  placeholder="Explain what steps this sequencing accomplishes..."
                  value={workDesc}
                  onChange={(e) => setWorkDesc(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">PIPELINE SPECIALTY CATEGORY</label>
                  <select
                    className="w-full bg-[#151921] border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none"
                    value={workCategory}
                    onChange={(e) => setWorkCategory(e.target.value)}
                  >
                    <option value="Marketing">Marketing</option>
                    <option value="Code">Code</option>
                    <option value="Business">Business</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 pt-5">
                  <input
                    type="checkbox"
                    id="isWorkPremium"
                    className="w-4 h-4 rounded border-slate-800 bg-[#151921]"
                    checked={workIsPremium}
                    onChange={(e) => setWorkIsPremium(e.target.checked)}
                  />
                  <label htmlFor="isWorkPremium" className="text-xs font-bold text-[#fcd34d] cursor-pointer">
                    Premium Pipeline (Charge Coins)?
                  </label>
                </div>
              </div>

              {workIsPremium && (
                <div>
                  <label className="text-[10px] font-bold text-[#fcd34d] block mb-1">PIPELINE MONETIZATION (20 to 500 Coins)</label>
                  <input
                    type="number"
                    min={20}
                    max={500}
                    className="w-full bg-[#151921] border border-slate-800 rounded-xl px-3 py-2 text-xs text-[#fcd34d] focus:outline-none"
                    value={workPrice}
                    onChange={(e) => setWorkPrice(Number(e.target.value))}
                  />
                </div>
              )}

              {/* Steps creation visualizer */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-slate-400 uppercase">PIPELINE SEQUENCE CHRONOLOGY STEPS</span>
                  <button
                    type="button"
                    onClick={() => {
                      setWorkSteps((prev) => [
                        ...prev,
                        { title: `Step ${prev.length + 1}`, promptText: "Type dynamic instruction prompt using {{STARTUP_INFO}} ...", expectedOutput: "Report" }
                      ]);
                    }}
                    className="text-xs text-purple-400 hover:text-white flex items-center gap-1 font-extrabold"
                  >
                    <Plus className="w-3.5 h-3.5" /> Insert Next Step
                  </button>
                </div>

                <div className="space-y-3 max-h-[180px] overflow-y-auto pr-1">
                  {workSteps.map((st, idx) => (
                    <div key={idx} className="bg-slate-950 p-3 rounded-xl border border-slate-900 text-xs relative space-y-2">
                      <span className="absolute -top-1.5 -left-1.5 w-5 h-5 rounded-full bg-purple-600 text-[10px] text-white font-black flex items-center justify-center border border-[#0d0f12]">
                        {idx + 1}
                      </span>
                      {idx > 0 && (
                        <button
                          type="button"
                          onClick={() => setWorkSteps((prev) => prev.filter((_, i) => i !== idx))}
                          className="absolute -top-2.5 right-1.5 text-[10px] text-rose-500 hover:text-rose-400"
                        >
                          Remove Stage
                        </button>
                      )}
                      
                      <div className="grid grid-cols-2 gap-2 mt-1">
                        <input
                          type="text"
                          required
                          placeholder="Action title (e.g. Generate Copy)"
                          className="w-full bg-[#151921] border border-slate-800 rounded px-2 py-1 text-[11px] text-slate-200"
                          value={st.title}
                          onChange={(e) => {
                            const clone = [...workSteps];
                            clone[idx].title = e.target.value;
                            setWorkSteps(clone);
                          }}
                        />
                        <input
                          type="text"
                          placeholder="Expected result text outline"
                          className="w-full bg-[#151921] border border-slate-800 rounded px-2 py-1 text-[11px] text-slate-200"
                          value={st.expectedOutput}
                          onChange={(e) => {
                            const clone = [...workSteps];
                            clone[idx].expectedOutput = e.target.value;
                            setWorkSteps(clone);
                          }}
                        />
                      </div>
                      <textarea
                        rows={2}
                        required
                        placeholder="Dynamic logic text. Place {{STARTUP_INFO}} variable key inside instruction..."
                        className="w-full bg-[#151921] border border-slate-800 rounded p-2 text-[10px] font-mono text-slate-300 focus:outline-none"
                        value={st.promptText}
                        onChange={(e) => {
                          const clone = [...workSteps];
                          clone[idx].promptText = e.target.value;
                          setWorkSteps(clone);
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>

            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-800/80">
              <button
                type="button"
                onClick={() => setIsNewWorkflowOpen(false)}
                className="px-4 py-2 text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-extrabold text-xs rounded-xl hover:scale-102 active:scale-98 transition-all"
              >
                Assemble Chain Pipeline
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Footer System information */}
      <footer className="border-t border-slate-800 py-6 mt-12 bg-[#0b0c0f]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            <p className="font-extrabold text-slate-400">PromptTok Platform Engine</p>
            <p className="mt-1">© 2026 PromptTok. Structured and Optimized via Google Gemini API framework protocols.</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Compass className="w-3.5 h-3.5 text-teal-400" /> Grounded
            </span>
            <span className="flex items-center gap-1">
              <Terminal className="w-3.5 h-3.5 text-amber-400" /> Sandbox Ready
            </span>
            <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-[10px] text-slate-400">
              v1.5.0
            </span>
          </div>
        </div>
      </footer>

    </div>
  );
}
