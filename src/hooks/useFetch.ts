import { useCallback, useEffect, useReducer, useRef } from 'react';
import { match, P } from 'ts-pattern';

import fetcher, { ResponseError } from '@/helpers/fetch';
import type { LoadingState } from '@/types';

type Event<T> =
  | { type: 'fetch' }
  | { type: 'success'; data: T }
  | { type: 'error'; error: Error }
  | { type: 'cancel' };

const initState: LoadingState<never> = {
  status: 'idle',
};

/**
 * Depending on the current state, some event shouldn't have any effect.
 * Namely 'success', 'error' and 'cancel' events only make sense when we are
 * currently in the loading state.
 */
const reducer = <T>(state: LoadingState<T>, event: Event<T>): LoadingState<T> =>
  match<[LoadingState<T>, Event<T>], LoadingState<T>>([state, event])
    .with([{ status: 'loading' }, { type: 'success' }], ([, { data }]) => ({
      status: 'success',
      data,
    }))
    .with(
      [{ status: 'loading' }, { type: 'error', error: P.select() }],
      (error) => ({
        status: 'error',
        error,
      })
    )
    .with([{ status: 'loading' }, { type: 'cancel' }], () => initState)
    .with([{ status: P.not('loading') }, { type: 'fetch' }], () => ({
      status: 'loading',
    }))
    .otherwise(() => state);

// in a real world app, this task would be delegated to a robust library like
// react-query or SWR
export function useFetch<T>(
  url: RequestInfo | URL,
  options?: RequestInit
): LoadingState<T> {
  // Since you can never be sure when data will resolve with asynchronous
  // programming, there’s always a risk that the data will resolve after the
  // component  has been removed. Updating data on an unmounted component is
  // inefficient and can introduce memory leaks in the app.
  const isMounted = useMountedState();
  const reducer = typedReducer<T>();
  const [state, dispatch] = useReducer(reducer, initState);

  /**
   * Handle fetch request
   */
  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'fetch' });
      try {
        const data = await fetcher(url, options);
        if (isMounted()) {
          // prevent data updates on unmounted components.
          dispatch({ type: 'success', data });
        }
      } catch (error) {
        dispatch({ type: 'error', error: error as ResponseError });
      }
    };

    fetchData();
  }, []);

  return state;
}

// internal helper

function useMountedState(): () => boolean {
  const mountedRef = useRef<boolean>(false);
  const get = useCallback(() => mountedRef.current, []);

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
    };
  }, []);

  return get;
}

type TypedReducer = <T>() => (
  state: LoadingState<T>,
  event: Event<T>
) => LoadingState<T>;

/**
 * This prepare callback allows to easily create a reducer that has both type
 * parameters that can be inferred from arguments, removing the need to
 * explicitly specify the types.
 *
 * @example
 *
 * type Payload = { text: 'foo' | 'bar' };
 * const reducer = typedReducer<Payload>();
 *
 * const [state, dispatch] = useReducer(reducer, initState);
 *
 * const { text } = state; // <- inferred
 *
 */
const typedReducer: TypedReducer = () => reducer;
