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
    
    // Type-safe extraction with runtime checks
    let reply = "Kunne ikke hente AI-svar.";
    
    if (completion && typeof completion === "object" && "choices" in completion) {
      const choices = (completion as any).choices;
      if (Array.isArray(choices) && choices.length > 0) {
        const firstChoice = choices[0];
        if (firstChoice && typeof firstChoice === "object" && "message" in firstChoice) {
          const message = firstChoice.message;
          // Check if message has content property
          if (message && typeof message === "object" && "content" in message) {
            const content = (message as any).content;
            if (typeof content === "string") {
              reply = content;
            }
          }
        }
      }
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