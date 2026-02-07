// GateZero - Command Bar Context Definition
// Separated for Fast Refresh compatibility

import { createContext } from 'react';

export interface CommandBarContextType {
  open: boolean;
  setOpen: (open: boolean) => void;
  toggle: () => void;
}

export const CommandBarContext = createContext<CommandBarContextType | null>(null);
