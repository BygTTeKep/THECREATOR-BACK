/**
 * Денежная величина (стоимость, налог)
 */
export class MoneyDto {
  /**
   * Сумма в валюте
   */
  value?: number;

  /**
   * Сумма НДС
   */
  vat_sum?: number;

  /**
   * Ставка НДС (значение - 0, 5, 7, 10, 16, 20, 22, null - нет НДС)
   */
  vat_rate?: number | null;
}
