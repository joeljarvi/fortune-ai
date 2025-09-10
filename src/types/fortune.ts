export type ReadingType = "horoscope" | "tarot" | "ai";

export type FortuneRequest = {
  readingType: ReadingType;
  zodiacSign: string | null;
  question: string | null;
};

export type FortuneResponse = {
  horoscope?: {
    date: string;
    horoscope: string;
    sun_sign: string;
  };
  tarotReading?: {
    name: string;
    meaning_up: string;
    desc: string;
    image: string;
  };
  aiPrediction: string;
  timestamp: string;
};
