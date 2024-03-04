
/**
 * NOTE: the field "userId" is voluntarily omitted because this information
 * is irrelevant to app scope
 */
export type Todo = {
  id: number;
  title: string;
  completed: boolean;
};

export type ReducerAction<
  T extends string = string,
  P extends Record<string, unknown> = Record<string, unknown>
> = {
  type: T;
  payload: P;
};
