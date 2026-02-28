import { useSettings } from "@/contexts/SettingsContext";
import { formatCurrency as formatCurrencyUtil } from "@/lib/utils";

export function useFormatCurrency() {
  const { settings } = useSettings();
  const currency = settings?.currency || "JOD";

  return (amount: number) => formatCurrencyUtil(amount, currency);
}
