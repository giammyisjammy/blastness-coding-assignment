import { useState } from 'react';

export type AddTodoProps = { onAddTodo: (text: string) => void };

export default function AddTodo({ onAddTodo }: AddTodoProps) {
  const [text, setText] = useState('');
  return (
    <>
      <input
        placeholder="Add todo"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        onClick={() => {
          setText('');
          onAddTodo(text);
        }}
      >
        Add
      </button>
    </>
  );
}
