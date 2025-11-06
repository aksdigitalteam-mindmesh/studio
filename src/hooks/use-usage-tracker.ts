
"use client";

import { useState, useEffect, useCallback } from 'react';
import { differenceInDays } from 'date-fns';

const USAGE_LIMIT = 6;
const USAGE_STORAGE_KEY = 'fit-pulse_ai_usage';

type UsageData = {
  count: number;
  startDate: string; // ISO string
};

export function useUsageTracker() {
  const [usageData, setUsageData] = useState<UsageData | null>(null);
  
  // This effect runs only on the client to get data from localStorage
  useEffect(() => {
    const storedData = localStorage.getItem(USAGE_STORAGE_KEY);
    if (storedData) {
      try {
        const parsedData: UsageData = JSON.parse(storedData);
        // Check if the usage week has expired
        const daysSinceStart = differenceInDays(new Date(), new Date(parsedData.startDate));
        if (daysSinceStart >= 7) {
          // If it's been a week or more, reset the data
          localStorage.removeItem(USAGE_STORAGE_KEY);
          setUsageData(null);
        } else {
          setUsageData(parsedData);
        }
      } catch (e) {
        console.error("Failed to parse usage data, resetting.", e);
        localStorage.removeItem(USAGE_STORAGE_KEY);
        setUsageData(null);
      }
    } else {
        setUsageData(null);
    }
  }, []);

  const canUse = useCallback((): boolean => {
    return usageData === null || usageData.count < USAGE_LIMIT;
  }, [usageData]);

  const recordUsage = useCallback(() => {
    let newData: UsageData;
    if (usageData) {
      // Increment the count if data already exists
      newData = { ...usageData, count: usageData.count + 1 };
    } else {
      // Start a new tracking period
      newData = { count: 1, startDate: new Date().toISOString() };
    }
    
    localStorage.setItem(USAGE_STORAGE_KEY, JSON.stringify(newData));
    setUsageData(newData);
  }, [usageData]);

  const usagesLeft = usageData ? USAGE_LIMIT - usageData.count : USAGE_LIMIT;

  return {
    canUse,
    recordUsage,
    usagesLeft: usagesLeft < 0 ? 0 : usagesLeft,
    totalUsages: usageData?.count || 0,
  };
}
