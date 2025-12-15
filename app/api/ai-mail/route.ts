import { NextResponse } from "next/server";

type OrqMessage = {
  content?: string;
};

type OrqChoice = {
  message?: OrqMessage;
};

type OrqResponse = {
  choices?: OrqChoice[];
};

export async function POST(req: Request) {
  const body = await req.json();
  const ORQ_API_KEY = process.env.ORQ_API_KEY;

  if (!ORQ_API_KEY) {
    return NextResponse.json(
      { error: "Mangler ORQ_API_KEY" },
      { status: 500 }
    );
  }

  try {
    const res = await fetch("https://my.orq.ai/v2/deployments/invoke", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${ORQ_API_KEY}`,
      },
      body: JSON.stringify({
        key: "tryg_mail",
        inputs: {
          question: `
Forsikringsselskab: ${body.company}
Forsikringer: ${body.insurances?.join(", ")}
Dækninger: ${Object.entries(body.coverages || {})
  .map(([k, v]) => `${k}: ${v}`)
  .join(", ")}
Kunden værdsætter: ${body.preferences}
Kunden er utilfreds med: ${body.dissatisfaction}
Skriv en professionel, venlig mail hvor Tryg fremhæves som et bedre valg.
          `,
        },
      }),
    });

    const data: OrqResponse = await res.json();

    if (!res.ok) {
      console.error("Orq mail error:", res.status, data);
      return NextResponse.json(
        { error: "Orq fejl", details: data },
        { status: res.status }
      );
    }

    const reply =
      typeof data?.choices?.[0]?.message?.content === "string"
        ? data.choices[0].message.content
        : "Ingen mail genereret 😅";

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Fejl ved Orq:", error);
    return NextResponse.json(
      { error: "Fejl i mailgenerering" },
      { status: 500 }
    );
  }
}
