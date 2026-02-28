export const ARAB_COUNTRIES = [
  { code: "MA", name: "المغرب", dial: "+212" },
  { code: "DZ", name: "الجزائر", dial: "+213" },
  { code: "TN", name: "تونس", dial: "+216" },
  { code: "LY", name: "ليبيا", dial: "+218" },
  { code: "EG", name: "مصر", dial: "+20" },
  { code: "PS", name: "فلسطين", dial: "+970" },
  { code: "JO", name: "الأردن", dial: "+962" },
  { code: "LB", name: "لبنان", dial: "+961" },
  { code: "SY", name: "سوريا", dial: "+963" },
  { code: "IQ", name: "العراق", dial: "+964" },
  { code: "SA", name: "السعودية", dial: "+966" },
  { code: "AE", name: "الإمارات", dial: "+971" },
  { code: "QA", name: "قطر", dial: "+974" },
  { code: "KW", name: "الكويت", dial: "+965" },
  { code: "BH", name: "البحرين", dial: "+973" },
  { code: "OM", name: "عُمان", dial: "+968" },
];

export const ACADEMIC_LEVELS = [
  { value: "school", label: "مدرسة" },
  { value: "diploma", label: "دبلوم" },
  { value: "bachelor", label: "بكالوريوس" },
  { value: "master", label: "ماجستير" },
  { value: "phd", label: "دكتوراه" },
];

export const GRADE_TYPES = [
  { value: "BTEC", label: "BTEC" },
  { value: "normal", label: "نظام عادي" },
];

export const BTEC_GRADES = [
  { value: "P", label: "P (Pass)" },
  { value: "M", label: "M (Merit)" },
  { value: "D", label: "D (Distinction)" },
];

export const ORDER_PRIORITIES = [
  { value: "normal", label: "عادي" },
  { value: "urgent", label: "عاجل" },
];

export const PAYMENT_TYPES = [
  { value: "cash", label: "كاش" },
  { value: "installments", label: "أقساط" },
];

export function getWhatsAppLink(phoneCountryCode: string, phone: string): string {
  const cleanPhone = phone.replace(/\D/g, "");
  const cleanCode = phoneCountryCode.replace(/\D/g, "");
  return `https://wa.me/${cleanCode}${cleanPhone}`;
}
