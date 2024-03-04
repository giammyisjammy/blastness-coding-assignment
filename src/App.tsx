import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';

import ProTip from '@/components/ProTip';
import { useTodoList } from '@/hooks/useTodoList';
import AddTodo from '@/components/AddTodo';
import TodoList from '@/components/TodoList';

import type { Todo } from '@/types';

const initialTodos: Todo[] = [
  { id: 0, title: 'Visit Kafka Museum', completed: true },
  { id: 1, title: 'Watch a puppet show', completed: false },
  { id: 2, title: 'Lennon Wall pic', completed: false },
];

function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {'Copyright © Gianmarco ('}
      <Link color="inherit" href="https://github.com/giammyisjammy">
        @giammyisjammy
      </Link>
      {') '}
      {new Date().getFullYear()}.
    </Typography>
  );
}

export default function App() {
  const [todos, add, update, remove] = useTodoList(initialTodos);

  const handleAddTodo = add;
  const handleChangeTodo = update;
  const handleDeleteTodo = remove;

  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
          Todo List in TypeScript
        </Typography>
        <AddTodo onAddTodo={handleAddTodo} />
        <TodoList
          todos={todos}
          onChangeTodo={handleChangeTodo}
          onDeleteTodo={handleDeleteTodo}
        />
        <ProTip />
        <Copyright />
      </Box>
    </Container>
  );
}
