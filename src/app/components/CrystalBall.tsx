"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export default function CrystalBall({
  state,
}: {
  state: "idle" | "loading" | "answered";
}) {
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
