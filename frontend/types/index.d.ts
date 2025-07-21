export interface Category {
  categoryId: number;
  name: string;
  slug: string;
  description: string;
  parentId?: number;
  isActive: boolean;
  position: number;
  displayOrder: number;
  createdAt: string;
  updatedAt?: string;
  categoryImage?: string;
  parentName?: string;
}
