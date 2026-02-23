export type Product = {
  id: string;
  title: string;
  imageSrc: string;
  ingredients: string[];
  price: number;
  badge?: 'new' | 'popular';
};

