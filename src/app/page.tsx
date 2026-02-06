"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import {
  Send,
  Bot,
  User,
  Code2,
  FileText,
  FolderOpen,
  ChevronRight,
  ChevronDown,
  Play,
  Copy,
  Check,
  Loader2,
  Sparkles,
  Image as ImageIcon,
  Paperclip,
  Monitor,
  SplitSquareHorizontal,
  Trash2,
  Edit3,
  Download,
  Mic,
  MicOff,
  RotateCcw,
  Undo2,
  MoreVertical,
  Plus,
  ArrowUpRight,
  Maximize2,
  RefreshCw,
  Terminal,
  Activity,
  Layers,
  Cpu,
} from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { transform } from "sucrase";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// ──────────────── Utility ────────────────
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ──────────────── Types ────────────────
interface Message {
  role: "user" | "assistant";
  content: string;
  image?: string;
  artifacts?: ArtifactInfo[];
}

interface ArtifactInfo {
  path: string;
  linesAdded: number;
  isNew: boolean;
  content: string;
}

interface ParsedFile {
  path: string;
  content: string;
  language: string;
}

interface FileNode {
  name: string;
  path: string;
  type: "file" | "folder";
  children?: FileNode[];
  content?: string;
  language?: string;
}

interface Project {
  id: string;
  name: string;
  files: ParsedFile[];
  messages: Message[];
  createdAt: string;
}

// ──────────────── Models ────────────────
const MODELS = [
  { id: "google/gemini-2.0-flash-001", name: "Gemini 2.0 Flash" },
  { id: "anthropic/claude-3.5-sonnet", name: "Claude 3.5 Sonnet" },
  { id: "openai/gpt-4o", name: "GPT-4o" },
  { id: "deepseek/deepseek-chat", name: "DeepSeek Chat" },
  { id: "meta-llama/llama-3.1-405b-instruct", name: "Llama 3.1 405B" },
];

// ──────────────── Helpers ────────────────
function getLanguageFromPath(path: string): string {
  const ext = path.split(".").pop()?.toLowerCase() || "";
  const map: Record<string, string> = {
    ts: "typescript",
    tsx: "tsx",
    js: "javascript",
    jsx: "jsx",
    css: "css",
    html: "html",
    json: "json",
    md: "markdown",
    py: "python",
    rs: "rust",
    go: "go",
    sql: "sql",
  };
  return map[ext] || "text";
}

function parseFilesFromResponse(text: string): ParsedFile[] {
  const files: ParsedFile[] = [];
  const regex = /---FILE:\s*(.+?)---\n([\s\S]*?)---END FILE---/g;
  let match;
  while ((match = regex.exec(text)) !== null) {
    const path = match[1].trim();
    files.push({
      path,
      content: match[2].trimEnd(),
      language: getLanguageFromPath(path),
    });
  }
  return files;
}

function buildFileTree(files: ParsedFile[]): FileNode[] {
  const root: FileNode[] = [];
  for (const file of files) {
    const parts = file.path.split("/");
    let current = root;
    for (let i = 0; i < parts.length; i++) {
      const name = parts[i];
      const isFile = i === parts.length - 1;
      const currentPath = parts.slice(0, i + 1).join("/");
      const existing = current.find((n) => n.name === name);
      if (existing) {
        if (existing.type === "folder" && existing.children) {
          current = existing.children;
        }
      } else {
        const node: FileNode = isFile
          ? {
              name,
              path: currentPath,
              type: "file",
              content: file.content,
              language: file.language,
            }
          : { name, path: currentPath, type: "folder", children: [] };
        current.push(node);
        if (!isFile && node.children) {
          current = node.children;
        }
      }
    }
  }
  return root;
}

function stripFileBlocks(text: string): string {
  return text.replace(/---FILE:\s*.+?---\n[\s\S]*?---END FILE---/g, "").trim();
}

// ──────────────── Components ────────────────

