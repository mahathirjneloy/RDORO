import { Play, Pause, RotateCcw, Settings, X } from "lucide-react";
import { usePomodoro, Mode } from "./hooks/usePomodoro";
import { useState } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function App() {
  const { mode, time, isRunning, durations, sessionsCompleted, switchMode, toggleTimer, resetTimer, updateDuration } = usePomodoro();
  const [showSettings, setShowSettings] = useState(false);

  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  const timeString = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

  const modes: { id: Mode; label: string }[] = [
    { id: "work", label: "Work" },
    { id: "shortBreak", label: "Short Break" },
    { id: "longBreak", label: "Long Break" },
  ];

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 font-sans transition-colors duration-300 relative">
      <main className="flex flex-col items-center p-8 max-w-sm w-full bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl dark:shadow-none border border-zinc-200 dark:border-zinc-800 relative overflow-hidden">

        {/* Settings Toggle Button */}
        <button
          onClick={() => setShowSettings(true)}
          className="absolute top-6 right-6 p-2 rounded-full text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
        >
          <Settings className="w-5 h-5" />
        </button>

        {/* Sessions Counter */}
        <div className="absolute top-6 left-6 text-sm font-medium text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-full">
          #{sessionsCompleted}
        </div>

        {/* Mode Selector */}
        <div className="flex space-x-2 bg-zinc-100 dark:bg-zinc-950 p-1 rounded-full mb-12">
          {modes.map((m) => (
            <button
              key={m.id}
              onClick={() => switchMode(m.id)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
                mode === m.id
                  ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm"
                  : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300"
              )}
            >
              {m.label}
            </button>
          ))}
        </div>

        {/* Timer Display */}
        <div className="text-[5rem] font-bold tracking-tighter tabular-nums mb-12 text-zinc-800 dark:text-zinc-100">
          {timeString}
        </div>

        {/* Controls */}
        <div className="flex items-center space-x-6 mb-4">
          <button
            onClick={resetTimer}
            className="p-4 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
            title="Reset Timer"
          >
            <RotateCcw className="w-6 h-6" />
          </button>

          <button
            onClick={toggleTimer}
            className={cn(
              "p-6 rounded-full text-white shadow-lg transition-transform active:scale-95",
              isRunning
                ? "bg-red-500 hover:bg-red-600 shadow-red-500/30"
                : "bg-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 shadow-zinc-900/30 dark:shadow-zinc-100/30"
            )}
          >
            {isRunning ? (
              <Pause className="w-8 h-8 fill-current" />
            ) : (
              <Play className="w-8 h-8 fill-current ml-1" />
            )}
          </button>
        </div>

        {/* Settings Modal/Overlay */}
        {showSettings && (
          <div className="absolute inset-0 bg-white dark:bg-zinc-900 z-10 flex flex-col p-8 rounded-3xl">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-bold">Settings</h2>
              <button
                onClick={() => setShowSettings(false)}
                className="p-2 rounded-full text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col space-y-6">
              {modes.map((m) => (
                <div key={m.id} className="flex flex-col space-y-2">
                  <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                    {m.label} Duration (minutes)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={Math.floor(durations[m.id] / 60)}
                    onChange={(e) => updateDuration(m.id, parseInt(e.target.value) || 1)}
                    className="p-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 border-none outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white transition-shadow"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

      </main>
    </div>
  );
}

export default App;
