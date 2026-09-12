import {useState} from 'react'
import type * as React from 'react'

import {icons} from './lib/icons.tsx'
import type {TodoType} from './lib/definitions.ts'
import {useTheme} from './context/ThemeContext.tsx'
import {useTodos} from './context/TodosContext.tsx'

import Todo from './components/Todo.tsx'
import Filter, {type FilterType} from './components/Filter.tsx'

export default function App() {
	const {todos, addTodo, clearCompleted} = useTodos()
	const {theme, toggleTheme} = useTheme()
	
	const [filter, setFilter] = useState<FilterType>('all')

	const filteredTodos = todos.filter((todo: TodoType) => {
		if (filter === 'active') return !todo.done
		if (filter === 'completed') return todo.done
		return true
	})
	
	const activeTodosCount = todos.filter((t: TodoType) => !t.done).length

	function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
		if (e.key === 'Enter' && e.currentTarget.value.trim() !== '') {
			addTodo(e.currentTarget.value.trim())
			e.currentTarget.value = ''
		}
	}

	return (
		<>
			<header/>
			<main>
				<nav>
					<h1>todo</h1>
					<button
						type="button"
						onClick={toggleTheme}
						aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
					>
						{icons[theme === 'light' ? 'moon' : 'sun']}
					</button>
				</nav>
				<section>
					<form onSubmit={e => e.preventDefault()}>
						<label htmlFor="add-todo"></label>
						<input
							type="text"
							id="add-todo"
							placeholder="Create a new todo..."
							onKeyDown={handleKeyDown}
						/>
					</form>
				</section>
				<section>
					<ul className="todo-list">
						{filteredTodos.map((todo: TodoType) => (
							<li key={todo.id} className="todo-item">
								<Todo {...todo}/>
							</li>
						))}
						<li className="controls">
							<div>
								<p>{activeTodosCount} {activeTodosCount === 1 ? 'item' : 'items'} left</p>
								<Filter filter={filter} setFilter={setFilter}/>
								<button type="button" onClick={clearCompleted}>clear completed</button>
							</div>
						</li>
					</ul>
				</section>
				<section>
					<Filter filter={filter} setFilter={setFilter}/>
				</section>
				<p>Drag and drop to reorder list</p>
			</main>
		</>
	)
}