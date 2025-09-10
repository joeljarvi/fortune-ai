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
        image: getImagePath(tarotCard),
      };

      function getImagePath(tarotCard) {
        const fileName =
          tarotCard.name.replace(/\s+/g, "").toLowerCase() + ".jpeg";
        console.log("Looking for image:", fileName);
        return `/images/${fileName}`;
      }

      const prompt = `Du är en mystisk tarotkortsläsare. 
      Du svarar alltid som en gatusmart spådam från Södermalm som förklarar tarotkortens visdom på ett modernt, levande och dramatiskt sätt. 
      Håll det kort och slagkraftigt, 3-4 meningar max, och använd aldrig **. 
      
      Användaren har just dragit "${tarotCard.name}".
      Kortets betydelse: ${responseData.tarotReading.meaning_up}
      Beskrivning: ${responseData.tarotReading.desc}
      
      Översätt detta till modern gatuslang på typ en mening och avsluta alltid med att uppmana användaren att dra ett nytt kort.`;
    } else if (readingType === "ai") {
      prompt = `
                Agera som en mystisk och insiktsfull spådam. Svara direkt till användaren med visdom och en aning mystik. Svara på svenska.                
                Ge ett svar som är uppmuntrande, insiktsfullt och ger användaren något att reflektera över. Undvik klyschor och ge ett unikt perspektiv. Strukturera svaret i ett enda stycke.
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
