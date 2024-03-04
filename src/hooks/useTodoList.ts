import { useReducer } from 'react';
import { match } from 'ts-pattern';

import type { Todo, ReducerAction } from '@/types';

type AddAction = ReducerAction<'added', Omit<Todo, 'completed'>>;
type ChangAction = ReducerAction<'changed', { todo: Todo }>;
type DeletAction = ReducerAction<'deleted', Pick<Todo, 'id'>>;

// I use the word event but you can replace it with action if you are used to
// Redux's terminology.
type TodoEvent = AddAction | ChangAction | DeletAction;

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

export const useTodoList = (initialTodos: Todo[]) => {
  const [todos, dispatch] = useReducer(reducer, initialTodos);

  function add(title: string) {
    dispatch({
      type: 'added',
      payload: { id: nextId++, title },
    });
  }

  function update(todo: Todo) {
    dispatch({
      type: 'changed',
      payload: { todo },
    });
  }

  function remove(id: Todo['id']) {
    dispatch({
      type: 'deleted',
      payload: { id },
    });
  }

  return [todos, add, update, remove] as const;
};
