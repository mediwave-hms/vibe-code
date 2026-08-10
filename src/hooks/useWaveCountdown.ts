import { useEffect, useState } from 'react';
import { useStore } from '../store';
import { Wave } from '../types/models';
import { WaveStatus } from '../types/enums';

function computeCountdown(endDate: Date | null) {
  if (!endDate) {
    return { daysLeft: 0, hoursLeft: 0, minutesLeft: 0, totalMsLeft: 0, isEndingSoon: false };
  }
  const totalMsLeft = Math.max(0, new Date(endDate).getTime() - Date.now());
  const daysLeft = Math.floor(totalMsLeft / (1000 * 60 * 60 * 24));
  const hoursLeft = Math.floor((totalMsLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutesLeft = Math.floor((totalMsLeft % (1000 * 60 * 60)) / (1000 * 60));
  const isEndingSoon = totalMsLeft > 0 && totalMsLeft < 48 * 60 * 60 * 1000;
  return { daysLeft, hoursLeft, minutesLeft, totalMsLeft, isEndingSoon };
}

export function useWaveCountdown() {
  const waves = useStore((state) => state.waves);
  const autoRolloverCheck = useStore((state) => state.autoRolloverCheck);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 60 * 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    autoRolloverCheck();
  }, [now, autoRolloverCheck]);

  const currentWave: Wave | undefined = waves.find((w) => w.status === WaveStatus.ACTIVE);
  const countdown = computeCountdown(currentWave?.endDate ?? null);

  return {
    currentWave: currentWave ?? null,
    ...countdown,
  };
}

export default useWaveCountdown;
