/* eslint-disable @typescript-eslint/no-explicit-any */
import type { OrderByDirection } from "@react-native-firebase/firestore";
import type { FieldPath, WhereFilterOp } from "firebase/firestore";
import type { Filter, OrderBy } from "./filter.type";
export interface IQueryOption<T> {
  filters?: Filter<T>;
  orderBy?: OrderBy<T>;
  limit?: number;
}

export type ObjectLiteral = Record<string, any>;
export interface IWhere {
  field: string | FieldPath;
  operator: WhereFilterOp;
  value: unknown;
}
export const QUERY_OPERATORS: Record<string, WhereFilterOp> = {
  eq: "==",
  notEq: "!=",
  lt: "<",
  lte: "<=",
  gt: ">",
  gte: ">=",
  in: "in",
  notIn: "not-in",
  arrayContains: "array-contains",
  arrayContainsAny: "array-contains-any",
};

export interface IOrderBy {
  field: string;
  direction: OrderByDirection;
}
