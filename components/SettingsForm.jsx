'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function SettingsForm() {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    setLoading(true);
    // Her antager vi bare én bruger (kan udvides senere)
    const { data, error } = await supabase.from('user_profiles').select('*').limit(1).single();
    if (error && error.code !== 'PGRST116') console.error('❌ Fejl ved hentning:', error);
    if (data) setProfile(data);
    setLoading(false);
  }

  async function saveProfile() {
    setStatus('Gemmer...');

    const { error } = await supabase
      .from('user_profiles')
      .upsert([profile], { onConflict: 'email' });

    if (error) {
      console.error('❌ Fejl ved gemning:', error);
      setStatus('Der opstod en fejl.');
    } else {
      setStatus('Profil gemt!');
    }

    setTimeout(() => setStatus(''), 2500);
  }

  if (loading) return <p>Indlæser profil...</p>;

  return (
    <div className="bg-white border border-[#e2e6ea] rounded-2xl shadow-sm p-8 max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6 text-[#e60000]">Profiloplysninger</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium mb-1">Navn</label>
          <input
            type="text"
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            className="w-full border border-gray-300 rounded-lg p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">E-mail</label>
          <input
            type="email"
            value={profile.email}
            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
            className="w-full border border-gray-300 rounded-lg p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Telefon</label>
          <input
            type="text"
            value={profile.phone}
            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
            className="w-full border border-gray-300 rounded-lg p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Adgangskode</label>
          <input
            type="password"
            value={profile.password}
            onChange={(e) => setProfile({ ...profile, password: e.target.value })}
            className="w-full border border-gray-300 rounded-lg p-2"
          />
        </div>
      </div>

      <button
        onClick={saveProfile}
        className="mt-6 bg-[#e60000] hover:bg-[#b30000] text-white font-medium px-6 py-2 rounded-lg"
      >
        Gem profil
      </button>

      {status && <p className="mt-3 text-sm text-gray-600">{status}</p>}
    </div>
  );
}
