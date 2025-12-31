export type ProductType = {
  _id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string | undefined;
  status: 'ACTIVE' | 'DRAFT' | 'SOLD_OUT';
  createdByClerkUserId: string | undefined;
};
