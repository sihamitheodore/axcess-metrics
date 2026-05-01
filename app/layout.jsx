import "./globals.css";

export const metadata = {
  title: "Axcess: Tour Demand Analyzer",
  description: "Premium tour demand and routing intelligence for music teams.",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon.png", type: "image/png", sizes: "512x512" }
    ],
    apple: [
      { url: "/apple-icon.png", type: "image/png", sizes: "180x180" }
    ]
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
