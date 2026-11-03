import { tienda } from "../config/tienda";

const currencyFormatter = new Intl.NumberFormat(tienda.idioma, {
  style: "currency",
  currency: tienda.moneda,
  maximumFractionDigits: 2,
});

export function formatPrice(amount: number): string {
  return currencyFormatter.format(amount);
}