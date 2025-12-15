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

    // 🔒 ABSOLUT TYPESIKKER LØSNING
    let reply = "Kunne ikke hente AI-svar.";

    if (
      completion &&
      typeof completion === "object" &&
      "choices" in completion &&
      Array.isArray((completion as any).choices) &&
      (completion as any).choices[0]?.message &&
      typeof (completion as any).choices[0].message.content === "string"
    ) {
      reply = (completion as any).choices[0].message.content;
    }

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Orq fejl:", error);
    return NextResponse.json(
      { reply: "Fejl i forbindelse med AI-analyse." },
      { status: 500 }
    );
  }
}
