import BaseModel from './base';

export default interface Product extends BaseModel {
  name: string;
  price: string | number;
  imageUrl: string;
  category: string;
  availability: string;
}
