export type LoadingStatus = 'idle' | 'loading' | 'success' | 'error';

export type LoadingState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: Error };

/**
 * NOTE: the field "userId" is voluntarily omitted because this information
 * is irrelevant to app scope
 */
export type Todo = {
  id: number;
  title: string;
  completed: boolean;
};

export type TodoAction<
  T extends string = string,
  P extends Record<string, unknown> = Record<string, unknown>
> = {
  type: T;
  payload: P;
};
