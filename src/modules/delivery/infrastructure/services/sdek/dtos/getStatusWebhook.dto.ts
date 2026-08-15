/**
 * {
  "type": "ORDER_STATUS",
  "date_time": "2023-11-28T07:44:45+0000",
  "uuid": "72753031-1820-4f99-9240-aab139f05ca5",
  "attributes": {
    "is_return": false,
    "is_reverse": false,
    "is_client_return": false,
    "cdek_number": "1100285492",
    "number": "17011574744791",
    "related_entities": [],
    "code": "RECEIVED_AT_SHIPMENT_WAREHOUSE",
    "status_code": "3",
    "status_date_time": "2023-11-28T07:44:45+0000",
    "city_name": "Новосибирск",
    "city_code": "270",
    "deleted": false
  }
}

 */

export class GetStatusWebhookAttributesDto {
    is_return: boolean;
    is_reverse: boolean;
    is_client_return: boolean;
            /**
         * Номер заказа СДЭК
         */
    cdek_number: string;
    number: string;
    related_entities: any[];
    code: string;
    status_code: string;
    status_date_time: string;
    city_name: string;
    city_code: string;
    deleted: boolean;
}


export class GetStatusWebhookResponseDto {
    type: string;
    date_time: string;
    uuid: string;
    attributes: GetStatusWebhookAttributesDto;
}