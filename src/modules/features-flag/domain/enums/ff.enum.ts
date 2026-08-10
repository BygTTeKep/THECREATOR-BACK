export enum FeatureFlagEnum {
  // ff для включения платежной системы в подписках
  PAYMENT_FOR_SUBSCRIPTION = 'PAYMENT_FOR_SUBSCRIPTION',
  // ff для включения платежной системы в заказах
  PAYMENT_FOR_ORDERS = 'PAYMENT_FOR_ORDERS',
  // когда зарелизмся ввключать, он отключает все кроме лэндинга на fe
  IS_RELEASE = 'IS_RELEASE',
}
