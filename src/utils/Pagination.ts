import { Types } from "mongoose";

export interface PaginationParams {
  skip?: string | number;
  limit?: string | number;
}

export type PaginationResponse<T> = {
  hasMore: boolean;
  nextCursor?: Types.ObjectId;
  previousCursor?: Types.ObjectId;
  data: T[];
};

export function parsePagination(
  { skip, limit }: PaginationParams,
  maxLimit = 25,
): {
  skip: number;
  limit: number;
} {
  return {
    skip: Number(skip || 0),
    limit: Math.min(Number(limit || maxLimit), maxLimit),
  };
}
