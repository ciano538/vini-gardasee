import "./globals.css";

export const metadata = {
  title: "L'AI dei vini del Gardesano",
  description: "L'AI dei vini e delle cantine del territorio Gardesano",
  icons: { icon: "/logo.png" },
};

export default function RootLayout({ children }) {
  return (
    <html lang="it">
      <body>{children}</body>
    </html>
  );
}
