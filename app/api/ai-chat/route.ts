import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "Ingen besked sendt." }, { status: 400 });
    }

    const ORQ_API_KEY = process.env.ORQ_API_KEY;
    const ORQ_DEPLOYMENT_KEY = process.env.ORQ_DEPLOYMENT_KEY || "tryg_agent_v1";

    if (!ORQ_API_KEY) {
      return NextResponse.json({ error: "Mangler ORQ_API_KEY" }, { status: 500 });
    }

    // 👉 Kald Orq nøjagtigt som cURL (inputs + key — ingen tom context)
    const res = await fetch("https://my.orq.ai/v2/deployments/invoke", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${ORQ_API_KEY}`,
      },
      body: JSON.stringify({
        key: ORQ_DEPLOYMENT_KEY,
        inputs: { question: message },
        // context/metadata er valgfrit – udelades for at matche docs’ minimal payload
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      // Giv fuld fejl videre til logs for nem fejlfinding
      console.error("Orq error:", res.status, JSON.stringify(data));
      return NextResponse.json(
        { error: "Orq fejl", details: data },
        { status: res.status }
      );
    }

    const reply = data?.choices?.[0]?.message?.content ?? "Jeg kunne ikke finde et svar 😅";
    return NextResponse.json({ reply });
  } catch (err: any) {
    console.error("AI route fejl:", err);
    return NextResponse.json(
      { error: "Der opstod en serverfejl.", details: err?.message ?? String(err) },
      { status: 500 }
    );
  }
}
