export function formatPrice(price: number, locale: string): string {
  const formattedPrice = price.toFixed(3);
  return locale === "ar" ? `${formattedPrice} د.ك` : `${formattedPrice} KWD`;
}
export function formatCurrency(amount: number, locale: string): string {
  const fixedAmount = amount.toFixed(3);
  return locale === 'ar' ? `${fixedAmount} د.ك` : `${fixedAmount} KWD`;
}