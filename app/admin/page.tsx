"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"

interface Comparison {
  id: number
  company: string
  insurance_type: string
  better_points: number
  condition: string
  description: string
}

export default function AdminPage() {
  const [companies, setCompanies] = useState<string[]>([])
  const [selectedCompany, setSelectedCompany] = useState<string>("")
  const [comparisons, setComparisons] = useState<Comparison[]>([])
  const [favorites, setFavorites] = useState<Comparison[]>([])
  const [filterTypes, setFilterTypes] = useState<string[]>([])
  const [selectedType, setSelectedType] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [showFavorites, setShowFavorites] = useState(false)

  // 🔹 Hent unikke selskaber
  useEffect(() => {
    async function fetchCompanies() {
      const { data, error } = await supabase
        .from("comparison_points")
        .select("company")

      if (!error && data) {
        const unique = Array.from(new Set(data.map((d) => d.company)))
        setCompanies(unique)
      }
    }
    fetchCompanies()
  }, [])

  // 🔹 Hent data for valgt selskab
  useEffect(() => {
    if (!selectedCompany) return
    async function fetchComparisons() {
      setLoading(true)
      const { data, error } = await supabase
        .from("comparison_points")
        .select("*")
        .eq("company", selectedCompany)
        .order("insurance_type", { ascending: true })

      if (!error && data) {
        setComparisons(data)
        const uniqueTypes = Array.from(
          new Set(data.map((d) => d.insurance_type))
        )
        setFilterTypes(uniqueTypes)
      }
      setLoading(false)
    }
    fetchComparisons()
  }, [selectedCompany])

  // 🔹 Tilføj/fjern favorit
  const toggleFavorite = (item: Comparison) => {
    setFavorites((prev) => {
      const exists = prev.some((fav) => fav.id === item.id)
      if (exists) {
        return prev.filter((fav) => fav.id !== item.id)
      } else {
        return [...prev, item]
      }
    })
  }

  // 🔹 Filtrer visning efter valgt type
  const visibleComparisons = selectedType
    ? comparisons.filter((c) => c.insurance_type === selectedType)
    : comparisons

  return (
    <section id="compare" className="w-full relative pb-40">
      <h2 className="text-[22px] mb-7 text-[#e60000] font-semibold">
        Samlign selskaber
      </h2>

      <div className="bg-white border border-[#e2e6ea] rounded-xl p-7 shadow-sm">
        {/* Vælg selskab */}
        <div className="mb-4">
          <select
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-[14px] font-medium focus:outline-none focus:ring-2 focus:ring-[#e60000]"
            onChange={(e) => setSelectedCompany(e.target.value)}
            defaultValue=""
          >
            <option value="" disabled>
              Vælg selskab at sammenligne mod...
            </option>
            {companies.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Vælg forsikringstype */}
        {filterTypes.length > 0 && (
          <div className="mb-6">
            <select
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-[14px] font-medium focus:outline-none focus:ring-2 focus:ring-[#e60000]"
              onChange={(e) => setSelectedType(e.target.value)}
              value={selectedType}
            >
              <option value="">Alle forsikringstyper</option>
              {filterTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Loading */}
        {loading && <p className="text-gray-500 text-sm">Henter data...</p>}

        {/* Ingen valgt */}
        {!loading && !selectedCompany && (
          <p className="text-sm text-gray-500">
            Vælg et selskab for at se sammenligningsdata.
          </p>
        )}

        {/* Sammenligningskort */}
        {!loading && visibleComparisons.length > 0 && (
          <div className="space-y-5">
            {visibleComparisons.map((item) => {
              const isFav = favorites.some((f) => f.id === item.id)
              return (
                <div
                  key={item.id}
                  className="relative border border-[#e2e6ea] bg-[#fafbfc] rounded-lg p-5 shadow-sm"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-[#e60000] font-semibold text-[18px]">
                      {item.insurance_type}
                    </h4>

                    <span className="flex items-center gap-1 text-sm font-medium text-green-600">
                      <svg
                        className="w-4 h-4"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M12 4l6 8H6z" />
                      </svg>
                      {item.better_points} punkter bedre
                    </span>
                  </div>

                  <div className="mb-1 text-[15px] font-medium text-gray-800">
                    {item.condition}
                  </div>
                  <p className="text-sm text-gray-700">{item.description}</p>

                  {/* ❤️ Favoritknap */}
                  <button
                    onClick={() => toggleFavorite(item)}
                    className={`absolute bottom-3 right-3 w-9 h-9 rounded-full flex items-center justify-center shadow-md border transition ${
                      isFav
                        ? "bg-[#e60000] text-white border-[#e60000]"
                        : "bg-white text-[#e60000] border-[#e60000]"
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill={isFav ? "white" : "none"}
                      stroke="currentColor"
                      strokeWidth={2}
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 21l-1.45-1.32C5.4 15.36 2 12.28 2 8.5A5.5 5.5 0 017.5 3c1.74 0 
                        3.41.81 4.5 2.09A6.18 6.18 0 0116.5 3 
                        5.5 5.5 0 0122 8.5c0 3.78-3.4 6.86-8.55 
                        11.18L12 21z"
                      />
                    </svg>
                  </button>
                </div>
              )
            })}
          </div>
        )}

        {/* Ingen data */}
        {!loading && selectedCompany && comparisons.length === 0 && (
          <p className="text-sm text-gray-500">
            Der er ingen data for {selectedCompany} endnu.
          </p>
        )}
      </div>

      {/* 🛒 Kurv med favoritter */}
      {favorites.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-300 shadow-lg px-6 py-4 flex justify-between items-center">
          <div>
            <h4 className="font-semibold text-[16px] text-[#e60000]">
              {favorites.length} valgt{favorites.length > 1 && "e"} favorit
              {favorites.length > 1 && "ter"}
            </h4>
            <p className="text-sm text-gray-600">
              Gennemgå dem med kunden i slutningen af opkaldet
            </p>
          </div>
          <button
            className="bg-[#e60000] text-white px-5 py-2 rounded-lg font-medium hover:bg-[#b30000] transition"
            onClick={() => setShowFavorites(true)}
          >
            Se valgte
          </button>
        </div>
      )}

      {/* 🧩 Overlay til visning af favoritter */}
      {showFavorites && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 p-6">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-3xl max-h-[80vh] overflow-y-auto relative p-6">
            <button
              onClick={() => setShowFavorites(false)}
              className="absolute top-3 right-3 text-gray-600 hover:text-[#e60000] text-lg font-semibold"
            >
              ✕
            </button>
            <h3 className="text-[20px] font-semibold text-[#e60000] mb-5">
              Dine valgte favoritter
            </h3>

            {favorites.map((item) => (
              <div
                key={item.id}
                className="border border-[#e2e6ea] bg-[#fafbfc] rounded-lg p-5 shadow-sm mb-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-[#e60000] font-semibold text-[18px]">
                    {item.insurance_type}
                  </h4>
                  <span className="flex items-center gap-1 text-sm font-medium text-green-600">
                    <svg
                      className="w-4 h-4"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 4l6 8H6z" />
                    </svg>
                    {item.better_points} punkter bedre
                  </span>
                </div>
                <div className="mb-1 text-[15px] font-medium text-gray-800">
                  {item.condition}
                </div>
                <p className="text-sm text-gray-700">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
