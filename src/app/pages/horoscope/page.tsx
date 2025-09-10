"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { FortuneRequest } from "@/types/fortune";
import { getFortune } from "@/lib/client";
import SparklesBackground from "@/app/components/SparklesBackground";

const ALL_SIGNS = [
  "Aries",
  "Taurus",
  "Gemini",
  "Cancer",
  "Leo",
  "Virgo",
  "Libra",
  "Scorpio",
  "Sagittarius",
  "Capricorn",
  "Aquarius",
  "Pisces",
] as const;

type ZodiacSign = (typeof ALL_SIGNS)[number];

export default function HoroscopePage() {
  const [sign, setSign] = useState<ZodiacSign>("Aries");
  const [loading, setLoading] = useState(false);
  const [reading, setReading] = useState<string | null>(null);
  const [date, setDate] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function fetchHoroscope() {
    setLoading(true);
    setError(null);
    setReading(null);
    setDate(null);

    try {
      const criteria: FortuneRequest = {
        readingType: "horoscope",
        zodiacSign: sign,
      };
      const result = await getFortune(criteria);
      setReading(result.horoscope?.horoscope || "Inget horoskop tillgängligt.");
    } catch (err: any) {
      setError(err.message ?? "Okänt fel");
    } finally {
      setLoading(false);
    }
  }

  // State för animation
  const state: "idle" | "loading" | "answered" = loading
    ? "loading"
    : reading
    ? "answered"
    : "idle";

  return (
     <main className="relative min-h-screen flex flex-col items-center justify-center px-4 bg-gradient-to-b from-black via-blue-900 to-black text-white font-serif overflow-hidden">
          <SparklesBackground />
    
          <h1 className="text-5xl sm:text-3xl font-bold mb-10 mt-2 tracking-widest text-center 
  bg-clip-text text-transparent bg-gradient-to-r from-blue-900 via-blue-700 to-blue-800
">
  Universums råd
</h1>

   
   {/* Chart Wheel */}
      <div className="flex justify-center mb-8">
        <motion.img
         src="/images/chart-wheel.png"
  alt="Chart Wheel"
  className="w-80 h-80 drop-shadow-[0_0_30px_rgba(255,255,255,0.3)]"
  animate={{
    rotate: 360,
    scale: state === "loading" ? [1, 1.05, 1] : 1,
    filter: state === "loading" ? ["drop-shadow(0 0 10px #fff)", "drop-shadow(0 0 20px #fffa)", "drop-shadow(0 0 10px #fff)"] : "none"
  }}
  transition={{
    rotate: { repeat: Infinity, duration: 40, ease: "linear" },
    scale:
      state === "loading"
        ? { repeat: Infinity, duration: 1.5, ease: "easeInOut" }
        : { duration: 0.5 },
          }}
        />
      

     {reading && (
  <motion.article
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.5 }}
    className="absolute left-[60px] top-1/2 -translate-y-1/2 w-80 border rounded-2xl p-4 shadow-xl bg-black/50 backdrop-blur-md text-white leading-relaxed"
  >
  
    {/* Typing animation  */}
    <p className="drop-shadow-[0_0_8px_rgba(255,255,255,0.7)]">
      {reading.split("").map((char, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.02 }} // 30 ms per bokstav
        >
          {char}
        </motion.span>
      ))}
    </p>
  </motion.article>
)}
</div>

      

      <div className="grid gap-4">
        {/* Stjärntecken */}
        <label className="grid gap-1 mb-5 ">
          <span>Din kosmiska vägledare</span>
          <select
            value={sign}
            onChange={(e) => setSign(e.target.value as ZodiacSign)}
            className="border rounded p-2 mb-5 hover:ring-2 hover:ring-blue-400 focus:ring-2 focus:ring-blue-300
transition-all duration-300
"
          >
            {ALL_SIGNS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>

        <button
          onClick={fetchHoroscope}
          disabled={loading}
          className="relative overflow-hidden rounded-2xl px-6 py-3 font-semibold text-white
    bg-gradient-to-r from-blue-900 via-blue-900 to-indigo-900
    transition-all duration-300
    disabled:opacity-50 disabled:cursor-not-allowed
    hover:scale-105 hover:shadow-[0_0_40px_#f0f] hover:shadow-indigo-400/50
    before:absolute before:inset-0 before:bg-white before:opacity-5 before:rounded-2xl
    after:absolute after:top-0 after:left-[-50%] after:w-1/2 after:h-full
    after:bg-white after:opacity-10 after:blur-xl after:rotate-45 mb-10"
        >
          {loading ? "Stjärnorna viskar…" : "Stjärnhimlens vägledning"}
        </button>
      </div>

      
      
    </main>
  );
}
