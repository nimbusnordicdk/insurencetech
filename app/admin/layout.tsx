import "@/app/globals.css";
import { Poppins } from "next/font/google";
import Link from "next/link";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata = {
  title: "Tryg Dashboard",
  description: "Tryg Admin Portal",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const menu = [
    {
      id: "compare",
      label: "Samlign",
      href: "/admin/",
      icon: "M7 3h2v14H7zM15 7h2v14h-2zM3 19h8v2H3zM13 3h8v2h-8z",
    },
    {
      id: "chat",
      label: "AI Chat",
      href: "/admin/chat",
      icon: "M12 3C6.48 3 2 6.58 2 11c0 1.86.78 3.56 2.08 4.95L3 21l4.18-2.5C8.11 18.83 9.99 19.5 12 19.5c5.52 0 10-3.58 10-8.5S17.52 3 12 3z",
    },
    {
      id: "email",
      label: "Send kundemail",
      href: "/admin/mail",
      icon: "M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Zm0 2v.01L12 13 4 6.01V6Zm0 12H4V8l8 7 8-7Z",
    },
    {
      id: "tryglink",
      label: "Opret Tryglink",
      href: "/admin/tryglink",
      icon: "M3.9 12a5 5 0 0 1 5-5H11v2H8.9a3 3 0 1 0 0 6H11v2H8.9a5 5 0 0 1-5-5Zm9-3h3.1a3 3 0 0 1 0 6H12v2h3.1a5 5 0 0 0 0-10H12v2Z",
    },
    {
      id: "partner",
      label: "Partneraftaler",
      href: "/admin/partners",
      icon: "M3 5h18v14H3zM5 7v10h14V7zM7 9h10v2H7zM7 13h6v2H7z",
    },
    {
      id: "settings",
      label: "Indstillinger",
      href: "/admin/settings",
      icon: "M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm9.4 3h-2.1a7.4 7.4 0 0 0-.8-1.9l1.5-1.5-1.9-1.9-1.5 1.5c-.6-.3-1.3-.6-1.9-.8V3.6h-2.7V5.7c-.7.2-1.3.5-1.9.8L6.7 5l-1.9 1.9 1.5 1.5c-.3.6-.6 1.2-.8 1.9H3.4v2.7h2.1c.2.7.5 1.3.8 1.9L4.8 17l1.9 1.9 1.5-1.5c.6.3 1.2.6 1.9.8v2.1h2.7v-2.1c.7-.2 1.3-.5 1.9-.8l1.5 1.5 1.9-1.9-1.5-1.5c.3-.6.6-1.2.8-1.9h2.1V11z",
    },
    {
      id: "undervisning",
      label: "Undervisning",
      href: "/admin/undervisning",
      icon: "M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm1 15h-2v-2h2Zm0-4h-2V7h2Z",
    },

  ];

  return (
    <div className={`${poppins.className} flex h-screen bg-[#f6f7f8] text-[#222]`}>
      {/* Sidebar */}
      <aside className="w-[260px] bg-white border-r border-[#e2e6ea] p-5 flex flex-col">
        {/* Logo */}
        <div className="mb-7">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Tryg_logo.svg/1200px-Tryg_logo.svg.png"
            alt="Tryg logo"
            className="w-[105px] ml-[6px]"
          />
        </div>

        {/* Menu */}
        <nav className="flex-1 space-y-1">
          {menu.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className="flex items-center w-full gap-2 px-3 py-2 rounded-md text-[15px] font-medium text-[#444] hover:bg-[#ffecec] hover:text-[#e60000] transition"
            >
              <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] opacity-80">
                <path d={item.icon} />
              </svg>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="text-xs text-gray-500 pt-4">© 2025 Øresund Partners</div>
      </aside>

      {/* Content */}
      <main className="flex-1 overflow-y-auto p-8">{children}</main>
    </div>
  );
}
