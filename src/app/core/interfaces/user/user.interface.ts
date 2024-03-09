export interface IUser {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  email: string;
  password: string;
  photo?: string;
}
