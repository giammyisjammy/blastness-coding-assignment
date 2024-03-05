import React from 'react';

import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

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
    <List>
      {todos.map((todo) => (
        <ListItem key={todo.id} disablePadding>
          <Todo todo={todo} onChange={onChangeTodo} onDelete={onDeleteTodo} />
        </ListItem>
      ))}
    </List>
  );
}

interface TodoProps {
  todo: Todo;
  onChange: (todo: Todo) => void;
  onDelete: (id: Todo['id']) => void;
}

function Todo({ todo, onChange, onDelete }: TodoProps) {
  const [isEditing, setIsEditing] = React.useState(false);
  const todoContent = isEditing ? (
    <TextField
      value={todo.title}
      onChange={(e) => {
        onChange({
          ...todo,
          title: e.target.value,
        });
      }}
      fullWidth
    />
  ) : null;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 2,
        width: '100%',
      }}
    >
      <Stack direction="row" sx={{ width: '100%' }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={todo.completed}
              onChange={(e) => {
                onChange({
                  ...todo,
                  completed: e.target.checked,
                });
              }}
            />
          }
          label={!isEditing && todo.title}
        />

        {todoContent}
      </Stack>
      <Stack direction="row" spacing={1} alignItems="center">
        <IconButton
          aria-label="edit"
          color="primary"
          onClick={() => setIsEditing(!isEditing)}
        >
          <EditIcon />
        </IconButton>
        <IconButton
          aria-label="delete"
          color="error"
          onClick={() => onDelete(todo.id)}
        >
          <DeleteIcon />
        </IconButton>
      </Stack>
    </Box>
  );
}
