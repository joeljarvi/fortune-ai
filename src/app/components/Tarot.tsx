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
        <div className="w-full min-h-screen flex flex-col items-center justify-center ">
          <h1 className="text-4xl font-bold mb-4">Tarot</h1>
          <p>
            Välkommen in till Tarot-göken! Ta't lugnt så ska jag bara blanda
            korten
          </p>
          <Button onClick={handleStart} disabled={loading}>
            {loading ? "Blandar korten..." : "Sätt igång"}
          </Button>
        </div>
      ) : (
        // GAME SCREEN
        <CardBrowser />
      )}
    </>
  );
}
