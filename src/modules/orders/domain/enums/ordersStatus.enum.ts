export enum OrderStatusEnum {
  PENDING = 'pending',
  PAID = 'paid',
  PICKED_UP = 'picked_up',
  ORDER_IN_TRANSIT = 'in_transit',
  ORDER_DELIVERED = 'delivered',
  ORDER_RECEIVED = 'received',
  CANCELLED = 'cancelled',
}

export const OrderStatusTranslations = {
  [OrderStatusEnum.PENDING]: 'Pending',
  [OrderStatusEnum.PAID]: 'Paid',
  [OrderStatusEnum.PICKED_UP]: 'Picked up',
  [OrderStatusEnum.ORDER_IN_TRANSIT]: 'Order in transit',
  [OrderStatusEnum.ORDER_DELIVERED]: 'Order delivered',
  [OrderStatusEnum.ORDER_RECEIVED]: 'Order received',
  [OrderStatusEnum.CANCELLED]: 'Cancelled',
};
