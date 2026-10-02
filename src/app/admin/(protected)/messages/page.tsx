import { prisma } from "@/lib/prisma";
import { AdminCard, AdminCardHeader, EmptyState } from "@/components/admin/ui";
import { deleteMessage, markMessageRead } from "@/app/admin/actions";
import { Mail } from "lucide-react";

export default async function MessagesPage() {
  const messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">الرسائل</h1>
      <AdminCard>
        <AdminCardHeader title="صندوق الوارد" />
        {messages.length === 0 ? (
          <EmptyState title="لا توجد رسائل حالياً" icon={Mail} />
        ) : (
          <div className="divide-y divide-[#E8ECEE]">
            {messages.map((msg) => (
              <div key={msg.id} className={`p-5 ${msg.isRead ? "bg-white" : "bg-blue-50/50"}`}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-[#172126]">{msg.name}</h3>
                    <p className="text-xs text-[#68777D]" dir="ltr">{msg.phone}</p>
                  </div>
                  <span className="text-xs text-[#68777D]">{new Date(msg.createdAt).toLocaleDateString('ar-EG')}</span>
                </div>
                {msg.subject && <p className="text-sm font-medium text-[#172126] mb-1">{msg.subject}</p>}
                <p className="text-sm text-[#68777D] mb-4">{msg.message}</p>
                <div className="flex gap-4">
                  {!msg.isRead && (
                    <form action={markMessageRead}>
                      <input type="hidden" name="id" value={msg.id} />
                      <input type="hidden" name="isRead" value="true" />
                      <button type="submit" className="text-blue-600 text-xs hover:underline">تحديد كمقروء</button>
                    </form>
                  )}
                  <form action={deleteMessage}>
                    <input type="hidden" name="id" value={msg.id} />
                    <button type="submit" className="text-red-500 text-xs hover:underline">حذف</button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}
      </AdminCard>
    </div>
  );
}