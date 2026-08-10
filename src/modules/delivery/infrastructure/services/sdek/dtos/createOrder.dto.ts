import { OrderTypeEnum } from '../enums/order/orderType.enum';
import { PackageRequestDto } from './packageRequest.dto';
import { RecipientDto } from './recipient.dto';

export class ToLocationDto {
  /**
   * Строка адреса
   */
  address: string;
  /**
   * Код населенного пункта СДЭК (метод "Список населенных пунктов")
   */
  code?: number;

  /**
   * Идентификатор города в ИС СДЭК
   */
  city_uuid?: string;

  /**
   * Название населенного пункта
   */
  city?: string;

  /**
   * Идентификатор ФИАС населенного пункта
   */
  fias_guid?: string;

  /**
   * Код страны в формате ISO_3166-1_alpha-2 (по умолчанию "RU")
   */
  country_code?: string;

  /**
   * Название страны населенного пункта
   */
  country?: string;
  /**
   * Название региона
   */
  region?: string;
  /**
   * Код региона СДЭК (см. метод "Список регионов")
   */
  region_code?: number;
  /**
   * Уникальный идентификатор ФИАС региона населенного пункта
   */
  fias_region_guid?: string;
  /**
   * Название района региона
   */
  sub_region?: string;
  /**
   * Долгота
   */
  longitude?: number;
  /**
   * Широта
   */
  latitude?: number;
  /**
   * Часовой пояс населенного пункта
   */
  time_zone?: any;
  /**
   * Ограничение на сумму наложенного платежа в населенном пункте
   */
  payment_limit?: number;

  /**
   * Почтовый индекс
   */
  postal_code?: string;
}

export class CreateOrderDto {
  type?: OrderTypeEnum;
  additional_order_types?: any; //TODO

  /**
   * Номер заказа.
   * Номер заказа в ИС клиента (только для заказов типа «интернет-магазин»). Допустимые символы: цифры, латинские буквы, спецсимволы (ASCII). В пределах одного договора среди активных (успешно созданных) неудаленных заказов номер заказа должен быть уникален. Исключение: если заказ с таким же номером находится в финальном статусе (DELIVERED / NOT_DELIVERED), создание нового заказа с повторным номером разрешено.
   */
  number?: string;
  /**
   * Номер сопроводительной накладной на товар (СНТ)
   */
  accompanying_number?: string;
  /**
   * Код тарифа
   */
  tariff_code: number;
  /**
   * Комментарий к заказу
   */
  comment?: string;

  /**
   * Код ПВЗ СДЭК, на который будет производиться самостоятельный привоз клиентом. Обязательное поле, если заказ с тарифом "от склада". Не может использоваться одновременно с from_location
   */
  shipment_point?: string;

  /**
   * Код ПВЗ СДЭК, на который будет доставлена посылка. Обязательное поле, если заказ с тарифом "до склада" или "до постамата". Не может использоваться одновременно с to_location
   */
  delivery_point?: string;

  date_invoice?: any; //TODO
  shipper_name?: any; //TODO
  shipper_address?: any; //TODO
  delivery_recipient_cost?: any; //TODO
  delivery_recipient_cost_adv?: any; //TODO
  sender?: any; //TODO
  seller?: any; //TODO

  recipient: RecipientDto; //TODO

  from_location?: any; //TODO
  to_location?: ToLocationDto; //TODO
  services?: any; //TODO

  /**
   * Список упаковок заказа
   */
  packages: PackageRequestDto[];

  sender_requisites?: any; //TODO
  has_reverse_order?: any; // TODO
  developer_key?: any; // TODO
  print?: any; // TODO
  widget_token?: any; // TODO
}
