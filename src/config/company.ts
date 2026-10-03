// ضع بياناتك الحقيقية هنا (المأخوذة من الفوتر القديم)
export const companyInfo = {
  phone: "+965 6569 6342",         // استبدل برقم الهاتف الحقيقي
  whatsapp: "+96565696342",       // استبدل برقم الواتساب الحقيقي
  email: "Kalruwaie@gmail.com",   // استبدل بالإيميل الحقيقي
  addressAr: "الجهراء، الكويت",
  addressEn: "Al Jahra, Kuwait",
  mapsUrl: "https://maps.google.com/?q=Al+Jahra", // ضع رابط الخريطة الحقيقي أو اتركه فارغاً
};

// دالة لتوليد رابط واتساب صحيح
export const getWhatsAppLink = () => {
  const num = companyInfo.whatsapp.replace(/[^0-9]/g, "");
  return `https://wa.me/${num}`;
};