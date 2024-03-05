<p align="center">
  <a href="https://vitejs.dev" target="_blank" rel="noopener noreferrer">
    <img  src="docs/blastness-logo.png" alt="Vite logo">
  </a>
</p>
<br/>
<p align="center">
  <a href="https://nodejs.org/en/about/releases/"><img src="https://img.shields.io/node/v/vite.svg" alt="node compatibility"></a>
</p>
<br/>

# React + TypeScript + Vite ⚡

This project was bootstrapped with `pnpm create vite --template react-ts`.

It's a classic TodoApp used to showcase basic usage of some advanced React concepts i.e. `useReducer`, the `Context` API.

> This is a contrived example that I'm intentionally over-engineering to show what a more real-world scenario would be like. **This does not mean it has to be this complicated every time!** The simplest solution should always be preferred whenever possible - i.e. feel free to use `useState` if that suits your scenario.

## Relevant points

### `React.Context` and performance

I kept an eye open for creating `React.Context` consumers effectively to avoid some performance problems, improve the developer experience and maintainability of the context objects created for the application and/or libraries.

The approach used in `@/containers/Todo/context` has the benefit of avoiding the need to `useMemo` the consumer components. Since the state and actions are separated, the `<Todo />` component's context isn't getting updated, we avoid the re-render of that component entirely which is cool.

I personally feel like this is more complicated of an API than is necessary for most situations, so I wouldn't bother optimizing most of my contexts. But if:

1. Your context value changes frequently
2. Your context has many consumers
3. You are bothering to use `React.memo` (because things are legit slow)
4. You've actually measured things and you know it's slow and needs to be optimized

then consider doing this as a simple way to side-step the issue.

<details>
  <summary>Use case w/ perfomance measuring (code example)</summary>

```tsx
import React from 'react';
import ReactDOM from 'react-dom';
import { TodoProvider, useTodoState, useTodoUpdater } from '@/containers/Todo';

function useRenderCounter() {
  const ref = React.useRef();
  React.useEffect(() => {
    ref.current.textContent = Number(ref.current.textContent || '0') + 1;
  });
  return (
    <span
      style={{
        backgroundColor: '#ccc',
        borderRadius: 4,
        padding: '2px 4px',
        fontSize: '0.8rem',
        margin: '0 6px',
        display: 'inline-block',
      }}
      ref={ref}
    />
  );
}

const TodoDisplay = React.memo(function TodoDisplay() {
  const todo = useTodoState();
  const renderCount = useRenderCounter();
  // For simplicity's sake, just show the string representation of first item
  const serializedTodo = JSON.stringify(todo.slice(0, 1), null, 2);
  return (
    <div style={{ border: '1px solid black', padding: 10 }}>
      {renderCount}
      {`The first todo is ${serializedTodo}. `}
    </div>
  );
});

const AddTodo = React.memo(function AddTodo() {
  const { add } = useTodoUpdater();
  const renderCount = useRenderCounter();
  return (
    <div style={{ border: '1px solid black', padding: 10 }}>
      {renderCount}
      <button onClick={() => add('new todo')}>Add todo</button>
    </div>
  );
});

function App() {
  const [, forceUpdate] = React.useState();
  const renderCount = useRenderCounter();
  return (
    <div style={{ border: '1px solid black', padding: 10 }}>
      {renderCount}
      <button onClick={() => forceUpdate()}>force render</button>
      <TodoProvider>
        <TodoDisplay />
        <AddTodo />
      </TodoProvider>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
```

</details>

### Pattern matching for reducers and JSX

I think that the most interesting point is the use of [pattern matching](https://github.com/gvergnaud/ts-pattern) which comes with various benefits:

- Typesafe, with helpful [type inference](https://github.com/gvergnaud/ts-pattern#type-inference)
- Exhaustiveness checking ensures you haven’t forgotten any possible case (unlike in a plain `switch` statement)
- Code becomes shorter and more readable

I intentionally over-used it to demonstrate the power and flexibility of this approach:

- `TodoPage` uses in two occasion, one in the simpler `<StatusChip/>` component (matching a plain string) and another in the JSX part (matching a pattern on its state)
- `useTodosReducer` also uses it
- `useFetch` hook models its state.

I should point out that the last example has really little utility in a production app (at least as-is). It's main purpose is to demonstrate how to handle complex conditions. In this case, to avoid unwanted state changes that could lead to bugs, we want our state reducer function to branch on both the state and the event, and return a new state.

> Only a subset of these fetch events make sense for each given state - `'success'`, `'error'` and `'cancel'` events only make sense when we are currently in the `'loading'` state.

I leave other details for the follow-up call.

### `@/containers/Todo` folder structure

The folder structure is designed to avoid breaking HMR during development.

Declaring providers and hooks in the same file like this:

```tsx
// fail
export const foo = () => {}; // e.g. some hook
export const Bar = () => <></>; // e.g. some JSX component
```

Would result in this runtime warning:

```
Could not Fast Refresh. Learn more at https://github.com/vitejs/vite-plugin-react/tree/main/packages/plugin-react#consistent-components-exports
```

> You can find a complete explanation in these [Vite plugin docs](https://github.com/vitejs/vite-plugin-react/tree/main/packages/plugin-react#consistent-components-exports) and [Gatsby docs](https://www.gatsbyjs.com/docs/reference/local-development/fast-refre.sh/#how-it-works) pages.

To re-enable HMR, the file should only export React components

```tsx
// pass
const foo = () => {};
export const Bar = () => <></>;
```

Solution: move hooks to another file and expose only relevant components from `index.ts` file.

###
