import BaseModel from './base';

export default interface User extends BaseModel {
  firstname?: string;
  lastname?: string;
  email: string;
  password: string;
  permissions?: string;
}
