import { firebaseUtils, initializeAuth } from '@/lib/firebase';

// Types for result data
export interface ResultData {
  rollCode: string;
  rollNo: string;
  name?: string;
  fatherName?: string;
  marks?: Record<string, number>;
  total?: number;
  percentage?: number;
  grade?: string;
  status?: 'pass' | 'fail' | 'pending';
  createdAt: number;
  regNo?: string;
  schoolName?: string;
  division?: string;
  bsebId?: string;
}

export interface HistoryItem extends ResultData {
  id: string;
  shared?: boolean;
  sharedAt?: number;
}

export interface SharedResult extends ResultData {
  id: string;
  sharedBy: string;
  sharedAt: number;
  viewCount?: number;
}

// Local storage keys
const STORAGE_KEYS = {
  RESULTS: 'bihar_results',
  HISTORY: 'bihar_history',
  SHARED: 'bihar_shared',
  USER_PREFERENCES: 'bihar_preferences'
};

// Result management service
export class ResultService {
  private static instance: ResultService;
  private initialized: boolean = false;

  static getInstance(): ResultService {
    if (!ResultService.instance) {
      ResultService.instance = new ResultService();
    }
    return ResultService.instance;
  }

  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      await initializeAuth();
      await this.syncFromLocalStorage();
      this.initialized = true;
      console.log('ResultService initialized with Firebase');
    } catch (error) {
      console.error('Failed to initialize ResultService:', error);
      throw error;
    }
  }

  // Save result to both local storage and Firebase
  async saveResult(result: Omit<ResultData, 'createdAt'>): Promise<string> {
    const resultWithTimestamp: ResultData = {
      ...result,
      createdAt: Date.now()
    };

    // Save to local storage
    this.saveToLocalStorage(STORAGE_KEYS.RESULTS, resultWithTimestamp);

    // Save to Firebase
    try {
      const id = await firebaseUtils.pushData('results', resultWithTimestamp);
      return id;
    } catch (error) {
      console.error('Error saving result to Firebase:', error);
      throw error;
    }
  }

  // Get all results from Firebase (with local storage fallback)
  async getResults(): Promise<ResultData[]> {
    try {
      const results = await firebaseUtils.getData('results');
      return results ? Object.values(results as Record<string, ResultData>) : [];
    } catch (error) {
      console.error('Error getting results from Firebase, falling back to local storage:', error);
      return this.getFromLocalStorage(STORAGE_KEYS.RESULTS) || [];
    }
  }

  // Save to history
  async addToHistory(result: ResultData): Promise<string> {
    const historyItem: HistoryItem = {
      ...result,
      id: Date.now().toString(),
      shared: false
    };

    // Save to local storage
    this.saveToLocalStorage(STORAGE_KEYS.HISTORY, historyItem);

    // Save to Firebase
    try {
      const id = await firebaseUtils.pushData('history', historyItem);
      return id;
    } catch (error) {
      console.error('Error saving history to Firebase:', error);
      throw error;
    }
  }

  // Get history from Firebase
  async getHistory(): Promise<HistoryItem[]> {
    try {
      const history = await firebaseUtils.getData('history');
      return history ? Object.values(history as Record<string, HistoryItem>).sort((a, b) => b.createdAt - a.createdAt) : [];
    } catch (error) {
      console.error('Error getting history from Firebase, falling back to local storage:', error);
      return this.getFromLocalStorage(STORAGE_KEYS.HISTORY) || [];
    }
  }

  // Share a result
  async shareResult(resultId: string, result: ResultData): Promise<string> {
    const sharedResult: SharedResult = {
      ...result,
      id: resultId,
      sharedBy: firebaseUtils.getCurrentUser()?.uid || 'anonymous',
      sharedAt: Date.now(),
      viewCount: 0
    };

    // Update local storage
    const history = this.getFromLocalStorage(STORAGE_KEYS.HISTORY) || [];
    const historyItem = history.find(item => item.id === resultId);
    if (historyItem) {
      historyItem.shared = true;
      historyItem.sharedAt = sharedResult.sharedAt;
      this.saveToLocalStorage(STORAGE_KEYS.HISTORY, history);
    }

    // Save to Firebase shared results
    try {
      const id = await firebaseUtils.pushData('shared', sharedResult);
      return id;
    } catch (error) {
      console.error('Error sharing result to Firebase:', error);
      throw error;
    }
  }

  // Get shared results
  async getSharedResults(): Promise<SharedResult[]> {
    try {
      const shared = await firebaseUtils.getData('shared');
      return shared ? Object.values(shared as Record<string, SharedResult>).sort((a, b) => b.sharedAt - a.sharedAt) : [];
    } catch (error) {
      console.error('Error getting shared results from Firebase:', error);
      return [];
    }
  }

  // Delete specific history item
  async deleteHistoryItem(itemId: string): Promise<void> {
    try {
      await firebaseUtils.deleteData(`history/${itemId}`);
    } catch (error) {
      console.error('Error deleting history item:', error);
      throw error;
    }
  }

  // Clear all history
  async clearHistory(): Promise<void> {
    try {
      const history = await this.getHistory();
      for (const item of history) {
        if (item.id) {
          await firebaseUtils.deleteData(`history/${item.id}`);
        }
      }
    } catch (error) {
      console.error('Error clearing history:', error);
      throw error;
    }
  }

  // Update user preferences
  async updatePreferences(preferences: Record<string, any>): Promise<void> {
    // Save to local storage
    this.saveToLocalStorage(STORAGE_KEYS.USER_PREFERENCES, preferences);

    // Save to Firebase
    try {
      await firebaseUtils.updateData('preferences', preferences);
    } catch (error) {
      console.error('Error saving preferences to Firebase:', error);
      throw error;
    }
  }

  // Get user preferences
  async getPreferences(): Promise<Record<string, any>> {
    try {
      const preferences = await firebaseUtils.getData('preferences');
      return preferences || {};
    } catch (error) {
      console.error('Error getting preferences from Firebase, falling back to local storage:', error);
      return this.getFromLocalStorage(STORAGE_KEYS.USER_PREFERENCES) || {};
    }
  }

  // Listen for real-time updates
  listenToResults(callback: (results: ResultData[]) => void): () => void {
    return firebaseUtils.listenToData('results', (data) => {
      const results = data ? Object.values(data as Record<string, ResultData>) : [];
      callback(results);
    });
  }

  listenToHistory(callback: (history: HistoryItem[]) => void): () => void {
    return firebaseUtils.listenToData('history', (data) => {
      const history = data ? Object.values(data as Record<string, HistoryItem>).sort((a, b) => b.createdAt - a.createdAt) : [];
      callback(history);
    });
  }

  listenToSharedResults(callback: (shared: SharedResult[]) => void): () => void {
    return firebaseUtils.listenToData('shared', (data) => {
      const shared = data ? Object.values(data as Record<string, SharedResult>).sort((a, b) => b.sharedAt - a.sharedAt) : [];
      callback(shared);
    });
  }

  // Sync local storage to Firebase
  private async syncFromLocalStorage(): Promise<void> {
    try {
      const results = this.getFromLocalStorage(STORAGE_KEYS.RESULTS);
      const history = this.getFromLocalStorage(STORAGE_KEYS.HISTORY);
      const preferences = this.getFromLocalStorage(STORAGE_KEYS.USER_PREFERENCES);

      if (results && Array.isArray(results)) {
        for (const result of results) {
          await firebaseUtils.pushData('results', result);
        }
        console.log('Synced results from local storage to Firebase');
      }

      if (history && Array.isArray(history)) {
        for (const item of history) {
          await firebaseUtils.pushData('history', item);
        }
        console.log('Synced history from local storage to Firebase');
      }

      if (preferences) {
        await firebaseUtils.updateData('preferences', preferences);
        console.log('Synced preferences from local storage to Firebase');
      }
    } catch (error) {
      console.error('Error syncing from local storage:', error);
    }
  }

  // Local storage utilities
  private saveToLocalStorage(key: string, data: any): void {
    try {
      const existing = this.getFromLocalStorage(key);
      if (Array.isArray(existing)) {
        existing.push(data);
        localStorage.setItem(key, JSON.stringify(existing));
      } else if (key === STORAGE_KEYS.USER_PREFERENCES) {
        localStorage.setItem(key, JSON.stringify(data));
      } else {
        localStorage.setItem(key, JSON.stringify([data]));
      }
    } catch (error) {
      console.error('Error saving to local storage:', error);
    }
  }

  private getFromLocalStorage(key: string): any {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error getting from local storage:', error);
      return null;
    }
  }

  // Clear local storage (for logout or reset)
  clearLocalStorage(): void {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }
}

// Export singleton instance
export const resultService = ResultService.getInstance();
