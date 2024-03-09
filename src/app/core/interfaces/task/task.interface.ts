import { ICategory } from '@interfaces/category/category.interface';
import { IUser } from '@interfaces/user/user.interface';

export interface ITask {
  _id: string;
  status: string | 'Não iniciado' | 'Em progresso' | 'Completo';
  title: string;
  description: string;
  createdAt?: Date;
  updatedAt?: Date;
  user_id: string;
  user?: IUser;
  categories?: ICategory[];
  categories_ids: string[];
}
