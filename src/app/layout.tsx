import type { Metadata } from "next";
import "./globals.css";

//title of app
export const metadata: Metadata = {
  title: "Agenda de vie",
  description: "un agenda modulable util à tout le monde et entièrement modifiable au bon vouloir.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>
        {children}
      </body>
    </html>
  );
}
