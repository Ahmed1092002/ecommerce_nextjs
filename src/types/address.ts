export interface Address {
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  totalElements: number;
  data: AddressData[];
}

export interface AddressData {
  id: string;
  label: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
  type: AddressType;
}

export interface CreateAddressData {
  label: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
  type: AddressType;
}
export interface UpdateAddressData {
  id: string;
  label: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
  type: AddressType;
}

export enum AddressType {
  // Customer address types
  HOME = "HOME",
  WORK = "WORK",
  OTHER = "OTHER",

  // Seller address types
  WAREHOUSE = "WAREHOUSE",
  STORE = "STORE",
  PICKUP_LOCATION = "PICKUP_LOCATION",
}
