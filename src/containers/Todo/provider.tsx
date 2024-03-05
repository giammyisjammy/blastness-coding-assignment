import React from 'react';

import { TodoStateContext, TodoUpdaterContext } from './context';
import { useTodosReducer } from './hooks';

import type { Todo } from '@/types';

export type TodoProviderProps = {
  children: React.ReactNode;
  initialTodos: Todo[];
};

export const TodoProvider = ({ children, initialTodos }: TodoProviderProps) => {
  const [todos, add, update, remove] = useTodosReducer(initialTodos);

  return (
    <TodoStateContext.Provider value={todos}>
      <TodoUpdaterContext.Provider value={{ add, update, remove }}>
        {children}
      </TodoUpdaterContext.Provider>
    </TodoStateContext.Provider>
  );
};
