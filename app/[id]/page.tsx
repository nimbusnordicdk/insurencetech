"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export default function TrygLinkView() {
  const { id } = useParams();
  const supabase = createClientComponentClient();
  const [data, setData] = useState<any>(null);
  const [advisor, setAdvisor] = useState<any>(null);
  const [aiText, setAiText] = useState("");

  // Hent kundens link-data
  useEffect(() => {
    async function load() {
      const { data: link } = await supabase
        .from("tryglinks")
        .select("*")
        .eq("id", id)
        .single();
      setData(link);

      // Hent AI sammenligning
      if (link) {
        const res = await fetch("/api/ai-compare", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            company: link.company,
            insurances: link.insurances,
          }),
        });
        const ai = await res.json();
        setAiText(ai.reply);
      }

      // Hent rådgiver-info (fra settings)
      const { data: advisorData } = await supabase
        .from("settings")
        .select("name,email,phone")
        .single();
      setAdvisor(advisorData);
    }
    load();
  }, [id]);

  if (!data)
    return (
      <p className={`text-center mt-20 text-[#222] ${poppins.className}`}>
        Indlæser TrygLink...
      </p>
    );

  return (
    <div
      className={`bg-[#f6f7f8] min-h-screen text-[#222] ${poppins.className}`}
    >
      {/* Header */}
      <header className="bg-white border-b border-[#e2e6ea] p-4">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Tryg_logo.svg/1200px-Tryg_logo.svg.png"
          alt="Tryg logo"
          className="w-[95px] h-auto"
        />
      </header>

      {/* Main content */}
      <main className="max-w-3xl mx-auto my-10 bg-white border border-[#e2e6ea] rounded-xl shadow p-8">
        <h1 className="text-2xl font-semibold text-[#e60000] mb-2">
          Dine forsikringer hos Tryg
        </h1>

        <p className="mb-4">
          Hej! Vi kan se, at du i dag har forsikringer hos {data.company}.
          Herunder kan du se, hvordan Tryg typisk adskiller sig fra din
          nuværende løsning.
        </p>

        {data.message && (
          <div className="bg-[#fafafa] border border-[#e2e6ea] rounded-lg p-4 mb-6">
            <p>{data.message}</p>
          </div>
        )}

        {/* Nuværende dækning */}
        <h2 className="text-xl font-semibold text-[#e60000] border-b pb-1 mb-3">
          Din nuværende dækning
        </h2>
        <div className="bg-[#fafafa] border border-[#e2e6ea] rounded-lg p-4 mb-6">
          <h3 className="text-[#e60000] font-medium text-lg mb-2">
            {data.company}
          </h3>
          <ul className="list-disc pl-5">
            {data.insurances?.map((f: string, i: number) => (
              <li key={i}>
                {f} {data.coverages?.[f] && `– ${data.coverages[f]}`}
              </li>
            ))}
          </ul>
        </div>

        {/* AI Sammenligning */}
        <h2 className="text-xl font-semibold text-[#e60000] border-b pb-1 mb-3">
          Tryg sammenligning
        </h2>
        <div className="bg-[#fafafa] border border-[#e2e6ea] rounded-lg p-4 mb-6">
          <p>{aiText || "Indlæser Tryg sammenligning..."}</p>
        </div>

        {/* Kontaktinfo */}
        {advisor && (
          <>
            <h2 className="text-xl font-semibold text-[#e60000] border-b pb-1 mb-3">
              Kontakt mig direkte
            </h2>
            <div className="bg-[#fafafa] border border-[#e2e6ea] rounded-lg p-4">
              <p>
                Du er altid velkommen til at kontakte mig direkte:
                <br />
                <strong>{advisor.name}</strong>
                <br />
                📞 {advisor.phone}
                <br />
                ✉️ {advisor.email}
              </p>
            </div>
          </>
        )}
      </main>

      <footer className="text-center text-sm text-gray-500 py-8">
        © 2025 Tryg Forsikring – Alle rettigheder forbeholdes
      </footer>
    </div>
  );
}
