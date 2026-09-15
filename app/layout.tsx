import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Alumni Connector — High-Precision Alumni Intelligence Platform",
  description:
    "Discover alumni who have built the career you're pursuing. Decode their journeys, understand match relevance, and craft personalized outreach.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#07090e] text-slate-100 antialiased selection:bg-cyan-500/25 selection:text-cyan-200">
        {children}
      </body>
    </html>
  );
}
