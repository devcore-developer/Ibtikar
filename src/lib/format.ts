export function formatPrice(price: number, locale: string): string {
  const formattedPrice = price.toFixed(3);
  return locale === "ar" ? `${formattedPrice} د.ك` : `${formattedPrice} KWD`;
}