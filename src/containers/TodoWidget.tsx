import AddTodo from '@/components/AddTodo';
import TodoList from '@/components/TodoList';

import { TodoProvider, useTodoState, useTodoUpdater } from './Todo';

import { Todo } from '@/types';

export type TodoWidgetProps = { initialTodos: Todo[] };

export function TodoWidget({ initialTodos }: TodoWidgetProps) {
  const todos = useTodoState();
  const {
    add: handleAddTodo,
    update: handleChangeTodo,
    remove: handleDeleteTodo,
  } = useTodoUpdater();

  return (
    <TodoProvider initialTodos={initialTodos}>
      <AddTodo onAddTodo={handleAddTodo} />
      <TodoList
        todos={todos}
        onChangeTodo={handleChangeTodo}
        onDeleteTodo={handleDeleteTodo}
      />
    </TodoProvider>
  );
}
