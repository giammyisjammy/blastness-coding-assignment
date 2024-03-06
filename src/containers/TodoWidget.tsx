import AddTodo from '@/components/AddTodo';
import TodoList from '@/components/TodoList';

import { useTodoState, useTodoUpdater } from './Todo';

export function TodoWidget() {
  const todos = useTodoState();
  const {
    add: handleAddTodo,
    update: handleChangeTodo,
    remove: handleDeleteTodo,
  } = useTodoUpdater();

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
