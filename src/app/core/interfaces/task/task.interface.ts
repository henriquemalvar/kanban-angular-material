import { Category } from '@interfaces/category/category.interface';

export interface Task {
  _id: string;
  status: string | 'Não iniciado' | 'Em progresso' | 'Completo';
  title: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  user_id: string;
  categories: Category[];
}
