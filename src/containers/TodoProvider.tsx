import React from 'react';

import { useTodosImplementation } from '@/hooks/useTodos';

import type { Todo } from '@/types';

const TodoStateContext = React.createContext<Todo[] | undefined>(undefined);
const TodoUpdaterContext = React.createContext<
  | {
      add: (title: string) => void;
      update: (todo: Todo) => void;
      remove: (id: Todo['id']) => void;
    }
  | undefined
>(undefined);

export const TodoProvider: React.FC<{
  children: React.ReactNode;
  initialTodos: Todo[];
}> = ({ children, initialTodos }) => {
  const [todos, add, update, remove] = useTodosImplementation(initialTodos);

  return (
    <TodoStateContext.Provider value={todos}>
      <TodoUpdaterContext.Provider value={{ add, update, remove }}>
        {children}
      </TodoUpdaterContext.Provider>
    </TodoStateContext.Provider>
  );
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

export default TodoProvider;
