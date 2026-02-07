// GateZero - AI Command Bar
// Ctrl+K powered natural language assistant

import { useState, useEffect, useRef, useCallback, useContext, type ReactNode } from 'react';
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem, CommandSeparator } from '@/components/ui/command';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { 
  Search, Sparkles, Truck, Users, Shield, AlertTriangle, 
  FileText, Calculator, BarChart3, Settings, Loader2,
  ArrowRight, Clock, TrendingUp, Zap
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { isGeminiConfigured } from '@/services/geminiService';
import { cn } from '@/lib/utils';
import { CommandBarContext } from '@/contexts/CommandBarContextDef';

// Re-export for backward compatibility
export { CommandBarContext } from '@/contexts/CommandBarContextDef';

// Provider component
export function CommandBarProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  
  return (
    <CommandBarContext.Provider value={{ open, setOpen, toggle: () => setOpen(o => !o) }}>
      {children}
    </CommandBarContext.Provider>
  );
}

// Internal hook for this component (hook moved to src/hooks/useCommandBar.ts for external use)
function useCommandBarInternal() {
  const context = useContext(CommandBarContext);
  if (!context) {
    throw new Error('useCommandBar must be used within CommandBarProvider');
  }
  return context;
}

interface CommandAction {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  action: () => void;
  keywords: string[];
  category: 'navigation' | 'action' | 'ai';
}

interface AIResponse {
  answer: string;
  suggestions: string[];
  actions: { label: string; path: string }[];
}

