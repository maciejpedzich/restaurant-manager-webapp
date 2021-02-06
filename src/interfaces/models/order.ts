import OrderProduct from '../order-product';
import BaseModel from './base';

export default interface Order extends BaseModel {
  status: string;
  content: OrderProduct[];
  cost: string | number;
}
