"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

interface Sparkle {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
}

function SparklesBackground() {
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);

  useEffect(() => {
    const stars: Sparkle[] = Array.from({ length: 25 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      delay: Math.random() * 5,
      duration: Math.random() * 10 + 5,
    }));
    setSparkles(stars);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {sparkles.map((star) => (
        <motion.div
          key={star.id}
          initial={{ opacity: 0, y: 0 }}
          animate={{
            opacity: [0, 1, 0],
            y: [0, -30],
          }}
          transition={{
            duration: star.duration,
            delay: star.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="rounded-full bg-purple-300 shadow-[0_0_10px_#a78bfa]"
          style={{
            width: star.size,
            height: star.size,
            position: "absolute",
            left: `${star.x}%`,
            top: `${star.y}%`,
          }}
        />
      ))}
    </div>
  );
}

function CrystalBall({ state }: { state: "idle" | "loading" | "answered" }) {
  return (
    <motion.div
      animate={state === "loading" ? { scale: [1, 1.05, 1] } : { scale: 1 }}
      transition={
        state === "loading"
          ? { repeat: Infinity, duration: 1.5, ease: "easeInOut" }
          : { duration: 0.5 }
      }
      className="w-28 h-28 sm:w-40 sm:h-40 rounded-full flex items-center justify-center mb-4 sm:mb-6 relative z-10 overflow-hidden"
    >
      <motion.div
        className="w-full h-full rounded-full relative flex items-center justify-center"
        animate={
          state === "idle"
            ? {
                boxShadow: [
                  "0 0 10px rgba(167,139,250,0.4)",
                  "0 0 20px rgba(192,132,252,0.6)",
                  "0 0 10px rgba(167,139,250,0.4)",
                ],
              }
            : state === "loading"
            ? {
                boxShadow: [
                  "0 0 20px rgba(236,72,153,0.6)",
                  "0 0 40px rgba(236,72,153,0.9)",
                ],
              }
            : {
                boxShadow: [
                  "0 0 30px rgba(251,191,36,0.7)",
                  "0 0 50px rgba(236,72,153,0.7)",
                ],
              }
        }
        transition={{
          duration: state === "idle" ? 6 : 2,
          repeat: state === "idle" ? Infinity : 0,
          ease: "easeInOut",
        }}
        style={{
          background:
            state === "answered"
              ? "radial-gradient(circle at 50% 50%, #fbbf24, #ec4899)"
              : state === "loading"
              ? "radial-gradient(circle at 50% 50%, #f472b6, #7e22ce)"
              : "radial-gradient(circle at 50% 50%, #a78bfa, #4c1d95)",
        }}
      >
        {state === "idle" && (
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background:
                "radial-gradient(circle at 30% 30%, rgba(192,132,252,0.4), transparent 70%)",
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          />
        )}
        <Sparkles
          className={`w-6 h-6 sm:w-8 sm:h-8 relative z-10 ${
            state === "answered"
              ? "text-yellow-300 drop-shadow-[0_0_8px_#fbbf24]"
              : "text-white/60"
          }`}
        />
      </motion.div>
    </motion.div>
  );
}

export default function Home() {
  const [question, setQuestion] = useState<string>("");
  const [fortune, setFortune] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const askFortune = async () => {
    if (!question) return;
    setLoading(true);
    setFortune("");

    try {
      const res = await fetch("/api/fortune", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });

      type FortuneResponse = { fortune?: string };
      const data: FortuneResponse = await res.json();
      setFortune(data.fortune || "Andarna är tysta...");
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
