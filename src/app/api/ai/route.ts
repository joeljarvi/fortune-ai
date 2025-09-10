import { z } from "zod";
import type { FortuneRequest, FortuneResponse } from "@/types/fortune";

const FortuneRequestSchema = z.object({
  readingType: z.enum(["horoscope", "tarot", "ai"]),
  zodiacSign: z.string().nullable().optional(),
  question: z
    .string()
    .min(5, "Frågan måste vara minst 5 tecken lång")
    .optional()
    .nullable(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("Received body:", body);

    const validationResult = FortuneRequestSchema.safeParse(body);
    if (!validationResult.success) {
      return Response.json(
        {
          error: "Ogiltig indata",
          details: validationResult.error.flatten(),
        },
        { status: 400 }
      );
    }

    const { zodiacSign, question, readingType }: FortuneRequest =
      validationResult.data;

    if (readingType === "horoscope" && !zodiacSign) {
      return Response.json(
        { error: "Stjärntecken måste anges för horoskopläsning." },
        { status: 400 }
      );
    }

    let prompt = "";
    let responseData: Partial<FortuneResponse> = {
      timestamp: new Date().toISOString(),
    };

    if (readingType === "horoscope") {
      const horoscopeRes = await fetch(
        `https://horoscope-app-api.vercel.app/api/v1/get-horoscope/daily?sign=${zodiacSign}&day=TODAY`
      );
      if (!horoscopeRes.ok) {
        console.error("Horoscope API Error:", await horoscopeRes.text());
        return Response.json(
          { error: "Kunde inte hämta data från horoskoptjänsten." },
          { status: 502 }
        );
      }
      const horoscopeData = await horoscopeRes.json();

      responseData.horoscope = {
        date: horoscopeData.data.date,
        horoscope: horoscopeData.data.horoscope_data,
        sun_sign: horoscopeData.data.sun_sign,
      };

      prompt = `
                Agera som en mystisk och insiktsfull spådam. Skapa en personlig förutsägelse baserat på följande information. Svara på svenska.
                **Stjärntecken:** ${zodiacSign}
                **Dagens horoskop:** "${responseData.horoscope.horoscope}"
                Ge ett svar som använder horoskopet för att ge vägledning.
                Svaret ska vara uppmuntrande, mystiskt och ge användaren något att reflektera över. Strukturera svaret i max 4 meningar.
            `;
    } else if (readingType === "tarot") {
      const tarotRes = await fetch(
        "https://tarotapi.dev/api/v1/cards/random?n=1"
      );
      if (!tarotRes.ok) {
        console.error("Tarot API Error:", await tarotRes.text());
        return Response.json(
          { error: "Kunde inte hämta data från tarottjänsten." },
          { status: 502 }
        );
      }
      const tarotData = await tarotRes.json();
      const tarotCard = tarotData.cards[0];

      responseData.tarotReading = {
        name: tarotCard.name,
        meaning_up: tarotCard.meaning_up,
        desc: tarotCard.desc,
        image: `https://tarotapi.dev/public/images/cards/${tarotCard.value}.jpg`,
      };

      prompt = `
                Agera som en mystisk och insiktsfull spådam. Tolka ett tarotkort för att besvara en persons fråga. Svara på svenska.                
                **Draget tarotkort:** ${tarotCard.name}
                **Kortets betydelse (rättvänt):** "${responseData.tarotReading.meaning_up}"
                **Kortets beskrivning:** "${responseData.tarotReading.desc}"
                Ge ett svar som väver samman tarotkortets symbolik för att ge vägledning kring användarens fråga.
                Svaret ska vara uppmuntrande, mystiskt och ge användaren något att reflektera över. Strukturera svaret i ett enda stycke.
            `;
    } else if (readingType === "ai") {
      prompt = `
                Agera som en kvick, fräck häxa som spår med en blandning av modern slang och magisk stil. Du är lekfull, självsäker och ibland slänger du in en fräck grillning samtidigt som du ger mystiskt klingande svar i högst 3 meningar. Svara direkt på användarens fråga med visdom och en aning mystik. Svara på svenska och använd inte svärord eller skällsord.
                **Användarens fråga:** "${question}"
            `;
    }

    const apiKey = process.env.NEXT_PUBLIC_API_KEY;
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
    const payload = { contents: [{ parts: [{ text: prompt }] }] };
    const aiResponse = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!aiResponse.ok) {
      const errorBody = await aiResponse.text();
      console.error("Gemini API Error:", errorBody);
      return Response.json(
        { error: "Kunde inte generera AI-förutsägelse." },
        { status: 500 }
      );
    }

    const aiResult = await aiResponse.json();
    responseData.aiPrediction =
      aiResult.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Kunde inte tolka sierskans viskningar just nu. Försök igen senare.";

    return Response.json(responseData as FortuneResponse, { status: 200 });
  } catch (error) {
    console.error("Internt serverfel:", error);
    return Response.json(
      { error: "Ett oväntat fel inträffade." },
      { status: 500 }
    );
  }
}
