'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function PartnerAftaler() {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPartners();
  }, []);

  async function fetchPartners() {
    const { data, error } = await supabase
      .from('partners')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) console.error('❌ Fejl ved hentning:', error);
    else setPartners(data || []);
    setLoading(false);
  }

  if (loading) {
    return <p className="text-gray-600">Henter partneraftaler...</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {partners.length === 0 ? (
        <p className="col-span-3 text-gray-500 italic">Ingen partneraftaler fundet.</p>
      ) : (
        partners.map((p) => (
          <div
            key={p.id}
            className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5 hover:shadow-md transition"
          >
            <h3 className="text-lg font-semibold text-[#e60000] mb-2">{p.name}</h3>
            <p className="text-gray-700 text-sm leading-relaxed">{p.description}</p>
          </div>
        ))
      )}
    </div>
  );
}
