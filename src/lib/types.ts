export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  ingredients: string;
  calories: number;
  prepTime: string;
  isDeal: boolean;
  isVegetarian: boolean;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export type ViewType = 'menu' | 'admin-login' | 'admin';

export interface ProductFormData {
  name: string;
  category: string;
  price: string;
  ingredients: string;
  calories: string;
  prepTime: string;
  isDeal: boolean;
  isVegetarian: boolean;
}

export const EMPTY_FORM: ProductFormData = {
  name: '',
  category: 'Yiros',
  price: '',
  ingredients: '',
  calories: '',
  prepTime: '',
  isDeal: false,
  isVegetarian: false,
};
