"use client";

import { usePathname } from "next/navigation";
import { ContactDock } from "./ContactDock";
import { Footer } from "./Footer";
import { Header } from "./Header";
import type { ReactNode } from "react";

export function SiteShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const admin = pathname.startsWith("/admin");

  if (admin) return children;

  return (
    <>
      <Header />
      <main id="contenido" className="flex-1">
        {children}
      </main>
      <Footer />
      <ContactDock />
    </>
  );
}
