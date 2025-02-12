/* eslint-disable @typescript-eslint/no-explicit-any */
import type { OrderByDirection } from "@react-native-firebase/firestore";

export type MutationOpr = "add" | "update" | "delete";

export type WhereFilterOp =
  | "<"
  | "<="
  | "=="
  | ">"
  | ">="
  | "!="
  | "array-contains"
  | "array-contains-any"
  | "in"
  | "not-in";

export type ObjectLiteral = Record<string, any>;
export interface IWhere {
  field: string;
  operator: WhereFilterOp;
  value: any;
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
