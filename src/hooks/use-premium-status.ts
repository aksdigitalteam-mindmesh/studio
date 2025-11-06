
"use client";

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { differenceInDays } from 'date-fns';

const PREMIUM_DURATION_DAYS = 30;
const SUBSCRIPTION_STORAGE_KEY = 'fit-pulse_subscription';

type Subscription = {
  isPremium: boolean;
  startDate: string;
};

export function usePremiumStatus() {
  const searchParams = useSearchParams();
  const isUpgraded = searchParams.get('upgraded') === 'true';
  const [isPremium, setIsPremium] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // This effect runs only on the client
    const checkPremiumStatus = () => {
      let subscription: Subscription | null = null;
      const storedSub = localStorage.getItem(SUBSCRIPTION_STORAGE_KEY);
      
      if (storedSub) {
        try {
          subscription = JSON.parse(storedSub);
        } catch (e) {
          console.error("Failed to parse subscription from localStorage", e);
          // Clear invalid data
          localStorage.removeItem(SUBSCRIPTION_STORAGE_KEY);
        }
      }

      // If user just upgraded, create the subscription object
      if (isUpgraded && (!subscription || !subscription.isPremium)) {
        const newSub = {
          isPremium: true,
          startDate: new Date().toISOString(),
        };
        localStorage.setItem(SUBSCRIPTION_STORAGE_KEY, JSON.stringify(newSub));
        subscription = newSub;
      }
      
      if (subscription?.isPremium) {
        const daysSinceStart = differenceInDays(new Date(), new Date(subscription.startDate));
        if (daysSinceStart < PREMIUM_DURATION_DAYS) {
          setIsPremium(true);
        } else {
          // Subscription expired
          setIsPremium(false);
          localStorage.removeItem(SUBSCRIPTION_STORAGE_KEY);
        }
      } else {
        setIsPremium(false);
      }
      setIsLoading(false);
    };

    checkPremiumStatus();
    
    // Listen for storage changes from other tabs
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === SUBSCRIPTION_STORAGE_KEY) {
        checkPremiumStatus();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };

  }, [isUpgraded]);

  return { isPremium, isLoading };
}
