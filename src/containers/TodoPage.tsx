import { match } from 'ts-pattern';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

import { useFetch } from '@/hooks/useFetch';

import { TodoWidget } from './TodoWidget';

import type { LoadingStatus, Todo } from '@/types';

const url = 'https://jsonplaceholder.typicode.com/users/1/todos';

export default function TodoPage() {
  const fetchState = useFetch<Todo[]>(url);

  return (
    <Box>
      <Paper
        variant="outlined"
        sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}
      >
        <Typography variant="body1" sx={{ textAlign: 'end', mb: 2 }}>
          Fetch status: <StatusChip status={fetchState.status} />
        </Typography>
        {match(fetchState)
          .with({ status: 'idle' }, () => (
            <Typography variant="body1">
              Nothing is happening at the moment
            </Typography>
          ))
          .with({ status: 'loading' }, () => (
            <Typography variant="body1">Loading...</Typography>
          ))
          .with({ status: 'error' }, ({ error }) => (
            <>
              <h1>Error!</h1>
              <Typography variant="body1">
                the error message is "{error.message}"
              </Typography>
            </>
          ))
          .with({ status: 'success' }, ({ data: todos }) => (
            <TodoWidget initialTodos={todos} />
          ))
          .exhaustive()}
      </Paper>
    </Box>
  );
}

const StatusChip = ({ status }: { status: LoadingStatus }) =>
  match(status)
    .with('idle', () => <Chip label="Idle" color="info" />)
    .with('loading', () => <Chip label="Loading" color="warning" />)
    .with('error', () => <Chip label="Error" color="error" />)
    .with('success', () => <Chip label="Success" color="success" />)
    .exhaustive();
