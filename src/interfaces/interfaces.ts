export interface Product {
  id: string;
  name: string;
  place: string;
  cost: number;
  image: string;
  availability: number;
  minOrder: number;
  reserved: boolean;
  reservedCost: number;
  additionalInformation?: string;
  finished: boolean;
  dateAdded: string;
}

export interface ProductFilter {
  names: string[];
  places: string[];
}

export interface User {
  id: string;
  username: string;
  phoneNumber: string;
  offers?: string[];
  userReserved?: string[];
}