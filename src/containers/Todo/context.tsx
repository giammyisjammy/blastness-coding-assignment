import React from 'react';

import type { Todo } from '@/types';

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
// No need to use useMemo() inside <TodoDisplay /> because by avoiding context
// updates we avoid the re-render of that component entirely

export const TodoStateContext = React.createContext<Todo[] | undefined>(
  undefined
);
export const TodoUpdaterContext = React.createContext<
  | {
      add: (title: string) => void;
      update: (todo: Todo) => void;
      remove: (id: Todo['id']) => void;
    }
  | undefined
>(undefined);
