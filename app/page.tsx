// app/page.tsx
import { redirect } from "next/navigation";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies as nextCookies } from "next/headers";

export default async function HomePage() {
  // Få cookies korrekt i Next 16
  const cookieStore = await nextCookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // 🚫 Hvis ikke logget ind, send til login
  if (!session) {
    redirect("/login");
  }

  // ✅ Hvis logget ind, redirect til /admin
  redirect("/admin");
}
