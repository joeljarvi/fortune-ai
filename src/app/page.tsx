"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
function Starfield() {
  const [stars, setStars] = useState<
    { top: string; left: string; delay: number }[]
  >([]);
  useEffect(() => {
    const newStars = Array.from({ length: 60 }).map(() => ({
      top: `${Math.random() * 100}vh`,
      left: `${Math.random() * 100}vw`,
      delay: Math.random() * 5,
    }));
    setStars(newStars);
  }, []);
  return (
    <div className="absolute inset-0 overflow-hidden">
      {stars.map((star, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-white rounded-full animate-blink"
          style={{
            top: star.top,
            left: star.left,
            animationDelay: `${star.delay}s`,
          }}
        />
      ))}
      <style jsx>{`
        @keyframes blink {
          0%,
          100% {
            opacity: 0.2;
          }
          50% {
            opacity: 1;
          }
        }
        .animate-blink {
          animation: blink 2s infinite;
        }
      `}</style>
    </div>
  );
}
export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-900 via-indigo-900 to-black text-white relative overflow-hidden">
      <Starfield />

      <div className="flex flex-col items-center space-y-6 text-center px-6 z-10">
        <div className="relative inline-block">
          <div className="absolute -inset-6 rounded-full bg-pink-500 blur-3xl opacity-40 animate-pulse" />
          <h1 className="relative text-4xl md:text-6xl font-bold text-pink-400 drop-shadow-[0_0_25px_rgba(236,72,153,1)]">
            Välkommen till Spådamen
          </h1>
        </div>
        <p className="text-lg text-gray-300 max-w-xl">
          Låt stjärnorna och kristallkulan guida dig... Är du redo?
        </p>
        <div className="flex space-x-4">
          <Link href="/pages/oracle">
            <Button>Oraklet</Button>
          </Link>
          <Link href="/pages/tarot">
            <Button>Tarotkort</Button>
          </Link>
          <Link href="/pages/horoscope">
            <Button>Horoskop</Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
