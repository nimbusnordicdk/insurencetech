import "@/app/globals.css";
import { Poppins } from "next/font/google";
import Link from "next/link";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata = {
  title: "Super Admin Dashboard",
  description: "Tryg Super Admin Portal",
};

export default function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  const menu = [
    {
      id: "compare",
      label: "Opret Sammenligning",
      href: "/superadmin/sammenligning",
      icon: "M3 3h18v2H3zM3 9h18v2H3zM3 15h18v2H3z",
    },
    {
      id: "users",
      label: "Brugere",
      href: "/superadmin/brugere",
      icon: "M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z",
    },
    {
      id: "learning",
      label: "Undervisning",
      href: "/superadmin/undervisning",
      icon: "M4 4h16v2H4zM4 10h16v2H4zM4 16h16v2H4z",
    },
  ];

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 p-6 flex flex-col">
        <h1 className="text-2xl font-semibold mb-6 text-red-600">Super Admin</h1>

        <nav className="space-y-3">
          {menu.map((item) => (
            <Link key={item.id} href={item.href}>
              <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100 cursor-pointer transition">
                <svg
                  className="w-6 h-6 text-red-600"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d={item.icon} />
                </svg>
                <span className="font-medium">{item.label}</span>
              </div>
            </Link>
          ))}
        </nav>

        <div className="mt-auto">
          <Link href="/admin/logout">
            <div className="mt-6 p-3 text-center bg-red-600 hover:bg-red-700 text-white rounded-xl transition cursor-pointer">
              Log ud
            </div>
          </Link>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 p-10 overflow-y-auto bg-gray-50">{children}</main>
    </div>
  );
}
