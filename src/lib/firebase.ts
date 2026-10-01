import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getStorage } from "firebase-admin/storage";

// التأكد من عدم تهيئة التطبيق أكثر من مرة (مهم جداً لتفادي الأخطاء أثناء التطوير)
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      // المفتاح الخاص يحتاج إلى تحويل \n إلى أسطر جديدة فعلية
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  });
}

export const adminStorage = getStorage();