import React from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

export interface AddTodoProps {
  onAddTodo: (text: string) => void;
}

export default function AddTodo({ onAddTodo }: AddTodoProps) {
  const [text, setText] = React.useState('');

  return (
    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'baseline' }}>
      <TextField
        placeholder="Add todo"
        value={text}
        onChange={(e) => {
          setText(e.target.value);
        }}
        sx={{ width: '100%' }}
      />
      <Button
        variant="contained"
        onClick={() => {
          setText('');
          onAddTodo(text);
        }}
        sx={{ ml: 2 }}
      >
        Add
      </Button>
    </Box>
  );
}
