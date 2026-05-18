export enum FeatureFlagEnum {
  // ff для включения платежной системы в подписках
  PAYMENT_FOR_SUBSCRIPTION = 'payment_for_subscription',
  // ff для включения платежной системы в заказах
  PAYMENT_FOR_ORDERS = 'payment_for_orders',
  // когда зарелизмся ввключать, он отключает все кроме лэндинга на fe
  IS_RELEASE = 'IS_RELEASE',
}
