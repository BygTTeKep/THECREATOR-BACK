import { MoneyDto } from './money.dto';
import { SellerItemDto } from './sellerItem.dto';

/**
 * Ответ на получение информации о заказе
 * @see https://apidoc.cdek.ru/#tag/order/operation/get_2
 */
export class GetOrderInfoResponseDto {
  entity?: GetOrderInfoEntityDto | null;
  requests?: GetOrderInfoRequestDto[];
  related_entities?: GetOrderInfoRelatedEntityDto[];
}

/**
 * Основная сущность заказа
 */
export class GetOrderInfoEntityDto {
  uuid?: string | null;
  type?: number | null;
  additional_order_types?: (number | null)[] | null;
  is_return?: boolean | null;
  is_reverse?: boolean | null;
  cdek_number?: string | null;
  number?: string | null;
  accompanying_number?: string | null;
  accompanying_waybill?: GetOrderInfoAccompanyingWaybillDto | null;
  tariff_code?: number | null;
  comment?: string | null;
  shipment_point?: string | null;
  delivery_point?: string | null;
  date_invoice?: string | null;
  keep_free_until?: string | null;
  shipper_name?: string | null;
  shipper_address?: string | null;
  delivery_recipient_cost?: MoneyDto | null;
  delivery_recipient_cost_adv?: GetOrderInfoThresholdDto[] | null;
  sender?: GetOrderInfoContactDto | null;
  seller?: GetOrderInfoSellerDto | null;
  recipient?: GetOrderInfoContactDto | null;
  from_location?: GetOrderInfoLocationDto | null;
  to_location?: GetOrderInfoLocationDto | null;
  services?: GetOrderInfoServiceDto[] | null;
  packages?: GetOrderInfoPackageDto[] | null;
  statuses?: GetOrderInfoStatusDto[] | null;
  is_client_return?: boolean | null;
  delivery_mode?: string | null;
  has_reverse_order?: boolean | null;
  delay_reasons?: GetOrderInfoDelayReasonDto[] | null;
  delivery_types?: (string | null)[] | null;
  planned_delivery_date?: string | null;
  delivery_detail?: GetOrderInfoDeliveryDetailDto | null;
  delivery_problem?: GetOrderInfoDeliveryProblemDto[] | null;
  developer_key?: string | null;
  calls?: GetOrderInfoCallsDto | null;
}

/**
 * Сопроводительная накладная
 */
export class GetOrderInfoAccompanyingWaybillDto {
  client_name?: string | null;
  flight_number?: string | null;
  air_waybill_numbers?: (string | null)[] | null;
  vehicle_numbers?: (string | null)[] | null;
  vehicle_driver?: string | null;
  planned_departure_date_time?: string | null;
}

/**
 * Порог стоимости для доп. сбора за доставку
 */
export class GetOrderInfoThresholdDto {
  threshold?: number | null;
  sum?: number | null;
  vat_sum?: number | null;
  vat_rate?: number | null;
}

/**
 * Номер телефона
 */
export class GetOrderInfoPhoneDto {
  number?: string | null;
  additional?: string | null;
}

/**
 * Контактное лицо (отправитель / получатель)
 */
export class GetOrderInfoContactDto {
  company?: string | null;
  name?: string | null;
  contragent_type?: string | null;
  passport_series?: string | null;
  passport_number?: string | null;
  passport_date_of_issue?: string | null;
  passport_organization?: string | null;
  tin?: string | null;
  passport_date_of_birth?: string | null;
  email?: string | null;
  phones?: GetOrderInfoPhoneDto[] | null;
  passport_requirements_satisfied?: boolean | null;
}

/**
 * Реквизиты продавца на уровне заказа
 */
export class GetOrderInfoSellerDto {
  name?: string | null;
  inn?: string | null;
  phone?: string | null;
  ownership_form?: number | null;
  address?: string | null;
}

/**
 * Адрес местоположения
 */
export class GetOrderInfoLocationDto {
  code?: string | number | null;
  city_uuid?: string | null;
  city?: string | null;
  fias_guid?: string | null;
  kladr_code?: string | null;
  country_code?: string | null;
  country?: string | null;
  region?: string | null;
  region_code?: number | null;
  fias_region_guid?: string | null;
  sub_region?: string | null;
  longitude?: number | null;
  latitude?: number | null;
  time_zone?: string | null;
  payment_limit?: number | null;
  address?: string | null;
  postal_code?: string | null;
}

/**
 * Дополнительная услуга
 */
export class GetOrderInfoServiceDto {
  code?: string | null;
  parameter?: string | number | null;
  sum?: number | null;
  total_sum?: number | null;
  discount_percent?: number | null;
  discount_sum?: number | null;
  vat_rate?: number | null;
  vat_sum?: number | null;
}

