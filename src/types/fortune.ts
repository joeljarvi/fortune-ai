export type ReadingType = "horoscope" | "tarot";

export type FortuneRequest = {
  readingType: ReadingType;
  zodiacSign: string;
  question: string;
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
