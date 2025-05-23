'use client';

import { useState, useEffect } from 'react';

export function useCurrentTime(updateInterval: number = 10000) { // Update every 10 seconds
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timerId = setInterval(() => {
      setCurrentTime(new Date());
    }, updateInterval);
    return () => clearInterval(timerId);
  }, [updateInterval]);

  return currentTime;
}
