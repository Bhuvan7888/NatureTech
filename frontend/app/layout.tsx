import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Re-Grow | Satellite Deforestation & Active Reforestation Platform",
  description: "AI-powered satellite imagery analysis for deforestation and forest fires, translation to economic recovery cost, and geospatial NGO matchmaking.",
  keywords: ["Deforestation", "Satellite Analysis", "Forest Fires", "Reforestation", "NGO Matchmaking", "Overpass API", "AI Computer Vision"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="font-['Plus_Jakarta_Sans',sans-serif] bg-slate-950 text-slate-100 min-h-screen">
        {children}
      </body>
    </html>
  );
}
