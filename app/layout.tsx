import type { Metadata } from "next";
import "./globals.css";
import AppHeader from "@/components/AppHeader";

export const metadata: Metadata = {
  title: "Speark",
  description: "Find people to build projects with.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-black text-white">
        <AppHeader />
        <div className="pt-20">{children}</div>
      </body>
    </html>
  );
}