/**
 * Услуга упаковки
 */
export class GetOrderInfoPackageServiceDto {
  code?: string | null;
}

/**
 * Детали возврата товара
 */
export class GetOrderInfoReturnItemDetailDto {
  direct_order_number?: string | null;
  direct_order_uuid?: string | null;
  direct_package_number?: string | null;
}

/**
 * Позиция товара в упаковке
 */
export class GetOrderInfoItemDto {
  name?: string | null;
  ware_key?: string | null;
  marking?: string | null;
  payment?: MoneyDto | null;
  weight?: number | null;
  weight_gross?: number | null;
  amount?: number | null;
  delivery_amount?: number | null;
  name_i18n?: string | null;
  brand?: string | null;
  country_code?: string | null;
  material?: string | null;
  wifi_gsm?: boolean | null;
  url?: string | null;
  seller?: SellerItemDto | null;
  return_item_detail?: GetOrderInfoReturnItemDetailDto | null;
  excise?: boolean | null;
  cost?: number | null;
  feacn_code?: string | null;
  jewel_uin?: string | null;
  used?: boolean | null;
}

/**
 * Упаковка заказа
 */
export class GetOrderInfoPackageDto {
  number?: string | null;
  barcode?: string | null;
  weight?: number | null;
  length?: number | null;
  width?: number | null;
  weight_volume?: number | null;
  weight_calc?: number | null;
  height?: number | null;
  comment?: string | null;
  items?: GetOrderInfoItemDto[] | null;
  services?: GetOrderInfoPackageServiceDto[] | null;
  package_id?: string | number | null;
}

/**
 * Статус заказа
 */
export class GetOrderInfoStatusDto {
  code?: string | null;
  name?: string | null;
  date_time?: string | null;
  reason_code?: string | null;
  city?: string | null;
  city_uuid?: string | null;
  deleted?: boolean | null;
}

/**
 * Причина задержки
 */
export class GetOrderInfoDelayReasonDto {
  create_date?: string | null;
  description?: string | null;
}

/**
 * Информация об оплате при получении
 */
export class GetOrderInfoPaymentInfoDto {
  type?: 'CASH' | 'CARD' | string | null;
  sum?: number | null;
}

/**
 * Детали вручения / доставки
 */
export class GetOrderInfoDeliveryDetailDto {
  date?: string | null;
  recipient_name?: string | null;
  payment_sum?: number | null;
  delivery_sum?: number | null;
  total_sum?: number | null;
  payment_info?: GetOrderInfoPaymentInfoDto[] | null;
  delivery_vat_rate?: number | null;
  delivery_vat_sum?: number | null;
  delivery_discount_percent?: number | null;
  delivery_discount_sum?: number | null;
}

/**
 * Проблема доставки
 */
export class GetOrderInfoDeliveryProblemDto {
  code?: string | null;
  create_date?: string | null;
}

/**
 * Неудачный звонок
 */
export class GetOrderInfoFailedCallDto {
  date_time?: string | null;
  reason_code?: number | null;
}

/**
 * Перенесённый звонок
 */
export class GetOrderInfoRescheduledCallDto {
  date_time?: string | null;
  date_next?: string | null;
  time_next?: string | null;
  comment?: string | null;
}

/**
 * Информация о звонках
 */
export class GetOrderInfoCallsDto {
  failed_calls?: GetOrderInfoFailedCallDto[] | null;
  rescheduled_calls?: GetOrderInfoRescheduledCallDto[] | null;
}

/**
 * Ошибка обработки запроса
 */
export class GetOrderInfoErrorDto {
  code?: string | null;
  additional_code?: string | null;
  message?: string | null;
}

/**
 * Предупреждение обработки запроса
 */
export class GetOrderInfoWarningDto {
  code?: string | null;
  message?: string | null;
}

/**
 * Информация о запросе на создание/изменение заказа
 */
export class GetOrderInfoRequestDto {
  request_uuid?: string | null;
  type?: string | null;
  date_time?: string | null;
  state?: string | null;
  errors?: GetOrderInfoErrorDto[] | null;
  warnings?: GetOrderInfoWarningDto[] | null;
}

/**
 * Связанная сущность (квитанция, возврат и т.д.)
 */
export class GetOrderInfoRelatedEntityDto {
  uuid?: string | null;
  type?:
    | 'return_order'
    | 'direct_order'
    | 'barcode'
    | 'waybill'
    | 'reverse_order'
    | 'delivery'
    | string
    | null;
  url?: string | null;
  create_time?: string | null;
  cdek_number?: string | null;
  date?: string | null;
  time_from?: string | null;
  time_to?: string | null;
}
