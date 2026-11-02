import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

/** Recent searches kept on Search transactions (13). */
const MAX_RECENT_SEARCHES = 6;

/** Transactions UI state shared between screens: recent searches (13). In memory only. */
type TransactionsContextValue = {
  recentSearches: string[];
  addRecentSearch: (query: string) => void;
  clearRecentSearches: () => void;
};

const TransactionsContext = createContext<TransactionsContextValue | null>(null);

// Fictional searches from the design, so the list isn't empty on first open.
const INITIAL_RECENT_SEARCHES = ['Netflix', 'Ikeja Electric', 'Tunde'];

export function TransactionsProvider({ children }: { children: ReactNode }) {
  const [recentSearches, setRecentSearches] = useState<string[]>(INITIAL_RECENT_SEARCHES);

  const addRecentSearch = useCallback((query: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;
    setRecentSearches((previous) =>
      [trimmed, ...previous.filter((item) => item.toLowerCase() !== trimmed.toLowerCase())].slice(
        0,
        MAX_RECENT_SEARCHES
      )
    );
  }, []);

  const clearRecentSearches = useCallback(() => setRecentSearches([]), []);

  const value = useMemo(
    () => ({ recentSearches, addRecentSearch, clearRecentSearches }),
    [recentSearches, addRecentSearch, clearRecentSearches]
  );

  return <TransactionsContext.Provider value={value}>{children}</TransactionsContext.Provider>;
}

export function useTransactionsStore() {
  const value = useContext(TransactionsContext);
  if (!value) throw new Error('useTransactionsStore must be used inside <TransactionsProvider>');
  return value;
}
