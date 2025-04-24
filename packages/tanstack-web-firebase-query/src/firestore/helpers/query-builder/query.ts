import {
  where,
  orderBy as fsOrderBy,
  limit as fsLimit,
  startAfter as fsStartAfter,
} from "firebase/firestore";
import type {
  DocumentData,
  DocumentSnapshot,
  QueryConstraint as FsQueryConstraint,
} from "firebase/firestore";
import type { Filter, OrderBy } from "./types/filter.type";
import { FilterService, OrderService } from "./filter";

export class QueryConstraint<T extends DocumentData> {
  constructor(private queryConstraints: FsQueryConstraint[]) {}

  filter(params?: Filter<T>) {
    const filterService = new FilterService(params);
    const conditions = filterService.getConditions();
    conditions.forEach(({ field, operator, value }) => {
      this.queryConstraints.push(where(field, operator, value));
    });

    return this;
  }

  orderBy(params?: OrderBy<T>) {
    const orderService = new OrderService(params);
    const conditions = orderService.getConditions();

    conditions.forEach(({ field, direction }) => {
      this.queryConstraints.push(fsOrderBy(field, direction));
    });

    return this;
  }

  limit(limit?: number) {
    if (!limit) return this;
    this.queryConstraints.push(fsLimit(limit));
    return this;
  }

  startAfter(startAfter?: DocumentSnapshot<T>) {
    if (!startAfter) return this;
    this.queryConstraints.push(fsStartAfter(startAfter));
    return this;
  }

  getQueryConstraint() {
    return this.queryConstraints;
  }
}
