import dayjs from "dayjs";
import jalaliPlugin from "jalaliday";

dayjs.extend(jalaliPlugin);

// Persian digits mapping
const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
const englishDigits = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

export function toPersianDigits(str: string | number): string {
  const numStr = str.toString();
  return numStr.replace(/\d/g, (digit) => persianDigits[parseInt(digit)]);
}

export function toEnglishDigits(str: string): string {
  return str.replace(/[۰-۹]/g, (digit) => {
    const index = persianDigits.indexOf(digit);
    return index !== -1 ? englishDigits[index] : digit;
  });
}

export function formatPrice(amount: number): string {
  // Format number with thousand separators
  const formatted = amount.toLocaleString("fa-IR");
  return `${formatted} تومان`;
}

export function formatPersianDate(date: string | Date): string {
  return dayjs(date).calendar("jalali").format("YYYY/MM/DD");
}

export function formatPersianDateTime(date: string | Date): string {
  return dayjs(date).calendar("jalali").format("YYYY/MM/DD - HH:mm");
}

export function cn(
  ...classes: (string | undefined | null | boolean)[]
): string {
  return classes.filter(Boolean).join(" ");
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

// Get the default user ID for development
export function getDefaultUserId(): string {
  // This should match the user ID that has orders in your database
  return "cmepvl2o60000yl2mbab1y3s0";
}
