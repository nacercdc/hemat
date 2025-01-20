/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable @typescript-eslint/no-unsafe-return */
import type {
  AggregateField,
  FirebaseFirestoreTypes,
} from "@react-native-firebase/firestore";
import type { Filter, OrderBy } from "./types/filter.type";
import { FilterService, OrderService } from "./filter";

export class Query<T extends FirebaseFirestoreTypes.DocumentData> {
  constructor(private reference: FirebaseFirestoreTypes.Query<T>) {}

  filter(params?: Filter<T>) {
    const filterService = new FilterService(params);
    const conditions = filterService.getConditions();
    conditions.forEach(({ field, operator, value }) => {
      this.reference = this.reference.where(field, operator, value);
    });

    return this;
  }

  orderBy(params?: OrderBy<T>) {
    const orderService = new OrderService(params);
    const conditions = orderService.getConditions();
    conditions.forEach(({ field, direction }) => {
      this.reference = this.reference.orderBy(field, direction);
    });

    return this;
  }

  limit(limit?: number) {
    if (!limit) return this;
    this.reference = this.reference.limit(limit);
    return this;
  }

  limitToLast(lastLimit?: number) {
    if (!lastLimit) return this;
    this.reference = this.reference.limitToLast(lastLimit);
    return this;
  }
  startAfter(param?: FirebaseFirestoreTypes.QueryDocumentSnapshot<T>) {
    this.reference = this.reference.startAfter(param);
    return this;
  }

  get(
    options?: FirebaseFirestoreTypes.GetOptions
  ): Promise<FirebaseFirestoreTypes.QuerySnapshot<T>> {
    return this.reference.get(options) as any;
  }

  count(): FirebaseFirestoreTypes.AggregateQuery<{
    count: AggregateField<number>;
  }> {
    return this.reference.count();
  }

  countFromServer(): FirebaseFirestoreTypes.AggregateQuery<{
    count: AggregateField<number>;
  }> {
    return this.reference.countFromServer();
  }

  getQuery() {
    return this.reference;
  }
}
