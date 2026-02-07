// GateZero - Command Bar Hook
// Re-export from context for cleaner imports

import { useContext } from 'react';
import { CommandBarContext, type CommandBarContextType } from '@/contexts/CommandBarContextDef';

export function useCommandBar(): CommandBarContextType {
  const context = useContext(CommandBarContext);
  if (!context) {
    throw new Error('useCommandBar must be used within CommandBarProvider');
  }
  return context;
}
