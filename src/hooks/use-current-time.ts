'use client';

import { useState, useEffect } from 'react';

export function useCurrentTime(updateInterval: number = 1000) { // Update every second
  const [currentTime, setCurrentTime] = useState<Date | null>(null); // Initialize to null

  useEffect(() => {
    // Set initial time on client mount
    setCurrentTime(new Date());

    const timerId = setInterval(() => {
      setCurrentTime(new Date());
    }, updateInterval);
    return () => clearInterval(timerId);
  }, [updateInterval]);

  return currentTime;
}
