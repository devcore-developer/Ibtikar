// ضع بياناتك الحقيقية هنا (المأخوذة من الفوتر القديم)
export const companyInfo = {
  phone: "+965 1234 5678",         // استبدل برقم الهاتف الحقيقي
  whatsapp: "+96512345678",       // استبدل برقم الواتساب الحقيقي
  email: "info@ibtikar-kw.com",   // استبدل بالإيميل الحقيقي
  addressAr: "الجهراء، الكويت",
  addressEn: "Al Jahra, Kuwait",
  mapsUrl: "https://maps.google.com/?q=Al+Jahra", // ضع رابط الخريطة الحقيقي أو اتركه فارغاً
};

// دالة لتوليد رابط واتساب صحيح
export const getWhatsAppLink = () => {
  const num = companyInfo.whatsapp.replace(/[^0-9]/g, "");
  return `https://wa.me/${num}`;
};