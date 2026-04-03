'use client';

import { useEffect } from 'react';
import { resultService } from '@/lib/resultService';
import { analytics } from '@/lib/firebase';

// Analytics wrapper for page views and events
export const useAnalytics = () => {
  useEffect(() => {
    // Page view tracking is automatic with Firebase Analytics
    // Custom events can be tracked as needed
  }, []);

  const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
    try {
      // Firebase Analytics automatically tracks page views
      // For custom events, you would use:
      // import { logEvent } from "firebase/analytics";
      // logEvent(analytics, eventName, parameters);
      console.log('Analytics Event:', eventName, parameters);
    } catch (error) {
      console.error('Error tracking analytics event:', error);
    }
  };

  const trackResultView = (rollCode: string, rollNo: string) => {
    trackEvent('result_viewed', {
      roll_code: rollCode,
      roll_no: rollNo,
      timestamp: new Date().toISOString()
    });
  };

  const trackResultShare = (resultId: string) => {
    trackEvent('result_shared', {
      result_id: resultId,
      timestamp: new Date().toISOString()
    });
  };

  const trackSearch = (searchTerm: string) => {
    trackEvent('search_performed', {
      search_term: searchTerm,
      timestamp: new Date().toISOString()
    });
  };

  return {
    trackEvent,
    trackResultView,
    trackResultShare,
    trackSearch
  };
};

// Firebase initialization hook
export const useFirebase = () => {
  useEffect(() => {
    const initializeFirebase = async () => {
      try {
        await resultService.initialize();
        console.log('Firebase initialized successfully');
      } catch (error) {
        console.error('Failed to initialize Firebase:', error);
      }
    };

    initializeFirebase();
  }, []);

  return resultService;
};
