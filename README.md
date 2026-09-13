# Frontend Mentor - Todo app solution

This is a solution to the [Todo app challenge on Frontend Mentor](https://www.frontendmentor.io/challenges/todo-app-Su1_KokOW). Frontend Mentor challenges help you improve your coding skills by building realistic projects.

## Table of contents

- [Overview](#overview)
  - [The challenge](#the-challenge)
  - [Screenshot](#screenshot)
  - [Links](#links)
- [My process](#my-process)
  - [Built with](#built-with)
  - [What I learned](#what-i-learned)
  - [Continued development](#continued-development)
- [Getting started](#getting-started)
- [Author](#author)

## Overview

### The challenge

Users should be able to:

- View the optimal layout for the app depending on their device's screen size
- See hover states for all interactive elements on the page
- Add new todos to the list
- Mark todos as complete
- Delete todos from the list
- Filter by all/active/complete todos
- Clear all completed todos
- Toggle light and dark mode
- **Bonus**: Drag and drop to reorder items on the list

### Screenshot

![Design preview for the Todo app coding challenge](./screenshot.jpg)

Add a screenshot of your solution here.

### Links

- Solution URL: [https://github.com/jeanarnaudt/todo-app](https://github.com/jeanarnaudt/todo-app.git)
- Live Site URL: [https://todo-appfm.netlify.app](https://todo-appfm.netlify.app)

## My process

### Built with

- [React](https://react.dev/) 19 + TypeScript
- [Vite](https://vite.dev/) as the build tool, via `@vitejs/plugin-react`, with the React Compiler enabled through `babel-plugin-react-compiler` (`@rolldown/plugin-babel`)
- [Tailwind CSS](https://tailwindcss.com/) v4, configured CSS-first via `@tailwindcss/vite`
- CSS custom properties for design tokens and theming (`src/styles/variables.css`)
- Mobile-first, semantic HTML
- React Context API + custom hooks for state management — no external state library
- [pnpm](https://pnpm.io/) as the package manager

### What I learned

Each context in this project follows the same guarded-hook pattern: the provider exposes a hook that throws if it's used outside its provider, so consuming components never have to deal with an undefined context:

```tsx
export function useTodos(): TodosContextType {
	const context = useContext(TodosContext)
	if (!context) {
		throw new Error('useTodos must be used within a TodosProvider')
	}
	return context
}
```

Contexts also expose domain actions (`addTodo`, `toggleTodo`, `reorderTodos`, `clearCompleted`, …) rather than a raw setter, which keeps the update logic in one place and makes the intent of each call site clear.

The drag-and-drop reordering is implemented as a standalone, reusable hook (`useDragReorder`) built on the native HTML5 drag events, rather than a drag-and-drop library. It also supports keyboard reordering, so the feature isn't mouse-only:

```tsx
onKeyDown(e) {
	if (!enabled || !e.altKey) return
	if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') return
	// ...move the item and announce the new position via aria-live
}
```

Moving a todo with <kbd>Alt</kbd> + <kbd>↑</kbd>/<kbd>↓</kbd> updates an `aria-live` announcement region with the item's new position, so the reordering feature stays usable without a mouse and is announced to screen readers.

I also learned to keep persistence generic: `useLocalStorage` is a small, type-parameterized hook (`useLocalStorage<T>(key, initialValue)`) that both `TodosProvider` and `ThemeProvider` reuse to read/write their own state to `localStorage`, instead of each context re-implementing its own storage syncing.

### Continued development

- `src/reducer/TodosReducer.tsx` implements the todo CRUD operations as a pure reducer, but it's currently unused — `TodosContext` reimplements the same add/edit/toggle/delete/clear logic inline with `useLocalStorage`'s setter instead of wiring up `useReducer` with that reducer. Revisiting this to either wire the reducer in or remove it would tidy up the state layer.
- Add automated tests — there's currently no test runner configured in the project.

## Getting started

```bash
pnpm install    # install dependencies
pnpm dev        # start the Vite dev server
pnpm build      # type-check and build for production
pnpm lint       # run ESLint
pnpm preview    # preview the production build locally
```

## Author

- LinkedIn - [@jeanarnaud-tanoe](https://www.linkedin.com/in/jeanarnaud-tanoe)
- GitHub - [@jeanarnaudt](https://github.com/jeanarnaudt)
