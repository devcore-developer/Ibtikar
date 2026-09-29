import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-center p-4">
      <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-foreground mb-2">الصفحة غير موجودة</h2>
      <p className="text-muted mb-8">عذراً، لم نتمكن من العثور على الصفحة التي تبحث عنها.</p>
      <Link href="/">
        <Button size="lg">العودة للرئيسية</Button>
      </Link>
    </div>
  );
}