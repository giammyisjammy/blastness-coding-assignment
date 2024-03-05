export type LoadingStatus = 'idle' | 'loading' | 'success' | 'error';

export type LoadingState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: Error };

/**
 * NOTE: although the API also returns a field named "userId" it is voluntarily
 * ignored because that information is outside the app scope
 */
export interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

export interface TodoAction<
  T extends string = string,
  P extends Record<string, unknown> = Record<string, unknown>
> {
  type: T;
  payload: P;
}
