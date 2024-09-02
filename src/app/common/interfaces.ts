export interface IData {
  data: ITableData[];
  first: number;
  items: number;
  last: number;
  next: number; 
  pages: number;
  prev: number | null 
}

export interface ITableData {
  address: string;
  age: number;
  balance: string;
  compan: string;
  email: string;
  favoriteFruit: string;
  isActive: boolean; 
  name: IPersonName; 
  picture: string; 
  tags: string[];
  _id: string;
}

export interface IPersonName {
  first: string;
  last: string;
}

export interface IDataFilters {
  _page: number;
  _per_page: number;
}
