export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "EGP",
  }).format(price);
};

export const formatDate = (date: string): string => {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

export const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/--+/g, "-")
    .trim();
};
export function calculateFinalPrice(price: number, discount: number): number {
  const nPrice = Number(price) || 0;
  const nDiscount = Number(discount) || 0;

  if (!nPrice) return 0;
  if (!nDiscount) return nPrice;

  const boundedDiscount = Math.min(Math.max(nDiscount, 0), 100);
  const discountAmount = (nPrice * boundedDiscount) / 100;
  const total = nPrice - discountAmount;

  return Math.max(0, total);
}
