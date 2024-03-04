import { useState } from 'react';

import type { Todo } from '@/types';

export type TodoListProps = {
  todos: Todo[];
  onChangeTodo: (todo: Todo) => void;
  onDeleteTodo: (id: Todo['id']) => void;
};

export default function TodoList({
  todos,
  onChangeTodo,
  onDeleteTodo,
}: TodoListProps) {
  return (
    <ul>
      {todos.map((todo) => (
        <li key={todo.id}>
          <Todo todo={todo} onChange={onChangeTodo} onDelete={onDeleteTodo} />
        </li>
      ))}
    </ul>
  );
}

interface TodoProps {
  todo: Todo;
  onChange: (todo: Todo) => void;
  onDelete: (id: Todo['id']) => void;
}

function Todo({ todo, onChange, onDelete }: TodoProps) {
  const [isEditing, setIsEditing] = useState(false);
  const todoContent = isEditing ? (
    <>
      <input
        value={todo.title}
        onChange={(e) => {
          onChange({
            ...todo,
            title: e.target.value,
          });
        }}
      />
      <button onClick={() => setIsEditing(false)}>Save</button>
    </>
  ) : (
    <>
      {todo.title}
      <button onClick={() => setIsEditing(true)}>Edit</button>
    </>
  );

  return (
    <label>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={(e) => {
          onChange({
            ...todo,
            completed: e.target.checked,
          });
        }}
      />
      {todoContent}
      <button onClick={() => onDelete(todo.id)}>Delete</button>
    </label>
  );
}
