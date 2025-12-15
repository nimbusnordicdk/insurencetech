import { NextResponse } from "next/server";
import { Orq } from "@orq-ai/node";

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

    // 🔥 HARD FIX: ingen TypeScript-typing, ingen message.content
    const json = JSON.parse(JSON.stringify(completion));

    const reply =
      json &&
      json.choices &&
      json.choices[0] &&
      json.choices[0].message &&
      typeof json.choices[0].message.content === "string"
        ? json.choices[0].message.content
        : "Kunne ikke hente AI-svar.";

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Orq fejl:", error);
    return NextResponse.json(
      { reply: "Fejl i forbindelse med AI-analyse." },
      { status: 500 }
    );
  }
}
