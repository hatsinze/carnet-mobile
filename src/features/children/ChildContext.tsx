import * as SecureStore from "expo-secure-store";
import { createContext, useContext, useState, type ReactNode } from "react";
import type { EleveSummary } from "../../types/eleve";

interface ChildContextValue {
  children: EleveSummary[];
  setChildren: (children: EleveSummary[]) => void;
  selectedChild: EleveSummary | null;
  selectChild: (child: EleveSummary) => void;
  isReady: boolean;
}

const ChildContext = createContext<ChildContextValue | undefined>(undefined);

const STORAGE_KEY = "selected_child_id";

export function ChildProvider({
  children: reactChildren,
}: {
  children: ReactNode;
}) {
  const [children, setChildrenState] = useState<EleveSummary[]>([]);
  const [selectedChild, setSelectedChild] = useState<EleveSummary | null>(null);
  const [isReady, setIsReady] = useState(false);

  function setChildren(list: EleveSummary[]) {
    setChildrenState(list);

    if (list.length === 0) {
      setSelectedChild(null);
      setIsReady(true);
      return;
    }

    (async () => {
      const savedId = await SecureStore.getItemAsync(STORAGE_KEY);
      const match = list.find((c) => String(c.id) === savedId);
      setSelectedChild(match ?? list[0]);
      setIsReady(true);
    })();
  }

  function selectChild(child: EleveSummary) {
    setSelectedChild(child);
    SecureStore.setItemAsync(STORAGE_KEY, String(child.id));
  }

  return (
    <ChildContext.Provider
      value={{ children, setChildren, selectedChild, selectChild, isReady }}
    >
      {reactChildren}
    </ChildContext.Provider>
  );
}

export function useChildContext() {
  const ctx = useContext(ChildContext);
  if (!ctx)
    throw new Error("useChildContext must be used within ChildProvider");
  return ctx;
}
