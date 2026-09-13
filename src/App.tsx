import {useCallback, useState} from 'react'
import type * as React from 'react'

import {icons} from './lib/icons.tsx'
import type {TodoType} from './lib/definitions.ts'
import {useTheme} from './context/ThemeContext.tsx'
import {useTodos} from './context/TodosContext.tsx'
import {useDragReorder} from './hook/useDragReorder.tsx'

import Todo from './components/Todo.tsx'
import Filter, {type FilterType} from './components/Filter.tsx'

export default function App() {
	const {todos, addTodo, clearCompleted, reorderTodos} = useTodos()
	const {theme, toggleTheme} = useTheme()
	
	const [filter, setFilter] = useState<FilterType>('all')
	const [editingId, setEditingId] = useState<number | null>(null)

	const filteredTodos = todos.filter((todo: TodoType) => {
		if (filter === 'active') return !todo.done
		if (filter === 'completed') return todo.done
		return true
	})
	
	const activeTodosCount = todos.filter((t: TodoType) => !t.done).length

	const canReorder = filter === 'all'

	const isLocked = useCallback((id: number) => id === editingId, [editingId])

	const {draggingId, overId, dropPosition, announcement, clearOverId, getItemProps} = useDragReorder({
		ids: filteredTodos.map((todo: TodoType) => todo.id),
		enabled: canReorder,
		onReorder: reorderTodos,
		isLocked,
	})

	function itemClassName(id: number) {
		const classes = ['todo-item']
		if (id === draggingId) classes.push('dragging')
		if (id === overId && dropPosition) classes.push(`drag-over-${dropPosition}`)
		return classes.join(' ')
	}

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
					<ul className={canReorder ? 'todo-list reorderable' : 'todo-list'}>
						{filteredTodos.map((todo: TodoType) => (
							<li
								key={todo.id}
								className={itemClassName(todo.id)}
								aria-describedby={canReorder ? 'reorder-hint' : undefined}
								{...getItemProps(todo.id)}
							>
								<Todo
									{...todo}
									onEditingChange={isEditing => setEditingId(isEditing ? todo.id : null)}
								/>
							</li>
						))}
						{/* Excluded from reordering by omission: with no onDragOver to
						    preventDefault, the browser cancels any drop here. The one
						    handler stops the indicator sticking to the last row. */}
						<li className="controls" onDragEnter={clearOverId}>
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
				<p id="reorder-hint">
					Drag and drop to reorder list
					<span className="visually-hidden">, or hold Alt and press the up or down arrow key</span>
				</p>
				<div className="visually-hidden" role="status" aria-live="polite">{announcement}</div>
			</main>
		</>
	)
}
