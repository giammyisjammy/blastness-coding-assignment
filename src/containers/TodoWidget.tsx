import AddTodo from '@/components/AddTodo';
import TodoList from '@/components/TodoList';
import { useTodoList } from '@/hooks/useTodoList';

import type { Todo } from '@/types';

export type TodoWidgetProps = { todos: Todo[] };

export function TodoWidget({ todos: initialTodos }: TodoWidgetProps) {
  const [todos, handleAddTodo, handleChangeTodo, handleDeleteTodo] =
    useTodoList(initialTodos);

  return (
    <>
      <AddTodo onAddTodo={handleAddTodo} />
      <TodoList
        todos={todos}
        onChangeTodo={handleChangeTodo}
        onDeleteTodo={handleDeleteTodo}
      />
    </>
  );
}
