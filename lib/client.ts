import type { FortuneRequest, FortuneResponse } from "@/types/fortune";

export async function getFortune(
  criteria: FortuneRequest
): Promise<FortuneResponse> {
  const res = await fetch("/api/fortune", {
    method: "POST",
    body: JSON.stringify(criteria),
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    const errorData = await res
      .json()
      .catch(() => ({ error: "Okänt serverfel" }));
    throw new Error(errorData.error || `Ett fel uppstod: ${res.statusText}`);
  }

  return (await res.json()) as FortuneResponse;
}
