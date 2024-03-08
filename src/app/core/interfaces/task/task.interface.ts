import { ICategory } from '@interfaces/category/category.interface';

export interface ITask {
  _id: string;
  status: string | 'Não iniciado' | 'Em progresso' | 'Completo';
  title: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  user_id: string;
  categories: ICategory[];
}
