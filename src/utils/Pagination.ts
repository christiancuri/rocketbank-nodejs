import { Types } from "mongoose";

export interface PaginationParams {
  skip?: string | number;
  limit?: string | number;
  nextCursor?: string;
}

export type PaginationResponse<T> = {
  hasMore: boolean;
  nextCursor?: Types.ObjectId;
  previousCursor?: Types.ObjectId;
  data: T[];
};

export function parsePagination(
  { skip, limit, nextCursor }: PaginationParams,
  maxLimit = 25,
): {
  skip: number;
  limit: number;
  nextCursor?: Types.ObjectId;
} {
  return {
    nextCursor: nextCursor ? new Types.ObjectId(nextCursor) : undefined,
    skip: Number(skip || 0),
    limit: Math.min(Number(limit || maxLimit), maxLimit),
  };
}
