export interface NewProductModel {
  code: string;
  title: string;
  stock: number;
  specification: string;
}

export interface EditProductModel {
  id: number;
  code: string;
  title: string;
  stock: number;
  specification: string;
}

export interface TableProductModel {
  id: number;
  code: string;
  title: string;
  stock: number;
  specification: string;
}

export interface TableStockModel {
  quantity: number;
  detail: string;
  addStock: boolean;
  code: string;
  createdAt: string;
}

export interface SearchProductModel {
  code: string;
  title: string;
  stock: number;
  quantity: number;
}
