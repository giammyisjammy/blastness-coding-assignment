import { match } from 'ts-pattern';

import { useFetch } from '@/hooks/useFetch';

import { TodoWidget } from './TodoWidget';

import type { Todo } from '@/types';

// const url = 'https://jsonplaceholder.typicode.com/todos/10';
const url = 'https://jsonplaceholder.typicode.com/users/1/todos';

export default function TodoPage() {
  const fetchState = useFetch<Todo[]>(url);
  // const isLoading = fetchState.status === 'loading';

  return (
    <div>
      {match(fetchState)
        .with({ status: 'idle' }, () => (
          <>
            <h1>Idle</h1>
            <p>Nothing is happening at the moment</p>
          </>
        ))
        .with({ status: 'loading' }, () => (
          <>
            <h1>Loading...</h1>
            <p>(you can click on success, error, or cancel)</p>
          </>
        ))
        .with({ status: 'error' }, ({ error }) => (
          <>
            <h1>Error!</h1>
            <p>the error message is "{error.message}"</p>
          </>
        ))
        .with({ status: 'success' }, ({ data: todos }) => (
          <>
            <h1>fetch Success!</h1>
            <TodoWidget todos={todos} />
          </>
        ))
        .exhaustive()}
    </div>
  );
}
