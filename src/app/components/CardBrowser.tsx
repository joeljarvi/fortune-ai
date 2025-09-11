"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import Image from "next/image";
import Lenis from "lenis";
import { TypingText } from "@/components/animate-ui/primitives/texts/typing";

const NUM_SLOTS = 22;

function FlippingCard({
  onReveal,
  onHide,
}: {
  onReveal: (card: any) => void;
  onHide: () => void;
}) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [frontCard, setFrontCard] = useState<any | null>(null);

  const handleClick = async () => {
    if (!isFlipped) {
      try {
        const res = await fetch("/api/ai", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ readingType: "tarot" }),
        });

        if (!res.ok) {
          const text = await res.text();
          console.error("API error:", res.status, text);
          throw new Error("Kunde inte hämta tarotkort");
        }

        const data = await res.json();
        const card = data.tarotReading;
        setFrontCard(card);
        setIsFlipped(true);
        onReveal(card);
      } catch (err) {
        console.error("Error fetching tarot card:", err);
        alert("Kunde inte hämta tarotkort. Kolla konsolen för mer info.");
      }
    } else {
      setIsFlipped(false);
      setFrontCard(null);
      onHide();
    }
  };

  return (
    <motion.div
      style={{ width: 300, height: 500, perspective: 1000 }}
      onClick={handleClick}
      className="cursor-pointer"
    >
      <motion.div
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          transformStyle: "preserve-3d",
        }}
      >
        {/* Baksida */}
        <motion.div
          style={{
            position: "absolute",
            backfaceVisibility: "hidden",
            width: "100%",
            height: "100%",
          }}
        >
          <Image
            src="/images/tarot-back-3.png"
            alt="tarot-back"
            fill
            className="object-cover rounded-2xl border-6 border-blue-900"
          />
        </motion.div>

        {/* Framsida */}
        <motion.div
          style={{
            position: "absolute",
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            width: "100%",
            height: "100%",
          }}
        >
          {frontCard && (
            <Image
              src={frontCard.image}
              alt={frontCard.name}
              fill
              className="object-cover rounded-2xl border-6 border-blue-900"
            />
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default function CardBrowser() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      orientation: "vertical",
      easing: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  useEffect(() => {
    if (!loading && messages.length === 0) {
      setMessages([
        "Sådärja, skrolla genom kortleken och klicka på ett kort vetja!",
      ]);
    }
  }, [loading]);

  const generateTarotMessage = async (card: any) => {
    setLoading(true);
    setMessages([""]);

    try {
      const prompt = `The user has drawn "${card.name}". Comment on the ${card.desc}. Translate it to modern Swedish in 3-4 sentences like you were born and raised in the streets of Södermalm. End by telling the user to draw a new card.`;

      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ readingType: "ai", question: prompt }),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("API error:", res.status, text);
        throw new Error("Kunde inte hämta AI-svar");
      }

      const data = await res.json();
      setMessages([`Tarot-göken: ${data.aiPrediction}`]);
    } catch (err) {
      console.error(err);
      setMessages(["⚠️ Nåt gick snett."]);
    } finally {
      setLoading(false);
    }
  };

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    mass: 0.5,
  });

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 p-4 flex items-center justify-center">
        <motion.div className="h-2 bg-neutral-200 z-50 w-xl">
          <motion.div
            className="h-2 bg-blue-800 origin-left"
            style={{ scaleX }}
          />
        </motion.div>
      </div>

      <div
        ref={containerRef}
        style={{ height: `${NUM_SLOTS * 100}vh` }}
        className="relative flex flex-col items-center justify-center z-0 "
      >
        {Array.from({ length: NUM_SLOTS }).map((_, i) => {
          const start = i / NUM_SLOTS;
          const end = (i + 1) / NUM_SLOTS;

          const scale = useTransform(
            scrollYProgress,
            [start, (start + end) / 2, end],
            [0.85, 1.05, 0.85]
          );
          const rotate = useTransform(
            scrollYProgress,
            [start, (start + end) / 2, end],
            [-5, 0, 5]
          );

          return (
            <motion.div
              key={i}
              style={{ scale, rotate }}
              className="sticky top-0 z-10 flex items-center justify-center h-screen"
            >
              <FlippingCard
                onReveal={generateTarotMessage}
                onHide={() => {
                  setMessages([]);
                  setLoading(false);
                }}
              />
            </motion.div>
          );
        })}
      </div>

      <div className="fixed top-4 left-0 flex flex-col items-center justify-center px-4 z-50 lg:text-xl w-full leading-tight">
        {messages.map((m, i) => (
          <TypingText
            key={i}
            text={m}
            className="shadow-sm mb-2 font-bold bg-black text-white w-md lg:w-xl"
          />
        ))}
        {loading && (
          <TypingText
            text="Tarot-Göken funderar..."
            className="shadow-sm mb-2 font-bold bg-black text-white w-md lg:w-xl"
          />
        )}
      </div>
    </>
  );
}
