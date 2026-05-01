import "./globals.css";

export const metadata = {
  title: "Axcess: Tour Demand Analyzer",
  description: "Premium tour demand and routing intelligence for music teams."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