function FileTreeView({
  nodes,
  selectedFile,
  onSelect,
  onDelete,
  onRename,
  depth = 0,
}: {
  nodes: FileNode[];
  selectedFile: string | null;
  onSelect: (node: FileNode) => void;
  onDelete: (path: string) => void;
  onRename: (path: string, newName: string) => void;
  depth?: number;
}) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [editingPath, setEditingPath] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  const sorted = [...nodes].sort((a, b) => {
    if (a.type !== b.type) return a.type === "folder" ? -1 : 1;
    return a.name.localeCompare(b.name);
  });

  const handleRenameSubmit = (path: string) => {
    if (editName.trim()) onRename(path, editName.trim());
    setEditingPath(null);
  };

  return (
    <div className="space-y-0.5">
      {sorted.map((node) => {
        const isOpen = expanded[node.path] !== false;
        const isEditing = editingPath === node.path;
        const isSelected = selectedFile === node.path;

        return (
          <div key={node.path} className="group/file">
            <div
              className={cn(
                "w-full flex items-center justify-between px-2 py-1.5 text-[12px] transition-all cursor-pointer rounded-md mx-1",
                isSelected 
                  ? "bg-purple-500/10 text-purple-200 border border-purple-500/20 shadow-[0_0_10px_rgba(168,85,247,0.1)]" 
                  : "text-white/40 hover:bg-white/5 hover:text-white/70"
              )}
              style={{ marginLeft: `${depth * 12}px`, width: `calc(100% - ${depth * 12 + 8}px)` }}
              onClick={() => {
                if (node.type === "folder") {
                  setExpanded((p) => ({ ...p, [node.path]: !isOpen }));
                } else {
                  onSelect(node);
                }
              }}
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                {node.type === "folder" ? (
                  <>
                    <ChevronRight className={cn("w-3 h-3 shrink-0 transition-transform", isOpen && "rotate-90")} />
                    <FolderOpen className="w-3.5 h-3.5 shrink-0 text-blue-400/70" />
                  </>
                ) : (
                  <>
                    <div className="w-3" />
                    <FileText className="w-3.5 h-3.5 shrink-0 text-purple-400/70" />
                  </>
                )}
                
                {isEditing ? (
                  <input
                    autoFocus
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    onBlur={() => handleRenameSubmit(node.path)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleRenameSubmit(node.path);
                      if (e.key === "Escape") setEditingPath(null);
                    }}
                    className="bg-purple-500/20 border border-purple-500/40 outline-none px-1 rounded w-full text-white"
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : (
                  <span className="truncate font-light tracking-wide">{node.name}</span>
                )}
              </div>

              {!isEditing && (
                <div className="flex items-center gap-1 opacity-0 group-hover/file:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingPath(node.path);
                      setEditName(node.name);
                    }}
                    className="p-1 hover:bg-white/10 rounded"
                  >
                    <Edit3 className="w-3 h-3 text-white/30 hover:text-white" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(node.path);
                    }}
                    className="p-1 hover:bg-red-500/20 rounded"
                  >
                    <Trash2 className="w-3 h-3 text-white/30 hover:text-red-400" />
                  </button>
                </div>
              )}
            </div>
            {node.type === "folder" && isOpen && node.children && (
              <FileTreeView
                nodes={node.children}
                selectedFile={selectedFile}
                onSelect={onSelect}
                onDelete={onDelete}
                onRename={onRename}
                depth={depth + 1}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function ArtifactBox({ 
  artifact, 
  onView 
}: { 
  artifact: ArtifactInfo; 
  onView: () => void 
}) {
  return (
    <div 
      onClick={onView}
      className="group relative flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:border-purple-500/40 hover:bg-white/[0.06] transition-all cursor-pointer overflow-hidden shadow-sm hover:shadow-purple-500/5 active:scale-[0.98]"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="flex items-center gap-3.5 relative z-10">
        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#111] to-[#0d0d0d] border border-white/5 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform duration-500">
          <Code2 className="w-5 h-5 text-purple-400" />
        </div>
        <div className="flex flex-col">
          <span className="text-[13px] text-white/90 font-semibold tracking-tight truncate max-w-[220px]">{artifact.path}</span>
          <div className="flex items-center gap-2.5 mt-0.5">
            <span className="text-[10px] text-purple-400 font-mono flex items-center gap-0.5 font-bold">
              <Plus className="w-2.5 h-2.5" />
              {artifact.linesAdded}
            </span>
            <span className="text-[10px] text-white/20 font-medium">lines edited</span>
            {artifact.isNew && (
              <span className="text-[9px] px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 font-black uppercase tracking-widest border border-green-500/10">New Artifact</span>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/5 border border-white/5 opacity-0 group-hover:opacity-100 transition-all group-hover:bg-purple-500/10 group-hover:border-purple-500/20">
        <ArrowUpRight className="w-4 h-4 text-purple-400 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </div>
    </div>
  );
}

function CodePreview({
  code,
  language,
  fileName,
  onDownload,
}: {
  code: string;
  language: string;
  fileName: string;
  onDownload: () => void;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-[#050505]">
      <div className="flex items-center justify-between px-6 py-4 bg-[#0d0d0d] border-b border-white/5 shadow-md">
        <div className="flex items-center gap-4">
          <div className="p-2 rounded-xl bg-white/5 border border-white/10 shadow-inner">
            <Code2 className="w-4.5 h-4.5 text-purple-400" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-white/90 font-bold tracking-tight">{fileName}</span>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-black">{language}</span>
              <div className="w-1 h-1 rounded-full bg-white/10" />
              <span className="text-[10px] text-white/20 font-mono">{code.split("\n").length} lines</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={onDownload}
            className="p-2.5 text-white/40 hover:text-white hover:bg-white/5 rounded-xl transition-all border border-transparent hover:border-white/5"
            title="Download"
          >
            <Download className="w-4.5 h-4.5" />
          </button>
          <button
            onClick={handleCopy}
            className="flex items-center gap-2.5 px-4 py-2 bg-white/[0.04] hover:bg-white/[0.08] rounded-xl border border-white/10 transition-all group active:scale-95 shadow-lg"
          >
            {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-white/40 group-hover:text-white/80" />}
            <span className="text-xs text-white/80 font-bold tracking-wide">{copied ? "Copied!" : "Copy Code"}</span>
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-auto scrollbar-thin scrollbar-thumb-white/5 selection:bg-purple-500/30">
        <SyntaxHighlighter
          language={language}
          style={oneDark}
          customStyle={{
            margin: 0,
            padding: "32px",
            background: "transparent",
            fontSize: "13.5px",
            lineHeight: "1.8",
            minHeight: "100%",
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
          }}
          showLineNumbers
          lineNumberStyle={{ color: "rgba(255,255,255,0.1)", minWidth: "3.5em", textAlign: "right", paddingRight: "2em", userSelect: "none" }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}

function LivePreview({ files }: { files: ParsedFile[] }) {
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  const generateSrcDoc = useCallback(() => {
    try {
      const htmlFile = files.find((f) => f.path.endsWith(".html") || f.path === "index.html");
      const cssFiles = files.filter((f) => f.path.endsWith(".css"));
      const tsxFiles = files.filter((f) => f.path.endsWith(".tsx") || f.path.endsWith(".jsx"));
      const jsFiles = files.filter((f) => f.path.endsWith(".js") && !f.path.endsWith(".json"));

      let baseHtml = htmlFile?.content || `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <script src="https://cdn.tailwindcss.com"></script>
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
            <style>
              body { background: #000; color: #fff; font-family: 'Inter', sans-serif; margin: 0; min-height: 100vh; }
              #root { min-height: 100vh; }
            </style>
          </head>
          <body>
            <div id="root"></div>
          </body>
        </html>
      `;

      // Inject CSS
      const styles = cssFiles.map(f => `<style id="${f.path}">${f.content}</style>`).join("\n");
      baseHtml = baseHtml.replace("</head>", `${styles}</head>`);

      // Transpile and Inject JS/TSX
      let scriptContent = "";
      
      if (tsxFiles.length > 0) {
        scriptContent += `
          window.process = { env: { NODE_ENV: 'development' } };
          import React, { useState, useEffect, useCallback, useMemo, useRef } from 'https://esm.sh/react@18';
          import ReactDOM from 'https://esm.sh/react-dom@18/client';
          import * as Lucide from 'https://esm.sh/lucide-react@0.454.0';
          import { motion, AnimatePresence } from 'https://esm.sh/framer-motion@11';
          
          window.React = React;
          window.Lucide = Lucide;
          window.motion = motion;
          window.AnimatePresence = AnimatePresence;
        `;

        // Process all TSX files
        tsxFiles.forEach(file => {
          try {
            const transformed = transform(file.content, {
              transforms: ["typescript", "jsx"],
              production: false,
            }).code;
            
            // Basic module simulation - strip imports and wrap in scope
            const scopedCode = transformed
              .replace(/import\s+[\s\S]*?from\s+['"].*?['"];?/g, '') // remove imports for browser
              .replace(/export\s+default\s+function\s+(\w+)/, 'function $1')
              .replace(/export\s+function\s+(\w+)/, 'function $1')
              .replace(/export\s+const\s+(\w+)/, 'const $1');

            scriptContent += `\n// File: ${file.path}\n${scopedCode}\n`;
          } catch (e: any) {
            console.error(`Transpilation error in ${file.path}:`, e);
          }
        });

        // Try to find an entry point component (App or Home or first component)
        scriptContent += `
          setTimeout(() => {
            const rootEl = document.getElementById('root');
            if (!rootEl) return;
            const root = ReactDOM.createRoot(rootEl);
            const Entry = typeof App !== 'undefined' ? App : (typeof Home !== 'undefined' ? Home : null);
            if (Entry) {
              root.render(React.createElement(Entry));
            } else {
              // Try to find any defined component
              const components = Object.keys(window).filter(k => /^[A-Z]/.test(k) && typeof window[k] === 'function');
              if (components.length > 0) {
                root.render(React.createElement(window[components[0]]));
              }
            }
          }, 100);
        `;
      } else {
        jsFiles.forEach(file => {
          scriptContent += `\n// File: ${file.path}\n${file.content}\n`;
        });
      }

      const finalHtml = baseHtml.replace("</body>", `<script type="module">${scriptContent}</script></body>`);
      setError(null);
      return finalHtml;
    } catch (e: any) {
      setError(e.message);
      return "";
    }
  }, [files]);

  const srcDoc = useMemo(() => generateSrcDoc(), [generateSrcDoc, reloadKey]);

  return (
    <div className="w-full h-full flex flex-col bg-[#0d0d0d] rounded-[2rem] overflow-hidden border border-white/10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.6)] relative group/preview">
      <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-[#111] to-[#0d0d0d] border-b border-white/5">
        <div className="flex items-center gap-4 flex-1">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/40 border border-red-500/20" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/40 border border-yellow-500/20" />
            <div className="w-3 h-3 rounded-full bg-green-500/40 border border-green-500/20" />
          </div>
          <div className="flex items-center gap-3 px-4 py-1.5 rounded-full bg-black/40 border border-white/5 text-[11px] text-white/40 font-mono flex-1 max-w-lg shadow-inner group-hover:border-purple-500/20 transition-all">
            <Activity className="w-3.5 h-3.5 opacity-30 text-purple-400" />
            <span className="truncate tracking-tight uppercase font-black opacity-60">localhost:3000</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setReloadKey(k => k + 1)}
            className="p-2 text-white/30 hover:text-white hover:bg-white/5 rounded-xl transition-all active:rotate-180 duration-500"
            title="Reload Environment"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button className="p-2 text-white/30 hover:text-white hover:bg-white/5 rounded-xl transition-all">
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      {error ? (
        <div className="flex-1 flex flex-col items-center justify-center p-10 text-center space-y-6 bg-red-500/[0.02]">
          <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 shadow-xl">
            <Terminal className="w-10 h-10 text-red-500/60" />
          </div>
          <div className="space-y-2">
            <h4 className="text-red-400 font-black tracking-tight uppercase text-sm">Deployment Failed</h4>
            <p className="text-white/40 text-[12px] font-mono max-w-sm break-words leading-relaxed">{error}</p>
          </div>
          <button onClick={() => setReloadKey(k => k + 1)} className="px-6 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-bold hover:bg-white/10 transition-all">Retry Build</button>
        </div>
      ) : (
        <div className="flex-1 bg-white relative">
          <iframe
            srcDoc={srcDoc}
            className="w-full h-full"
            sandbox="allow-scripts allow-modals allow-popups allow-forms allow-same-origin"
            title="Preview"
          />
        </div>
      )}
    </div>
  );
}

const DEFAULT_FILES: ParsedFile[] = [
  {
    path: "package.json",
    content: JSON.stringify({
      name: "orchids-project",
      version: "1.0.0",
      dependencies: {
        "react": "^18.0.0",
        "react-dom": "^18.0.0",
        "lucide-react": "latest",
        "framer-motion": "latest"
      }
    }, null, 2),
    language: "json"
  },
  {
    path: "index.html",
    content: `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>`,
    language: "html"
  },
  {
    path: "App.tsx",
    content: `import React from 'react';

export default function App() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-white">
      <h1 className="text-4xl font-bold">Hello Orchids</h1>
    </div>
  );
}`,
    language: "tsx"
  },
  {
    path: ".gitignore",
    content: "node_modules\n.next\n.env\nbun.lock",
    language: "text"
  }
];

// ──────────────── Main Page ────────────────
export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [selectedModel, setSelectedModel] = useState(MODELS[0].id);
  const [allFiles, setAllFiles] = useState<ParsedFile[]>([]);
  const [fileHistory, setFileHistory] = useState<ParsedFile[][]>([]);
  const [selectedFile, setSelectedFile] = useState<FileNode | null>(null);
  const [rightPanel, setRightPanel] = useState<"code" | "preview">("code");
  const [imageAttachment, setImageAttachment] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);

  // Persistence
  useEffect(() => {
    const saved = localStorage.getItem("orchids_projects");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setProjects(parsed);
        if (parsed.length > 0) {
          // Load last project
          const last = parsed[0];
          setCurrentProjectId(last.id);
          setAllFiles(last.files);
          setMessages(last.messages);
        }
      } catch (e) {
        console.error("Failed to load projects", e);
      }
    }
  }, []);

  useEffect(() => {
    if (projects.length > 0) {
      localStorage.setItem("orchids_projects", JSON.stringify(projects));
    }
  }, [projects]);

  const createNewProject = useCallback((name: string = "Untitled Project") => {
    const newProject: Project = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      files: DEFAULT_FILES,
      messages: [],
      createdAt: new Date().toISOString(),
    };
    setProjects(prev => [newProject, ...prev]);
    setCurrentProjectId(newProject.id);
    setAllFiles(newProject.files);
    setMessages([]);
    setRightPanel("code");
    setSelectedFile({
      name: "App.tsx",
      path: "App.tsx",
      type: "file",
      content: DEFAULT_FILES.find(f => f.path === "App.tsx")?.content,
      language: "tsx"
    });
  }, []);

  const switchProject = (id: string) => {
    const p = projects.find(proj => proj.id === id);
    if (p) {
      setCurrentProjectId(p.id);
      setAllFiles(p.files);
      setMessages(p.messages);
    }
  };

  const updateCurrentProject = useCallback((files: ParsedFile[], msgs: Message[]) => {
    if (!currentProjectId) {
      // Create a project if none exists
      const id = Math.random().toString(36).substr(2, 9);
      const newProj: Project = {
        id,
        name: msgs[0]?.content.slice(0, 20) + "..." || "New Project",
        files,
        messages: msgs,
        createdAt: new Date().toISOString(),
      };
      setProjects(prev => [newProj, ...prev]);
      setCurrentProjectId(id);
      return;
    }
    setProjects(prev => prev.map(p => 
      p.id === currentProjectId 
        ? { ...p, files, messages: msgs } 
        : p
    ));
  }, [currentProjectId]);

  const deleteProject = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setProjects(prev => prev.filter(p => p.id !== id));
    if (currentProjectId === id) {
      setCurrentProjectId(null);
      setAllFiles([]);
      setMessages([]);
    }
  };

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  // Voice Recognition
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognitionInstance = new SpeechRecognition();
        recognitionInstance.continuous = false;
        recognitionInstance.interimResults = false;
        recognitionInstance.lang = "en-US";
        recognitionInstance.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInput((prev) => (prev ? prev + " " + transcript : transcript));
          setIsRecording(false);
        };
        recognitionInstance.onerror = () => setIsRecording(false);
        recognitionInstance.onend = () => setIsRecording(false);
        setRecognition(recognitionInstance);
      }
    }
  }, []);

  const toggleRecording = () => {
    if (!recognition) return;
    if (isRecording) {
      recognition.stop();
    } else {
      recognition.start();
      setIsRecording(true);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImageAttachment(reader.result as string);
    reader.readAsDataURL(file);
  };

  const saveToHistory = useCallback((files: ParsedFile[]) => {
    setFileHistory((prev) => [...prev, JSON.parse(JSON.stringify(files))].slice(-20));
  }, []);

  const undoChanges = () => {
    if (fileHistory.length > 0) {
      const prev = fileHistory[fileHistory.length - 1];
      setAllFiles(prev);
      setFileHistory((prevHistory) => prevHistory.slice(0, -1));
    }
  };

  const deleteFile = (path: string) => {
    saveToHistory(allFiles);
    setAllFiles((prev) => prev.filter((f) => !f.path.startsWith(path)));
    if (selectedFile?.path.startsWith(path)) setSelectedFile(null);
  };

  const renameFile = (path: string, newName: string) => {
    saveToHistory(allFiles);
    setAllFiles((prev) =>
      prev.map((f) => {
        if (f.path === path) {
          const parts = f.path.split("/");
          parts[parts.length - 1] = newName;
          return { ...f, path: parts.join("/") };
        }
        if (f.path.startsWith(path + "/")) {
          return { ...f, path: f.path.replace(path, path.split("/").slice(0, -1).concat(newName).join("/")) };
        }
        return f;
      })
    );
  };

  const downloadFile = (file: ParsedFile) => {
    const blob = new Blob([file.content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = file.path.split("/").pop() || "file.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadProject = () => {
    const projectData = { name: "orchids-project", files: allFiles, timestamp: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(projectData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "orchids-project.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const sendMessage = useCallback(async () => {
    if ((!input.trim() && !imageAttachment) || isStreaming) return;

    const userMsg: Message = {
      role: "user",
      content: input.trim(),
      image: imageAttachment || undefined,
    };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setImageAttachment(null);
    setIsStreaming(true);

    const apiMessages = newMessages.map((m) => {
      if (m.image) {
        return {
          role: m.role,
          content: [
            { type: "text", text: m.content },
            { type: "image_url", image_url: { url: m.image } },
          ],
        };
      }
      return { role: m.role, content: m.content };
    });

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages, model: selectedModel }),
      });

      if (!response.ok) throw new Error("API error");

      const reader = response.body?.getReader();
      if (!reader) return;

      const decoder = new TextDecoder();
      let assistantContent = "";
      let buffer = "";

      setMessages((prev) => [...prev, { role: "assistant", content: "", artifacts: [] }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || !trimmed.startsWith("data: ")) continue;
          const data = trimmed.slice(6);
          if (data === "[DONE]") continue;

          try {
            const parsed = JSON.parse(data);
            if (parsed.content) {
              assistantContent += parsed.content;
              
              // Dynamic artifact extraction for streaming UI
              const filesInCurrent = parseFilesFromResponse(assistantContent);
              const artifacts: ArtifactInfo[] = filesInCurrent.map(f => {
                const existing = allFiles.find(ef => ef.path === f.path);
                return {
                  path: f.path,
                  linesAdded: f.content.split("\n").length,
                  isNew: !existing,
                  content: f.content
                };
              });

              setMessages((prev) => {
                const updated = [...prev];
                updated[updated.length - 1] = {
                  role: "assistant",
                  content: assistantContent,
                  artifacts: artifacts,
                };
                return updated;
              });
            }
          } catch { /* skip */ }
        }
      }

        // Final processing
        const parsed = parseFilesFromResponse(assistantContent);
        let finalFiles = [...allFiles];
        let finalMessages = [...newMessages, { role: "assistant", content: assistantContent, artifacts: [] } as Message];

        if (parsed.length > 0) {
          saveToHistory(allFiles);
          const map = new Map(allFiles.map((f) => [f.path, f]));
          parsed.forEach((f) => map.set(f.path, f));
          finalFiles = Array.from(map.values());
          setAllFiles(finalFiles);
          
          if (parsed[0]) {
            const first = parsed[0];
            setSelectedFile({
              name: first.path.split("/").pop() || first.path,
              path: first.path,
              type: "file",
              content: first.content,
              language: first.language,
            });
          }
        }
        updateCurrentProject(finalFiles, finalMessages);
      } catch (err) {
      console.error(err);
      setMessages((prev) => [...prev, { role: "assistant", content: "Error: Failed to get response." }]);
    } finally {
      setIsStreaming(false);
    }
  }, [input, imageAttachment, isStreaming, messages, selectedModel, allFiles, saveToHistory]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const fileTree = useMemo(() => buildFileTree(allFiles), [allFiles]);

  return (
    <div className="h-screen flex flex-col bg-[#050505] text-white overflow-hidden font-sans selection:bg-purple-500/40">
      {/* Top Bar - Premium */}
      <header className="flex items-center justify-between px-8 py-4 bg-[#0a0a0a] border-b border-white/5 shrink-0 z-50 shadow-2xl">
        <div className="flex items-center gap-10">
          <div className="flex items-center gap-4 group cursor-pointer">
            <div className="relative">
              <Sparkles className="w-6 h-6 text-purple-400 group-hover:scale-125 transition-transform duration-700 ease-out" />
              <div className="absolute inset-0 bg-purple-400/30 blur-xl rounded-full animate-pulse" />
            </div>
            <span className="font-black text-sm tracking-[0.4em] bg-gradient-to-r from-white via-white to-white/40 bg-clip-text text-transparent uppercase">
              Orchids
            </span>
          </div>
          
            <div className="flex items-center gap-1.5 bg-white/[0.03] p-1.5 rounded-2xl border border-white/[0.05] shadow-inner">
              <button 
                onClick={() => createNewProject()}
                className="p-2 text-purple-400 hover:text-white transition-all rounded-xl hover:bg-purple-500/10 active:scale-90"
                title="New Project"
              >
                <Plus className="w-4.5 h-4.5" />
              </button>
              <div className="w-[1px] h-5 bg-white/5 mx-1" />
              <button 
                onClick={undoChanges}
              disabled={fileHistory.length === 0}
              className="p-2 text-white/40 hover:text-white disabled:opacity-10 transition-all rounded-xl hover:bg-white/5 active:scale-90"
              title="Undo Last Operation"
            >
              <Undo2 className="w-4.5 h-4.5" />
            </button>
            <div className="w-[1px] h-5 bg-white/5 mx-1" />
            <button 
              onClick={downloadProject}
              className="p-2 text-white/40 hover:text-white transition-all rounded-xl hover:bg-white/5 active:scale-90"
              title="Export Repository"
            >
              <Download className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4 px-5 py-2 bg-white/[0.03] border border-white/10 rounded-full hover:border-purple-500/40 transition-all group shadow-lg">
            <Activity className="w-3.5 h-3.5 text-green-500 animate-pulse" />
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="bg-transparent border-none text-[11px] text-white/70 outline-none cursor-pointer font-black tracking-widest uppercase hover:text-white transition-colors"
            >
              {MODELS.map((m) => (
                <option key={m.id} value={m.id} className="bg-[#0d0d0d] text-sm font-sans">
                  {m.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-black text-white/40 uppercase tracking-tighter">Pro Developer</span>
              <span className="text-[12px] font-bold text-white/90">John Doe</span>
            </div>
            <div className="w-10 h-10 rounded-[14px] bg-gradient-to-tr from-purple-600 via-purple-500 to-blue-500 p-[1px] shadow-xl hover:scale-105 transition-transform">
              <div className="w-full h-full rounded-[13px] bg-[#0d0d0d] flex items-center justify-center text-[12px] font-black">
                JD
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Background Ambient Glow */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] bg-purple-500/[0.03] blur-[150px] rounded-full" />
          <div className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] bg-blue-500/[0.03] blur-[150px] rounded-full" />
        </div>

        {/* LEFT: Chat Panel */}
        <div className="w-[520px] min-w-[420px] flex flex-col border-r border-white/5 bg-[#080808]/60 backdrop-blur-[60px] z-10 relative shadow-2xl">
            <div className="flex-1 overflow-y-auto px-8 py-10 space-y-10 scrollbar-thin scrollbar-thumb-white/5">
              {projects.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-[10px] uppercase tracking-[0.4em] text-white/20 font-black">Active Projects</span>
                    <button onClick={() => createNewProject()} className="p-1 hover:bg-white/5 rounded text-white/20 hover:text-purple-400 transition-all"><Plus className="w-3.5 h-3.5" /></button>
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    {projects.map((p) => (
                      <div
                        key={p.id}
                        onClick={() => switchProject(p.id)}
                        className={cn(
                          "group flex items-center justify-between p-3 rounded-xl transition-all cursor-pointer border",
                          currentProjectId === p.id 
                            ? "bg-purple-500/10 border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.1)]" 
                            : "bg-white/[0.02] border-white/[0.05] hover:bg-white/[0.05] hover:border-white/10"
                        )}
                      >
                        <div className="flex items-center gap-3 overflow-hidden">
                          <div className={cn("w-2 h-2 rounded-full", currentProjectId === p.id ? "bg-purple-400 animate-pulse shadow-[0_0_8px_rgba(168,85,247,0.8)]" : "bg-white/10")} />
                          <span className={cn("text-xs font-semibold truncate", currentProjectId === p.id ? "text-purple-200" : "text-white/40 group-hover:text-white/70")}>
                            {p.name}
                          </span>
                        </div>
                        <button 
                          onClick={(e) => deleteProject(p.id, e)}
                          className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-500/20 rounded transition-all"
                        >
                          <Trash2 className="w-3 h-3 text-white/20 hover:text-red-400" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="h-[1px] w-full bg-white/[0.05]" />
                </div>
              )}

              {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-8 px-12">
                <div className="relative">
                  <div className="p-7 rounded-[2.5rem] bg-gradient-to-br from-white/[0.06] to-transparent border border-white/[0.1] shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative z-10 hover:scale-110 transition-transform duration-700 group">
                    <Cpu className="w-12 h-12 text-purple-400 group-hover:rotate-12 transition-transform duration-700" />
                  </div>
                  <div className="absolute inset-0 bg-purple-500/20 blur-[60px] rounded-full animate-pulse" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-2xl font-black tracking-tight uppercase">Forge your app</h3>
                  <p className="text-white/30 text-[14px] leading-relaxed max-w-[280px] mx-auto font-medium">
                    Describe your digital vision and watch the architecture unfold in real-time.
                  </p>
                </div>
                <div className="grid grid-cols-1 gap-4 w-full max-w-[340px]">
                  {[
                    { text: "Premium Fintech Dashboard with Charts", icon: <Layers className="w-4 h-4" /> },
                    { text: "Animated Creative Agency Portfolio", icon: <ImageIcon className="w-4 h-4" /> },
                    { text: "Real-time Collaborative Task System", icon: <Code2 className="w-4 h-4" /> }
                  ].map((item) => (
                    <button
                      key={item.text}
                      onClick={() => setInput(item.text)}
                      className="group flex items-center gap-4 px-5 py-4.5 rounded-[1.5rem] bg-white/[0.03] border border-white/[0.06] hover:border-purple-500/40 hover:bg-white/[0.06] transition-all text-[13px] text-white/40 hover:text-white/90 text-left shadow-lg active:scale-95"
                    >
                      <span className="p-2 rounded-xl bg-white/5 text-white/30 group-hover:text-purple-400 group-hover:bg-purple-500/15 transition-all shadow-inner">{item.icon}</span>
                      <span className="font-semibold tracking-tight">{item.text}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg, i) => (
              <div key={i} className={cn("flex gap-6", msg.role === "user" ? "flex-row-reverse" : "")}>
                <div className={cn(
                  "w-10 h-10 rounded-[18px] flex items-center justify-center shrink-0 border transition-all shadow-2xl",
                  msg.role === "user" ? "bg-purple-600/10 border-purple-500/20 text-purple-400" : "bg-white/[0.04] border-white/10 text-white/60"
                )}>
                  {msg.role === "user" ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                </div>
                <div className={cn("max-w-[88%] space-y-6", msg.role === "user" ? "items-end" : "items-start")}>
                  <div className={cn(
                    "rounded-[1.5rem] px-6 py-5 text-[15px] shadow-[0_20px_50px_rgba(0,0,0,0.3)] relative group/msg transition-all",
                    msg.role === "user" ? "bg-white/[0.04] border border-white/[0.08] text-white/90" : "bg-transparent text-white/80"
                  )}>
                    {msg.image && (
                      <div className="relative group mb-6 overflow-hidden rounded-[1.5rem] border border-white/10 shadow-2xl">
                        <img src={msg.image} alt="Reference" className="max-w-full max-h-72 object-cover transition-transform duration-700 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                      </div>
                    )}
                    <div className="whitespace-pre-wrap break-words leading-relaxed font-light tracking-wide selection:bg-purple-500/30">
                      {msg.role === "assistant" ? stripFileBlocks(msg.content) : msg.content}
                    </div>
                    
                    {/* Artifacts Display */}
                    {msg.role === "assistant" && msg.artifacts && msg.artifacts.length > 0 && (
                      <div className="mt-8 space-y-4">
                        <div className="flex items-center gap-4">
                          <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-white/10" />
                          <span className="text-[10px] uppercase tracking-[0.4em] text-white/20 font-black">Digital Blueprint</span>
                          <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-white/10" />
                        </div>
                        <div className="grid grid-cols-1 gap-3">
                          {msg.artifacts.map((art, idx) => (
                            <ArtifactBox 
                              key={idx} 
                              artifact={art} 
                              onView={() => {
                                setSelectedFile({
                                  name: art.path.split("/").pop() || art.path,
                                  path: art.path,
                                  type: "file",
                                  content: art.content,
                                  language: getLanguageFromPath(art.path)
                                });
                                setRightPanel("code");
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {msg.role === "assistant" && isStreaming && i === messages.length - 1 && (
                      <div className="flex gap-2 mt-6">
                        <div className="w-2 h-2 rounded-full bg-purple-500 animate-bounce [animation-delay:-0.3s] shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
                        <div className="w-2 h-2 rounded-full bg-purple-500 animate-bounce [animation-delay:-0.15s] shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
                        <div className="w-2 h-2 rounded-full bg-purple-500 animate-bounce shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-8 bg-gradient-to-t from-[#080808] to-transparent z-10">
            <div className="relative group">
              <div className="absolute -inset-1.5 bg-gradient-to-r from-purple-600/30 via-purple-500/20 to-blue-500/30 rounded-[2.5rem] blur-[20px] opacity-0 group-focus-within:opacity-100 transition-opacity duration-1000" />
              <div className="relative flex flex-col bg-[#0d0d0d]/90 backdrop-blur-3xl rounded-[2rem] border border-white/10 focus-within:border-purple-500/50 transition-all duration-700 overflow-hidden shadow-[0_30px_70px_rgba(0,0,0,0.8)]">
                {imageAttachment && (
                  <div className="p-5 pb-0 flex gap-3">
                    <div className="relative group/thumb">
                      <img src={imageAttachment} className="h-20 w-20 object-cover rounded-2xl border border-white/10 shadow-2xl transition-transform group-hover/thumb:scale-105" />
                      <button onClick={() => setImageAttachment(null)} className="absolute -top-2.5 -right-2.5 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover/thumb:opacity-100 transition-all shadow-xl hover:bg-red-600">
                        <Plus className="w-3.5 h-3.5 rotate-45" />
                      </button>
                    </div>
                  </div>
                )}
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Masterpiece in progress... Ask me to build anything."
                  className="w-full bg-transparent outline-none text-[15px] text-white/90 placeholder:text-white/15 resize-none px-7 pt-7 pb-4 min-h-[70px] max-h-48 leading-relaxed font-light tracking-wide"
                  rows={1}
                />
                <div className="flex items-center justify-between px-5 py-4 bg-white/[0.01] border-t border-white/[0.05]">
                  <div className="flex items-center gap-2">
                    <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
                    <button onClick={() => fileInputRef.current?.click()} className="p-3 text-white/20 hover:text-purple-400 hover:bg-purple-500/10 rounded-2xl transition-all active:scale-90" title="Reference Image"><ImageIcon className="w-5 h-5" /></button>
                    <button onClick={toggleRecording} className={cn("p-3 rounded-2xl transition-all active:scale-90", isRecording ? "text-red-400 bg-red-500/10 animate-pulse" : "text-white/20 hover:text-purple-400 hover:bg-purple-500/10")} title="Voice Interface"><Mic className="w-5 h-5" /></button>
                  </div>
                  <button
                    onClick={sendMessage}
                    disabled={isStreaming || (!input.trim() && !imageAttachment)}
                    className="group flex items-center gap-3 px-8 py-2.5 bg-white text-black hover:bg-purple-500 hover:text-white disabled:bg-white/5 disabled:text-white/10 rounded-full text-[14px] font-black transition-all shadow-[0_10px_30px_rgba(255,255,255,0.1)] active:scale-95 uppercase tracking-widest"
                  >
                    {isStreaming ? <Loader2 className="w-5 h-5 animate-spin" /> : <><span>Build</span><ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" /></>}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: Code + Preview */}
        <div className="flex-1 flex flex-col overflow-hidden bg-[#050505] z-0 shadow-[-50px_0_100px_rgba(0,0,0,0.5)]">
          <div className="flex items-center justify-between px-8 py-4 bg-[#0a0a0a] border-b border-white/5">
            <div className="flex p-1.5 bg-white/[0.04] rounded-[1.2rem] border border-white/[0.08] shadow-inner">
              <button
                onClick={() => setRightPanel("code")}
                className={cn("flex items-center gap-3 px-8 py-2.5 rounded-[1rem] text-[11px] font-black tracking-[0.2em] uppercase transition-all duration-500", rightPanel === "code" ? "bg-white/10 text-white shadow-2xl border border-white/5" : "text-white/20 hover:text-white/50")}
              >
                <Code2 className="w-4 h-4" /> Codebase
              </button>
              <button
                onClick={() => setRightPanel("preview")}
                className={cn("flex items-center gap-3 px-8 py-2.5 rounded-[1rem] text-[11px] font-black tracking-[0.2em] uppercase transition-all duration-500", rightPanel === "preview" ? "bg-white/10 text-white shadow-2xl border border-white/5" : "text-white/20 hover:text-white/50")}
              >
                <Monitor className="w-4 h-4" /> Live Preview
              </button>
            </div>
          </div>

          <div className="flex-1 flex overflow-hidden">
            {rightPanel === "code" ? (
              <>
                {allFiles.length > 0 && (
                  <div className="w-[300px] border-r border-white/5 overflow-y-auto bg-[#080808] px-3 py-8 scrollbar-thin scrollbar-thumb-white/5">
                    <div className="px-5 mb-8 flex items-center justify-between">
                      <span className="text-[10px] uppercase tracking-[0.5em] text-white/20 font-black">Project Map</span>
                      <div className="p-1.5 rounded-lg hover:bg-white/5 text-white/20 hover:text-white transition-all"><Plus className="w-3.5 h-3.5" /></div>
                    </div>
                    <FileTreeView
                      nodes={fileTree}
                      selectedFile={selectedFile?.path || null}
                      onSelect={setSelectedFile}
                      onDelete={deleteFile}
                      onRename={renameFile}
                    />
                  </div>
                )}
                <div className="flex-1 overflow-hidden relative">
                  {selectedFile ? (
                    <CodePreview code={selectedFile.content || ""} language={selectedFile.language || "text"} fileName={selectedFile.path} onDownload={() => { const file = allFiles.find(f => f.path === selectedFile.path); if (file) downloadFile(file); }} />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full space-y-6 opacity-10 grayscale">
                      <div className="relative">
                        <Code2 className="w-24 h-24" />
                        <div className="absolute inset-0 bg-purple-500/20 blur-[80px] rounded-full" />
                      </div>
                      <span className="text-[11px] uppercase tracking-[0.8em] font-black">Decrypting Stream</span>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex-1 p-10 bg-[#050505] overflow-auto scrollbar-thin scrollbar-thumb-white/5">
                <LivePreview files={allFiles} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
