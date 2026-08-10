export enum ContagentTypeEnum {
  /**
   * юридическое лицо
   */
  LEAGAL_ENTITY = 'LEGAL_ENTITY',

  /**
   * физическое лицо
   */
  INDIVIDUAL = 'INDIVIDUAL',
}

export class PhoneDto {
  number: string;
  additional?: any;
}

/**
 * @field name
 * @field phones
 */
export class RequiredFieldRecipientDto {
  /**
   * ФИО контактного лица
   */
  name: string;

  /**
   * Список телефонов. Не более 10 номеров
   */
  phones: PhoneDto[];
}

export class RecipientDto extends RequiredFieldRecipientDto {
  /**
   * Название компании
   */
  company?: string;

  /**
   * Тип получателя.
   * Возможные значения:
   * LEGAL_ENTITY - юридическое лицо,
   * INDIVIDUAL - физическое лицо
   */
  contragent_type: ContagentTypeEnum;

  //TODO
}
