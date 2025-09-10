"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface Sparkle {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
}

export default function SparklesBackground() {
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
