export interface ITableData {
  address: string;
  age: number;
  balance: string;
  compan: string;
  email: string;
  favoriteFruit: FavFruit;
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

export enum FavFruit {
  apple = 'apple',
  banana = 'banana',
  strawberry = 'strawberry',
}