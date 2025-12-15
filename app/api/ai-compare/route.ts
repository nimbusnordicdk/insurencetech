import { NextResponse } from "next/server";
import { Orq } from "@orq-ai/node";

// BUILD_MARKER_1701_FINAL

export async function POST(req: Request) {
  const { company, insurances } = await req.json();

  if (!company || !Array.isArray(insurances)) {
    return NextResponse.json(
      { error: "Ugyldigt input." },
      { status: 400 }
    );
  }

  const client = new Orq({
    apiKey: process.env.ORQ_API_KEY!,
    environment: "production",
  });

  try {
    const completion = await client.deployments.invoke({
      key: "tryg_compare",
      inputs: {
        question: `Sammenlign Tryg med ${company} for følgende forsikringer: ${insurances.join(
          ", "
        )}. Giv en kort venlig tekst til kunden.`,
      },
    });

    const extractContent = (value: unknown): string | null => {
      if (!value || typeof value !== "object" || !("choices" in value)) {
        return null;
      }

      const choices = (value as { choices: unknown }).choices;
      if (!Array.isArray(choices)) return null;

      const message = choices[0]?.message as unknown;
      if (
        message &&
        typeof message === "object" &&
        "content" in message &&
        typeof (message as { content?: unknown }).content === "string"
      ) {
        return (message as { content: string }).content;
      }

      return null;
    };

    const reply = extractContent(completion) ?? "Kunne ikke hente AI-svar.";

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Orq fejl:", error);
    return NextResponse.json(
      { reply: "Fejl i forbindelse med AI-analyse." },
      { status: 500 }
    );
  }
}
