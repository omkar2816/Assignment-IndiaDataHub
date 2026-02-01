// Type definitions for the application

export interface CategoryItem {
  [key: string]: CategoryItem | {};
}

export interface Categories {
  [key: string]: CategoryItem;
}

export interface FrequentItem {
  id: string;
  title: string;
  cat: string;
  subCat: string;
  subset?: string;
  freq: string;
  unit: string;
  src: string;
  sData: string;
  datatype: string;
  hierarchy: string[];
  db: string;
  table_name?: string;
  region?: string;
}

export interface DataResponse {
  categories: Categories;
  frequent: FrequentItem[];
}

export type DatasetType = 'default' | 'IMF';

export interface User {
  username: string;
  password: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
}