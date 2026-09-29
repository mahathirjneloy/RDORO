import { useState, useEffect, useCallback } from "react";
import { isPermissionGranted, requestPermission, sendNotification } from "@tauri-apps/plugin-notification";
import useSound from "use-sound";
import completeSound from "../assets/sounds/complete.ogg";

export type Mode = "work" | "shortBreak" | "longBreak";

export function usePomodoro() {
  const [durations, setDurations] = useState({
    work: 25 * 60,
    shortBreak: 5 * 60,
    longBreak: 15 * 60,
  });

  const [mode, setMode] = useState<Mode>("work");
  const [time, setTime] = useState(durations.work);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);

  const [playComplete] = useSound(completeSound, { volume: 0.5 });

  const updateDuration = useCallback((newMode: Mode, minutes: number) => {
    setDurations((prev) => {
      const newDurations = { ...prev, [newMode]: minutes * 60 };
      if (mode === newMode && !isRunning) {
        setTime(newDurations[newMode]);
      }
      return newDurations;
    });
  }, [mode, isRunning]);

  const switchMode = useCallback((newMode: Mode) => {
    setMode(newMode);
    setTime(durations[newMode]);
    setIsRunning(false);
  }, [durations]);

  const toggleTimer = useCallback(() => {
    setIsRunning((prev) => !prev);
  }, []);

  const resetTimer = useCallback(() => {
    setTime(durations[mode]);
    setIsRunning(false);
  }, [mode, durations]);

  const notifyComplete = useCallback(async () => {
    playComplete();
    let permissionGranted = await isPermissionGranted();
    if (!permissionGranted) {
      const permission = await requestPermission();
      permissionGranted = permission === "granted";
    }

    if (permissionGranted) {
      const title = mode === "work" ? "Session Complete!" : "Break Over!";
      const body = mode === "work"
        ? "Time to take a break."
        : "Time to get back to work.";

      sendNotification({ title, body });
    }
  }, [mode]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (isRunning && time > 0) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
    } else if (isRunning && time === 0) {
      setIsRunning(false);
      if (mode === "work") {
        setSessionsCompleted((prev) => prev + 1);
      }
      notifyComplete();
    }

    return () => clearInterval(interval);
  }, [isRunning, time, notifyComplete]);

  return {
    mode,
    time,
    isRunning,
    durations,
    sessionsCompleted,
    switchMode,
    toggleTimer,
    resetTimer,
    updateDuration,
  };
}
