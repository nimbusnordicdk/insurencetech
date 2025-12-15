import { NextResponse } from "next/server";
import { Orq } from "@orq-ai/node";

type OrqMessage = {
  content?: string;
};

type OrqChoice = {
  message?: OrqMessage;
};

type OrqCompletion = {
  choices?: OrqChoice[];
};

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
    const raw = await client.deployments.invoke({
      key: "tryg_compare",
      inputs: {
        question: `Sammenlign Tryg med ${company} for følgende forsikringer: ${insurances.join(
          ", "
        )}. Giv en kort venlig tekst til kunden.`,
      },
    });

    const completion = raw as unknown as OrqCompletion;

    const reply =
      typeof completion?.choices?.[0]?.message?.content === "string"
        ? completion.choices[0].message.content
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
