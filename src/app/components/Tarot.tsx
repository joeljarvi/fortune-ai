"use client";

import { useState } from "react";
import CardBrowser from "./CardBrowser";
import { Button } from "@/components/ui/button";

export default function Tarot() {
  const [startGame, setStartGame] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleStart = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStartGame(true);
    }, 1800); // simulate shuffle/loading
  };

  return (
    <>
      {/* START SCREEN  */}
      {!startGame ? (
        <>
          <div className="absolute top-0 w-full min-h-screen flex flex-col items-center justify-center gap-8 bg-cover bg-center bg-[url('/images/tarot-page-background.jpg')] z-0"></div>
          <div className="relative w-full min-h-screen z-10 flex flex-col items-center justify-center gap-4 bg-purple-600/30 backdrop-blur-md">
            <h1 className="text-4xl font-bold text-white">Tarot</h1>
            <p className="max-w-md text-center text-white">
              Välkommen in till Tarot-göken! Ta't lugnt så ska jag bara blanda
              korten...
            </p>
            <Button onClick={handleStart} disabled={loading}>
              {loading ? "Ok nu blandar vi verkligen korten..." : "Sätt igång"}
            </Button>
          </div>
        </>
      ) : (
        // GAME SCREEN

        <CardBrowser />
      )}
    </>
  );
}
