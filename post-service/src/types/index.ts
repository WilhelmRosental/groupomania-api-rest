export interface PostAttributes {
  id?: number;
  userId: number;
  title: string;
  content: string;
  imageUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PostCreationAttributes {
  userId: number;
  title: string;
  content: string;
  imageUrl?: string;
}

export interface PaginationQuery {
  page?: string;
  limit?: string;
}

export interface PostQuery extends PaginationQuery {
  userId?: string;
}

export interface JWTPayload {
  userId: number;
  email: string;
  isAdmin: boolean;
  iat?: number;
  exp?: number;
}
