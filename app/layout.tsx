import "./globals.css";

export const metadata = {
  title: "Férias com IA",
  description: "Roteiros de viagem personalizados com inteligência artificial"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
