'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { resultService, ResultData, HistoryItem, SharedResult } from '@/lib/resultService';
import { useAnalytics } from '@/hooks/useFirebase';

interface FirebaseContextType {
  results: ResultData[];
  history: HistoryItem[];
  sharedResults: SharedResult[];
  loading: boolean;
  error: string | null;
  saveResult: (result: Omit<ResultData, 'createdAt'>) => Promise<string>;
  addToHistory: (result: ResultData) => Promise<string>;
  shareResult: (resultId: string, result: ResultData) => Promise<string>;
  getResults: () => Promise<ResultData[]>;
  getHistory: () => Promise<HistoryItem[]>;
  getSharedResults: () => Promise<SharedResult[]>;
  deleteHistoryItem: (entryId: string) => Promise<void>;
  clearAllHistory: () => Promise<void>;
  refreshData: () => Promise<void>;
}

const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined);

interface FirebaseProviderProps {
  children: ReactNode;
}

export function FirebaseProvider({ children }: FirebaseProviderProps) {
  const [results, setResults] = useState<ResultData[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [sharedResults, setSharedResults] = useState<SharedResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { trackResultView, trackResultShare, trackSearch } = useAnalytics();

  // Initialize Firebase and load initial data
  useEffect(() => {
    const initialize = async () => {
      try {
        setLoading(true);
        await resultService.initialize();
        await refreshData();
        
        // Set up real-time listeners
        const unsubscribeResults = resultService.listenToResults((data) => {
          setResults(data);
        });

        const unsubscribeHistory = resultService.listenToHistory((data) => {
          setHistory(data);
        });

        const unsubscribeShared = resultService.listenToSharedResults((data) => {
          setSharedResults(data);
        });

        // Cleanup listeners on unmount
        return () => {
          unsubscribeResults();
          unsubscribeHistory();
          unsubscribeShared();
        };
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to initialize Firebase');
        setLoading(false);
      }
    };

    const cleanup = initialize();
    return () => {
      cleanup.then(unsubscribe => unsubscribe?.());
    };
  }, []);

  const refreshData = async () => {
    try {
      setLoading(true);
      const [resultsData, historyData, sharedData] = await Promise.all([
        resultService.getResults(),
        resultService.getHistory(),
        resultService.getSharedResults()
      ]);

      setResults(resultsData);
      // Deduplicate history by keeping only the latest entry for each rollCode-rollNo combination
      const deduplicatedHistory = historyData.reduce((acc: HistoryItem[], current) => {
        const existingIndex = acc.findIndex(item => 
          item.rollCode === current.rollCode && item.rollNo === current.rollNo
        );
        if (existingIndex === -1) {
          acc.push(current);
        } else {
          // Keep the newer entry (with later createdAt timestamp)
          if (current.createdAt > acc[existingIndex].createdAt) {
            acc[existingIndex] = current;
          }
        }
        return acc;
      }, []).sort((a, b) => b.createdAt - a.createdAt); // Sort by newest first
      
      setHistory(deduplicatedHistory);
      setSharedResults(sharedData);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh data');
    } finally {
      setLoading(false);
    }
  };

  const saveResult = async (result: Omit<ResultData, 'createdAt'>): Promise<string> => {
    try {
      const id = await resultService.saveResult(result);
      await refreshData();
      return id;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save result';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const addToHistory = async (result: ResultData): Promise<string> => {
    try {
      const id = await resultService.addToHistory(result);
      trackResultView(result.rollCode, result.rollNo);
      await refreshData();
      return id;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add to history';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const shareResult = async (resultId: string, result: ResultData): Promise<string> => {
    try {
      const id = await resultService.shareResult(resultId, result);
      trackResultShare(resultId);
      await refreshData();
      return id;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to share result';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const getResults = async (): Promise<ResultData[]> => {
    try {
      return await resultService.getResults();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get results';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const getHistory = async (): Promise<HistoryItem[]> => {
    try {
      return await resultService.getHistory();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get history';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const getSharedResults = async (): Promise<SharedResult[]> => {
    try {
      return await resultService.getSharedResults();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get shared results';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const deleteHistoryItem = async (entryId: string): Promise<void> => {
    try {
      await resultService.deleteHistoryItem(entryId);
      await refreshData();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete history item';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const clearAllHistory = async (): Promise<void> => {
    try {
      await resultService.clearHistory();
      await refreshData();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to clear history';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const value: FirebaseContextType = {
    results,
    history,
    sharedResults,
    loading,
    error,
    saveResult,
    addToHistory,
    shareResult,
    getResults,
    getHistory,
    getSharedResults,
    deleteHistoryItem,
    clearAllHistory,
    refreshData
  };

  return (
    <FirebaseContext.Provider value={value}>
      {children}
    </FirebaseContext.Provider>
  );
}

// Hook to use Firebase context
export function useFirebaseContext() {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useFirebaseContext must be used within a FirebaseProvider');
  }
  return context;
}

// Higher-order component for Firebase integration
export function withFirebase<P extends object>(
  Component: React.ComponentType<P>
) {
  return function FirebaseWrappedComponent(props: P) {
    return (
      <FirebaseProvider>
        <Component {...props} />
      </FirebaseProvider>
    );
  };
}
