"use client"

export default function BrugerePage() {
  return (
    <div>
      <h1 className="text-3xl font-semibold mb-6">Brugere</h1>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
        <p className="text-gray-600 mb-4">
          Administrer brugere, opret nye og rediger eksisterende.
        </p>

        <div className="border-t pt-4 mt-4">
          <p className="text-gray-800">👥 Placeholder til bruger-tabel</p>
        </div>

        <button className="mt-6 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition">
          + Opret ny bruger
        </button>
      </div>
    </div>
  )
}
