"use client";

import { useState } from "react";
import type {
  FortuneRequest,
  FortuneResponse,
  ReadingType,
} from "@/types/fortune";
import { getFortune } from "@/lib/client";

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

  return (
    <main className="mx-auto max-w-lg p-6 space-y-6">
      <h1 className="text-2xl font-bold">Horoskop</h1>

      <div className="grid gap-4">
        {/* Stjärntecken */}
        <label className="grid gap-1">
          <span>Stjärntecken</span>
          <select
            value={sign}
            onChange={(e) => setSign(e.target.value as ZodiacSign)}
            className="border rounded p-2"
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
          className="bg-black text-white rounded p-2 disabled:opacity-50"
        >
          {loading ? "Hämtar…" : "Visa reading"}
        </button>
      </div>

      {error && <p className="text-red-600">{error}</p>}
      {reading && (
        <article className="border rounded p-4 shadow leading-relaxed">
          {date && <p className="text-sm text-gray-500 mb-2">📅 {date}</p>}
          <p>{reading}</p>
        </article>
      )}
    </main>
  );
}
