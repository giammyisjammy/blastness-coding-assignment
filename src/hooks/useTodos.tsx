import React from 'react';
import { match } from 'ts-pattern';

import type { Todo, ReducerAction } from '@/types';

type AddAction = ReducerAction<'added', Omit<Todo, 'completed'>>;
type ChangAction = ReducerAction<'changed', { todo: Todo }>;
type DeleteAction = ReducerAction<'deleted', Pick<Todo, 'id'>>;

// I use the word event but you can replace it with action if you are used to
// Redux's terminology.
type TodoEvent = AddAction | ChangAction | DeleteAction;

// in a real world app, there should be a mechanism to assign ids univocally
// i.e. import { uuid } from 'uuidv4';
// implementing such mechanism is outside the scope of the exercise
let nextId = 101;

const reducer = (state: Todo[], event: TodoEvent) =>
  match(event)
    .returnType<Todo[]>()
    .with({ type: 'added' }, ({ payload }) => [
      ...state,
      {
        id: payload.id,
        title: payload.title,
        completed: false,
      },
    ])
    .with({ type: 'changed' }, ({ payload }) =>
      state.map((t) => (t.id === payload.todo.id ? payload.todo : t))
    )
    .with({ type: 'deleted' }, ({ payload }) =>
      state.filter((x) => x.id !== payload.id)
    )
    .exhaustive();

export const useTodosImplementation = (initialTodos: Todo[]) => {
  const [todos, dispatch] = React.useReducer(reducer, initialTodos);

  // NOTE: it *might* be unnecessary to memoize these function because dispatch
  // *should* be stable for the lifetime of the component that created it. I
  // tried to exclude it from the dependencies list and observed no differences.
  const add = React.useCallback(
    (title: string) => {
      dispatch({
        type: 'added',
        payload: { id: nextId++, title },
      });
    },
    [dispatch]
  );

  const update = React.useCallback(
    (todo: Todo) => {
      dispatch({
        type: 'changed',
        payload: { todo },
      });
    },
    [dispatch]
  );

  const remove = React.useCallback(
    (id: Todo['id']) => {
      dispatch({
        type: 'deleted',
        payload: { id },
      });
    },
    [dispatch]
  );

  return [todos, add, update, remove] as const;
};

// NOTE: by using separate providers for the state and the dispatch we allow
// a component to skip unnecessary re-renderings if the component just use the
// state context.
//
// Example case:
// <TodoProvider>
//   <TodoDisplay /> // only reads Todos
//   <TodoEditor /> // reads and updates Todos
// </TodoProvider>
//
// No need to use useMemo() inside <TodoList /> because by avoiding context
// updates we avoid the re-render of that component entirely
