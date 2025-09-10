"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import SparklesBackground from "@/app/components/SparklesBackground";
import CrystalBall from "@/app/components/CrystalBall";
import { Music } from "lucide-react"
import type { FortuneRequest, FortuneResponse } from "@/types/fortune"; 


export default function Home() {
  const [question, setQuestion] = useState<string>("");
  const [fortune, setFortune] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const askFortune = async () => {
    if (!question) return;
    setLoading(true);
    setFortune("");

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, readingType: "ai"}),
      });

      type FortuneResponse = { aiPrediction?: string };
      const data: FortuneResponse = await res.json();
  
      setFortune(
        data.aiPrediction || "Andarna är tysta just nu. Försök igen senare."
      );
    } catch (err) {
      console.error(err);
      setFortune("Något gick fel i den spirituella kontakten.");
    }
  
    setLoading(false);
  };
  
  const crystalState: "idle" | "loading" | "answered" = loading
    ? "loading"
    : fortune
    ? "answered"
    : "idle";

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center px-4 bg-gradient-to-b from-indigo-900 via-purple-900 to-black text-white font-serif overflow-hidden">
      <SparklesBackground />

      <h1 className="text-3xl sm:text-5xl font-bold mb-16  mt-2  text-purple-300 tracking-widest drop-shadow-lg relative z-10 text-center">
        Fråga oraklet
      </h1>

      <CrystalBall state={crystalState} />

      <input
        type="text"
        placeholder="Ställ din fråga..."
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        className="w-full max-w-xs p-2 sm:p-3 mb-3 sm:mb-4 rounded-lg bg-black/40 border border-purple-400 text-purple-100 placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-lg relative z-10"
      />

      <button
        onClick={askFortune}
        disabled={!question || loading}
        className="w-full max-w-xs px-4 py-2 sm:px-6 sm:py-3 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-base sm:text-lg font-semibold tracking-wider shadow-[0_0_12px_#a855f7] hover:shadow-[0_0_20px_#c084fc] transition-all relative z-10"
      >
        {loading ? "Konsulterar andarna..." : "Visa spådom"}
      </button>

      <button
        onClick={toggleMusic}
        className={`absolute top-4 left-4 p-3 rounded-full bg-purple-700 hover:bg-purple-800 shadow-[0_0_12px_#a855f7] hover:shadow-[0_0_20px_#c084fc] transition-all flex items-center justify-center z-50`}
        aria-label={isPlaying ? "Stäng av musiken" : "Spela mystisk musik"}
        title={isPlaying ? "Stäng av musiken" : "Spela mystisk musik"}
      >
        <Music
          size={28}
          className={`transition-colors duration-300 ${
            isPlaying ? "text-yellow-400 animate-pulse" : "text-white"
          }`}
        />
      </button>



      {/* Audio element */}
      <audio ref={audioRef} loop>
        <source src="/music/whimsical.mp3" type="audio/mpeg" />
        Din webbläsare stödjer inte ljuduppspelning.
      </audio>

      {fortune && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="fortune-box mb-4 sm:mb-6 mt-6 sm:mt-8 p-4 sm:p-6 rounded-2xl border border-purple-500 bg-black/60 shadow-[0_0_25px_#9333ea] w-full max-w-md text-center relative z-10"
        >
          <p className="text-lg sm:text-xl text-purple-200 italic">{fortune}</p>
        </motion.div>
      )}
    </main>
  );
}
