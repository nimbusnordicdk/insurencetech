"use client";
import { useState } from "react";

export default function MailPage() {
  const [company, setCompany] = useState("");
  const [insurances, setInsurances] = useState<string[]>([]);
  const [coverages, setCoverages] = useState<Record<string, string>>({});
  const [preferences, setPreferences] = useState("");
  const [dissatisfaction, setDissatisfaction] = useState("");
  const [loading, setLoading] = useState(false);
  const [generatedMail, setGeneratedMail] = useState("");

  // Flere forsikringer tilføjet
  const insuranceOptions = [
    "Bilforsikring",
    "Husforsikring",
    "Indboforsikring",
    "Rejseforsikring",
    "Ulykkesforsikring",
    "Kritisk sygdom",
    "Livsforsikring",
    "Erhvervsforsikring",
    "Bådforsikring",
    "Fritidshusforsikring",
    "Elektronikforsikring",
    "Dyreforsikring",
  ];

  const coverageOptions: Record<string, string[]> = {
  Bilforsikring: ["Ansvar", "Kasko", "Udvidet kasko", "Leasing"],
  Husforsikring: ["Basis", "Udvidet", "Premium"],
  Indboforsikring: ["Basis", "Udvidet", "Premium"],
  Rejseforsikring: ["Europa", "Verden", "Årsrejse"],
  Ulykkesforsikring: ["Voksen", "Børn", "Fritid", "24/7"],
  "Kritisk sygdom": ["Standard", "Udvidet"],
  Livsforsikring: ["Standard", "Fleksibel dækning"],
  Erhvervsforsikring: ["Ejendom", "Ansvar", "Transport", "Cyber"],
  Bådforsikring: ["Ansvar", "Kasko", "Udvidet"],
  Fritidshusforsikring: ["Basis", "Udvidet"],
  Elektronikforsikring: ["Standard", "Premium"],
  Dyreforsikring: ["Hund", "Kat", "Hest"],
};

  async function handleGenerate() {
    setLoading(true);
    setGeneratedMail("");

    const payload = {
      company,
      insurances,
      coverages,
      preferences,
      dissatisfaction,
    };

    try {
      const res = await fetch("/api/ai-mail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      setGeneratedMail(data.reply || "AI kunne ikke generere en mail.");
    } catch (err) {
      console.error(err);
      setGeneratedMail("Fejl under generering af mail.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="p-8 bg-[#f6f7f8] min-h-screen text-[#222]">
      <div className="bg-white border border-[#e2e6ea] rounded-xl shadow-sm p-8 max-w-4xl mx-auto">
        <h1 className="text-xl font-semibold mb-6">Opret kundemail</h1>

        {/* 1. Forsikringsselskab */}
        <div className="mb-5">
          <label className="block font-medium mb-2">Kundens forsikringsselskab</label>
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

        {/* 2. Forsikringer */}
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

        {/* 3. Dækninger */}
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

        {/* 4. Kundens præferencer */}
        <div className="grid grid-cols-2 gap-5 mb-6">
          <div>
            <label className="block font-medium mb-2">Hvad værdsætter kunden mest?</label>
            <textarea
              className="border border-[#e2e6ea] rounded-lg p-3 w-full"
              rows={3}
              value={preferences}
              onChange={(e) => setPreferences(e.target.value)}
            />
          </div>

          <div>
            <label className="block font-medium mb-2">Hvad er kunden utilfreds med?</label>
            <textarea
              className="border border-[#e2e6ea] rounded-lg p-3 w-full"
              rows={3}
              value={dissatisfaction}
              onChange={(e) => setDissatisfaction(e.target.value)}
            />
          </div>
        </div>

        {/* 5. Knap */}
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="bg-[#e60000] text-white font-medium px-6 py-3 rounded-lg hover:bg-[#b30000] transition-colors"
        >
          {loading ? "Genererer mail..." : "Skriv mail"}
        </button>

        {/* Resultat */}
        {generatedMail && (
          <div className="mt-6 border border-[#e2e6ea] bg-[#fafbfc] rounded-lg p-5 whitespace-pre-wrap">
            <h2 className="font-semibold mb-2">Genereret mail:</h2>
            <p>{generatedMail}</p>
          </div>
        )}
      </div>
    </section>
  );
}
