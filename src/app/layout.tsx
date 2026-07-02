import type { Metadata } from "next";
import "./discovery.css";

export const metadata: Metadata = {
  title: "Discovery Mode — Spotify Concept Prototype",
  description: "A concept prototype exploring how Spotify could let users intentionally enter exploration sessions with full control over what gets remembered.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="app-shell">
          <div className="app-content">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
