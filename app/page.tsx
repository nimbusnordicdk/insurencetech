import { redirect } from "next/navigation";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export default async function HomePage() {
  // ❗ IKKE await
  const supabase = createServerComponentClient({
    cookies,
  });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // 🔒 Ikke logget ind → login
  if (!session) {
    redirect("/login");
  }

  // ✅ Logget ind → admin
  redirect("/admin");
}
