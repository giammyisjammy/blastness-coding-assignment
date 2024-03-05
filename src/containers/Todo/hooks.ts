import React from 'react';

import { TodoStateContext, TodoUpdaterContext } from './context';
import { Todo, TodoAction } from '@/types';
import { match } from 'ts-pattern';

// I use the word event but you can replace it with action if you are used to
// Redux's terminology.
type AddEvent = TodoAction<'added', Omit<Todo, 'completed'>>;
type ChangEvent = TodoAction<'changed', { todo: Todo }>;
type DeleteEvent = TodoAction<'deleted', Pick<Todo, 'id'>>;
type TodoEvent = AddEvent | ChangEvent | DeleteEvent;

// in a real world app, there should be a mechanism to assign ids univocally
// i.e. import { uuid } from 'uuidv4';
// implementing such mechanism is outside the scope of the exercise
let nextId = 101;

const reducer: React.Reducer<Todo[], TodoEvent> = (state, event) =>
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

export const useTodosReducer = (initialTodos: Todo[]) => {
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

export function useTodoState() {
  const todos = React.useContext(TodoStateContext);
  if (typeof todos === 'undefined') {
    throw new Error('useTodoState must be used within a CountProvider');
  }
  return todos;
}

export function useTodoUpdater() {
  const handlers = React.useContext(TodoUpdaterContext);
  if (typeof handlers === 'undefined') {
    throw new Error('useTodoUpdater must be used within a CountProvider');
  }
  return handlers;
}
