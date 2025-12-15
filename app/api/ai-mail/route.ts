import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const ORQ_API_KEY = process.env.ORQ_API_KEY;

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
          Forsikringer: ${body.insurances.join(", ")}
          Dækninger: ${Object.entries(body.coverages)
            .map(([k, v]) => `${k}: ${v}`)
            .join(", ")}
          Kunden værdsætter: ${body.preferences}
          Kunden er utilfreds med: ${body.dissatisfaction}
          Skriv en professionel, venlig mail hvor Tryg fremhæves som et bedre valg.
          `,
        },
      }),
    });

    const data = await res.json();
    const reply = data?.choices?.[0]?.message?.content || "Ingen mail genereret 😅";
    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Fejl ved Orq:", error);
    return NextResponse.json({ error: "Fejl i mailgenerering" }, { status: 500 });
  }
}
