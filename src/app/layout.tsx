// src/app/layout.tsx
export const metadata = { title: "Webstudio GLM2", description: "Webstudio app" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
