// app/layout.tsx
export const metadata = {
  title: "MZPrimer Ads Engine",
  description: "API for Facebook/Google Ads Generation",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}