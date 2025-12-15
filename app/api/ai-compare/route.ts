import { NextResponse } from "next/server";
import { Orq } from "@orq-ai/node";

// ✅ Define the expected structure of the Orq API response
type CompletionResponse = {
  choices: {
    message: {
      content: string;
    };
  }[];
};

export async function POST(req: Request) {
  // ✅ Parse incoming request body
  const { company, insurances } = await req.json();

  // ✅ Validate input
  if (!company || !Array.isArray(insurances)) {
    return NextResponse.json(
      { error: "Ugyldigt input." },
      { status: 400 }
    );
  }

  // ✅ Initialize Orq client
  const client = new Orq({
    apiKey: process.env.ORQ_API_KEY!,
    environment: "production",
  });

  try {
    // ✅ Invoke Orq AI model
    const completion = await client.deployments.invoke({
      key: "tryg_compare",
      inputs: {
        question: `Sammenlign Tryg med ${company} for følgende forsikringer: ${insurances.join(
          ", "
        )}. Giv en kort venlig tekst til kunden.`,
      },
    });

    // ✅ Type cast response safely
    const completionTyped = completion as CompletionResponse;

    // ✅ Safely extract reply
    const reply =
      completionTyped?.choices?.[0]?.message?.content ?? "Kunne ikke hente AI-svar.";

    // ✅ Return reply
    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Orq fejl:", error);
    return NextResponse.json(
      { reply: "Fejl i forbindelse med AI-analyse." },
      { status: 500 }
    );
  }
}