export function AICommandBar() {
  const { open, setOpen } = useCommandBarInternal();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [isAIMode, setIsAIMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [aiResponse, setAIResponse] = useState<AIResponse | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const commands: CommandAction[] = [
    // Navigation
    {
      id: 'nav-gate',
      label: 'Go to The Gate',
      description: 'Vehicle compliance scanning',
      icon: <Shield className="w-4 h-4" />,
      action: () => { navigate('/gate'); setOpen(false); },
      keywords: ['gate', 'scan', 'verify', 'check'],
      category: 'navigation'
    },
    {
      id: 'nav-fleet',
      label: 'Go to Fleet Guard',
      description: 'Manage vehicles and drivers',
      icon: <Truck className="w-4 h-4" />,
      action: () => { navigate('/fleet'); setOpen(false); },
      keywords: ['fleet', 'vehicles', 'trucks', 'drivers'],
      category: 'navigation'
    },
    {
      id: 'nav-operations',
      label: 'Go to Live Operations',
      description: 'Real-time trip tracking',
      icon: <TrendingUp className="w-4 h-4" />,
      action: () => { navigate('/operations'); setOpen(false); },
      keywords: ['operations', 'live', 'trips', 'tracking'],
      category: 'navigation'
    },
    {
      id: 'nav-alerts',
      label: 'Go to Alerts',
      description: 'View compliance alerts',
      icon: <AlertTriangle className="w-4 h-4" />,
      action: () => { navigate('/alerts'); setOpen(false); },
      keywords: ['alerts', 'warnings', 'notifications'],
      category: 'navigation'
    },
    {
      id: 'nav-audit',
      label: 'Go to Audit Logs',
      description: 'View scan history',
      icon: <FileText className="w-4 h-4" />,
      action: () => { navigate('/audit'); setOpen(false); },
      keywords: ['audit', 'logs', 'history', 'records'],
      category: 'navigation'
    },
    {
      id: 'nav-analytics',
      label: 'Go to Analytics',
      description: 'Predictive insights & reports',
      icon: <BarChart3 className="w-4 h-4" />,
      action: () => { navigate('/analytics'); setOpen(false); },
      keywords: ['analytics', 'reports', 'insights', 'data'],
      category: 'navigation'
    },
    {
      id: 'nav-settings',
      label: 'Go to Settings',
      description: 'Organization & API settings',
      icon: <Settings className="w-4 h-4" />,
      action: () => { navigate('/settings'); setOpen(false); },
      keywords: ['settings', 'config', 'api', 'webhooks'],
      category: 'navigation'
    },
    // Actions
    {
      id: 'action-new-scan',
      label: 'Start New Scan',
      description: 'Verify a vehicle now',
      icon: <Zap className="w-4 h-4 text-primary" />,
      action: () => { navigate('/gate'); setOpen(false); },
      keywords: ['scan', 'verify', 'new', 'check', 'vehicle'],
      category: 'action'
    },
    {
      id: 'action-bulk-scan',
      label: 'Bulk Scan',
      description: 'Verify multiple vehicles',
      icon: <Users className="w-4 h-4 text-primary" />,
      action: () => { navigate('/gate?bulk=true'); setOpen(false); },
      keywords: ['bulk', 'batch', 'multiple', 'mass'],
      category: 'action'
    },
    {
      id: 'action-calculator',
      label: 'Penalty Calculator',
      description: 'Calculate potential fines',
      icon: <Calculator className="w-4 h-4 text-primary" />,
      action: () => { navigate('/tools/calculator'); setOpen(false); },
      keywords: ['penalty', 'fine', 'calculator', 'cost'],
      category: 'action'
    },
  ];

  // Filter commands based on query
  const filteredCommands = commands.filter(cmd => {
    if (!query) return true;
    const q = query.toLowerCase();
    return cmd.label.toLowerCase().includes(q) ||
           cmd.description.toLowerCase().includes(q) ||
           cmd.keywords.some(k => k.includes(q));
  });

  // AI Query Handler
  const handleAIQuery = useCallback(async () => {
    if (!query.trim() || !isGeminiConfigured()) return;
    
    setIsLoading(true);
    setIsAIMode(true);

    try {
      const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `You are GateZero AI assistant, a logistics compliance expert for Indian transport regulations. 
                
User query: "${query}"

Context: GateZero is a vehicle compliance verification system that checks RC, insurance, permits, E-Way Bills, and driver licenses. 
Available features: The Gate (scanning), Fleet Guard (vehicle/driver management), Live Operations (trip tracking), Alerts, Audit Logs, Analytics, Settings.

Respond with JSON only:
{
  "answer": "Brief helpful answer (2-3 sentences max)",
  "suggestions": ["Related follow-up question 1", "Related follow-up question 2"],
  "actions": [{"label": "Action button text", "path": "/route-path"}]
}`
              }]
            }],
            generationConfig: { temperature: 0.7, maxOutputTokens: 500 }
          })
        }
      );

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      
      // Parse JSON from response
      let parsed: AIResponse;
      try {
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : {
          answer: text,
          suggestions: [],
          actions: []
        };
      } catch {
        parsed = { answer: text, suggestions: [], actions: [] };
      }
      
      setAIResponse(parsed);
    } catch (error) {
      console.error('AI Query Error:', error);
      setAIResponse({
        answer: "I couldn't process that request. Try asking about vehicle compliance, scanning, or navigation.",
        suggestions: ['How do I scan a vehicle?', 'Show me expiring documents'],
        actions: [{ label: 'Go to The Gate', path: '/gate' }]
      });
    } finally {
      setIsLoading(false);
    }
  }, [query]);

  // Handle Enter key for AI queries
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && query.trim() && isGeminiConfigured()) {
      e.preventDefault();
      handleAIQuery();
    }
  };

  // Reset on close
  useEffect(() => {
    if (!open) {
      setQuery('');
      setIsAIMode(false);
      setAIResponse(null);
    }
  }, [open]);

  // Global keyboard shortcut
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(!open);
      }
    };

    document.addEventListener('keydown', handleGlobalKeyDown);
    return () => document.removeEventListener('keydown', handleGlobalKeyDown);
  }, [open, setOpen]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="p-0 gap-0 max-w-2xl overflow-hidden">
        <Command className="rounded-lg border-0" shouldFilter={false}>
          <div className="flex items-center border-b px-3">
            {isGeminiConfigured() ? (
              <Sparkles className="w-4 h-4 mr-2 text-purple-400" />
            ) : (
              <Search className="w-4 h-4 mr-2 text-muted-foreground" />
            )}
            <CommandInput
              ref={inputRef}
              placeholder={isGeminiConfigured() 
                ? "Ask AI or search... (Press Enter to ask AI)"
                : "Search commands..."
              }
              value={query}
              onValueChange={setQuery}
              onKeyDown={handleKeyDown}
              className="border-0 focus:ring-0"
            />
            {isLoading && <Loader2 className="w-4 h-4 animate-spin text-purple-400" />}
          </div>

          <CommandList className="max-h-[400px]">
            {/* AI Response */}
            {isAIMode && aiResponse && (
              <div className="p-4 border-b bg-gradient-to-br from-purple-500/5 to-blue-500/5">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground">{aiResponse.answer}</p>
                    
                    {aiResponse.actions.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {aiResponse.actions.map((action, i) => (
                          <button
                            key={i}
                            onClick={() => { navigate(action.path); setOpen(false); }}
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                          >
                            {action.label}
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        ))}
                      </div>
                    )}

                    {aiResponse.suggestions.length > 0 && (
                      <div className="mt-3 space-y-1">
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Try asking:</p>
                        {aiResponse.suggestions.map((suggestion, i) => (
                          <button
                            key={i}
                            onClick={() => { setQuery(suggestion); handleAIQuery(); }}
                            className="block text-xs text-muted-foreground hover:text-foreground transition-colors"
                          >
                            "{suggestion}"
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Regular Commands */}
            {!isAIMode && (
              <>
                <CommandEmpty>
                  {isGeminiConfigured() ? (
                    <div className="py-6 text-center">
                      <Sparkles className="w-8 h-8 mx-auto mb-2 text-purple-400" />
                      <p className="text-sm text-muted-foreground">Press Enter to ask AI</p>
                    </div>
                  ) : (
                    <p className="py-6 text-center text-sm text-muted-foreground">No results found.</p>
                  )}
                </CommandEmpty>

                {filteredCommands.filter(c => c.category === 'action').length > 0 && (
                  <CommandGroup heading="Quick Actions">
                    {filteredCommands
                      .filter(c => c.category === 'action')
                      .map(cmd => (
                        <CommandItem key={cmd.id} onSelect={cmd.action} className="cursor-pointer">
                          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center mr-3">
                            {cmd.icon}
                          </div>
                          <div>
                            <p className="font-medium">{cmd.label}</p>
                            <p className="text-xs text-muted-foreground">{cmd.description}</p>
                          </div>
                        </CommandItem>
                      ))}
                  </CommandGroup>
                )}

                {filteredCommands.filter(c => c.category === 'navigation').length > 0 && (
                  <>
                    <CommandSeparator />
                    <CommandGroup heading="Navigation">
                      {filteredCommands
                        .filter(c => c.category === 'navigation')
                        .map(cmd => (
                          <CommandItem key={cmd.id} onSelect={cmd.action} className="cursor-pointer">
                            <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center mr-3">
                              {cmd.icon}
                            </div>
                            <div>
                              <p className="font-medium">{cmd.label}</p>
                              <p className="text-xs text-muted-foreground">{cmd.description}</p>
                            </div>
                          </CommandItem>
                        ))}
                    </CommandGroup>
                  </>
                )}
              </>
            )}
          </CommandList>

          {/* Footer */}
          <div className="flex items-center justify-between px-4 py-2 border-t bg-muted/30 text-[10px] text-muted-foreground">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded bg-muted text-[10px]">↑↓</kbd>
                Navigate
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded bg-muted text-[10px]">↵</kbd>
                {isGeminiConfigured() ? 'Ask AI / Select' : 'Select'}
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded bg-muted text-[10px]">esc</kbd>
                Close
              </span>
            </div>
            {isGeminiConfigured() && (
              <span className="flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-purple-400" />
                AI Powered
              </span>
            )}
          </div>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
