export interface AllOrdersReducerAction {
  type:
  | 'ADD-ORDERS'
  | 'UPDATE-ONE-PRODUCT'
  | 'CHECK-ONE-PRODUCT'
  | 'REMOVE-ONE-ORDER'
  | 'ADD-ONE-ORDER'
  | 'REMOVE-COMMAND-ORDERS'
  | 'DEFROST-ONE-PRODUCT';
  payload: any;
}
