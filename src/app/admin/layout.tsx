import "../globals.css";

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className="bg-background text-foreground min-h-screen">
        {children}
      </body>
    </html>
  );
}