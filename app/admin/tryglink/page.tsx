"use client";
import { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function TrygLinkPage() {
  const supabase = createClientComponentClient();
  const [company, setCompany] = useState("");
  const [insurances, setInsurances] = useState<string[]>([]);
  const [coverages, setCoverages] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");
  const [generatedLink, setGeneratedLink] = useState("");

  const insuranceOptions = [
    "Bilforsikring",
    "Husforsikring",
    "Indboforsikring",
    "Rejseforsikring",
    "Ulykkesforsikring",
    "Erhvervsforsikring",
  ];

  const coverageOptions: Record<string, string[]> = {
    Bilforsikring: ["Ansvar", "Kasko", "Udvidet kasko"],
    Husforsikring: ["Basis", "Udvidet", "Premium"],
    Indboforsikring: ["Basis", "Udvidet"],
    Rejseforsikring: ["Europa", "Verden", "Årsrejse"],
    Ulykkesforsikring: ["Standard", "Udvidet"],
    Erhvervsforsikring: ["Ansvar", "Ejendom", "Cyber"],
  };

  async function generateLink() {
    if (!company || insurances.length === 0) {
      alert("Udfyld selskab og mindst én forsikring først.");
      return;
    }

    const id = Math.random().toString(36).substring(2, 9); // 7 tegn

    const { error } = await supabase.from("tryglinks").insert([
      {
        id,
        company,
        insurances,
        coverages,
        message,
      },
    ]);

    if (error) {
      console.error(error);
      alert("Fejl ved oprettelse af link i databasen.");
      return;
    }

    const baseUrl = `${window.location.origin}/${id}`;
    setGeneratedLink(baseUrl);
  }

  return (
    <section className="p-8 bg-[#f6f7f8] min-h-screen">
      <div className="bg-white border border-[#e2e6ea] rounded-xl shadow-sm p-8 max-w-4xl mx-auto font-[Poppins]">
        <h1 className="text-xl font-semibold mb-6">Opret TrygLink</h1>

        {/* Selskab */}
        <div className="mb-5">
          <label className="block font-medium mb-2">Kundens nuværende selskab</label>
          <select
            className="border border-[#e2e6ea] rounded-lg p-3 w-full"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          >
            <option value="">Vælg selskab</option>
            <option value="Tryg">Tryg</option>
            <option value="Topdanmark">Topdanmark</option>
            <option value="If">If</option>
            <option value="Alka">Alka</option>
            <option value="GF">GF</option>
            <option value="LB">LB</option>
            <option value="Codan">Codan</option>
          </select>
        </div>

        {/* Forsikringer */}
        <div className="mb-5">
          <label className="block font-medium mb-2">Hvilke forsikringer har kunden?</label>
          <div className="grid grid-cols-2 gap-2">
            {insuranceOptions.map((option) => (
              <label key={option} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={insurances.includes(option)}
                  onChange={(e) => {
                    if (e.target.checked) setInsurances([...insurances, option]);
                    else setInsurances(insurances.filter((i) => i !== option));
                  }}
                />
                {option}
              </label>
            ))}
          </div>
        </div>

        {/* Dækninger */}
        {insurances.length > 0 && (
          <div className="mb-5">
            <label className="block font-medium mb-2">Dækninger</label>
            {insurances.map((ins) => (
              <div key={ins} className="mb-3">
                <p className="font-medium">{ins}</p>
                <select
                  className="border border-[#e2e6ea] rounded-lg p-2 w-full mt-1"
                  value={coverages[ins] || ""}
                  onChange={(e) =>
                    setCoverages((prev) => ({ ...prev, [ins]: e.target.value }))
                  }
                >
                  <option value="">Vælg dækning</option>
                  {coverageOptions[ins].map((cov) => (
                    <option key={cov} value={cov}>
                      {cov}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        )}

        {/* Besked */}
        <div className="mb-5">
          <label className="block font-medium mb-2">Personlig besked til kunden</label>
          <textarea
            className="border border-[#e2e6ea] rounded-lg p-3 w-full"
            rows={3}
            placeholder="Skriv en kort besked der vises i kundens TrygLink..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>

        <button
          onClick={generateLink}
          className="bg-[#e60000] text-white font-medium px-6 py-3 rounded-lg hover:bg-[#b30000] transition-colors"
        >
          Generér TrygLink
        </button>

        {generatedLink && (
          <div className="mt-6 border border-[#e2e6ea] bg-[#fafbfc] rounded-lg p-5 break-words">
            <h2 className="font-semibold mb-2">Genereret link:</h2>
            <a
              href={generatedLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#e60000] underline"
            >
              {generatedLink}
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
