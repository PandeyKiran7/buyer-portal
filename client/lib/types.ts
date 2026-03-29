export type User = {
  id: number;
  email: string;
  name: string;
  role: string;
};

export type AuthResponse = {
  token: string;
  user: User;
};

export type Property = {
  id: number;
  title: string;
  address: string;
  isFavourite: boolean;
};

export type PublicProperty = {
  id: number;
  title: string;
  address: string;
  pricePerNight: number;
  rating: number;
  reviewCount: number;
};

export type Favourite = {
  propertyId: number;
  title: string;
  address: string;
  favouritedAt: string;
};

export type ValidationDetail = {
  field: string;
  message: string;
};

export type ApiErrorBody = {
  error?: string;
  details?: ValidationDetail[];
};
