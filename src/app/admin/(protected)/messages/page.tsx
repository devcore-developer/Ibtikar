import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { deleteMessage, markMessageRead } from "@/app/admin/actions";

export default async function AdminMessagesPage() {
  const messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-8">الرسائل الواردة</h1>

      <div className="bg-surface border border-border rounded-lg overflow-hidden">
        <table className="w-full text-start">
          <thead className="bg-muted/5 border-b border-border">
            <tr>
              <th className="p-4 text-start text-sm font-medium text-muted">المرسل</th>
              <th className="p-4 text-start text-sm font-medium text-muted">الهاتف</th>
              <th className="p-4 text-start text-sm font-medium text-muted">الموضوع</th>
              <th className="p-4 text-start text-sm font-medium text-muted">الحالة</th>
              <th className="p-4 text-start text-sm font-medium text-muted">التاريخ</th>
              <th className="p-4 text-start text-sm font-medium text-muted">إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {messages.map((m: any) => (
              <tr key={m.id} className={`border-b border-border last:border-0 hover:bg-muted/5 ${!m.isRead ? "bg-primary/5" : ""}`}>
                <td className="p-4 text-sm font-medium text-foreground">{m.name}</td>
                <td className="p-4 text-sm text-muted" dir="ltr">{m.phone}</td>
                <td className="p-4 text-sm text-muted">{m.subject || "-"}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${m.isRead ? "bg-muted/10 text-muted" : "bg-accent/10 text-accent"}`}>
                    {m.isRead ? "مقروءة" : "جديدة"}
                  </span>
                </td>
                <td className="p-4 text-sm text-muted">{new Date(m.createdAt).toLocaleDateString("ar-KW")}</td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <form action={() => markMessageRead(m.id, m.isRead)}>
                      <button type="submit" className="p-2 text-muted hover:text-primary" title={m.isRead ? "وضع كغير مقروءة" : "وضع كمقروءة"}>
                        {/* يمكنك استخدام أيقونة مناسبة هنا */}
                        ✓
                      </button>
                    </form>
                    <form action={() => deleteMessage(m.id)}>
                      <button type="submit" className="p-2 text-muted hover:text-error" title="حذف">
                        ✕
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}