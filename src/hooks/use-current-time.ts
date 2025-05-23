'use client';

import { useState, useEffect } from 'react';

export function useCurrentTime(updateInterval: number = 10000) { // Update every 10 seconds
  const [currentTime, setCurrentTime] = useState<Date | null>(null); // Initialize to null

  useEffect(() => {
    // Set initial time on client mount
    setCurrentTime(new Date());

    const timerId = setInterval(() => {
      setCurrentTime(new Date());
    }, updateInterval);
    return () => clearInterval(timerId);
  }, [updateInterval]); // Empty dependency array ensures this runs once on mount for initial set, then interval logic takes over

  return currentTime;
}
