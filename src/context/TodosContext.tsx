import {createContext, useContext, useMemo, useCallback} from 'react'

import {initialTodos} from '../lib/data.ts'
import type {TodoType, TodosContextType, TodosProviderProps} from '../lib/definitions.ts'
import {useLocalStorage} from '../hook/useLocalStorage.tsx'

export const TodosContext = createContext<TodosContextType | null>(null)

export default function TodosProvider({children}: TodosProviderProps) {
	const [todos, setTodos] = useLocalStorage<TodoType[]>('todos', initialTodos)
	
	const addTodo = useCallback((text: string) => {
		setTodos(prev => {
			const nextId = prev.length > 0 ? Math.max(...prev.map(t => t.id)) + 1 : 1
			return [...prev, {id: nextId, text, done: false}]
		})
	}, [setTodos])
	
	const editTodo = useCallback((id: number, text: string) => {
		setTodos(prev => prev.map(t => t.id === id ? {...t, text} : t))
	}, [setTodos])

	const toggleTodo = useCallback((id: number) => {
		setTodos(prev => prev.map(t => t.id === id ? {...t, done: !t.done} : t))
	}, [setTodos])

	const deleteTodo = useCallback((id: number) => {
		setTodos(prev => prev.filter(t => t.id !== id))
	}, [setTodos])

	const clearCompleted = useCallback(() => {
		setTodos(prev => prev.filter(t => !t.done))
	}, [setTodos])

	// Id-based, not index-based: the rendered list is a derived array, and the
	// lookups happen inside the updater so a concurrent delete cannot make the
	// move act on a stale index. Unknown id, or a drop on itself, is a no-op.
	const reorderTodos = useCallback((draggedId: number, targetId: number) => {
		setTodos(prev => {
			if (draggedId === targetId) return prev
			const from = prev.findIndex(t => t.id === draggedId)
			const to = prev.findIndex(t => t.id === targetId)
			if (from === -1 || to === -1) return prev
			const next = [...prev]
			const [dragged] = next.splice(from, 1)
			// Remove-then-insert: dragging down lands after the target, dragging
			// up lands before it — the same rule the drop indicator previews.
			next.splice(to, 0, dragged)
			return next
		})
	}, [setTodos])

	const value = useMemo<TodosContextType>(() => ({
		todos,
		setTodos,
		addTodo,
		editTodo,
		toggleTodo,
		deleteTodo,
		clearCompleted,
		reorderTodos,
	}), [todos, setTodos, addTodo, editTodo, toggleTodo, deleteTodo, clearCompleted, reorderTodos])

	return (
		<TodosContext.Provider value={value}>
			{children}
		</TodosContext.Provider>
	)
}

export function useTodos(): TodosContextType {
	const context = useContext(TodosContext)
	if (!context) {
		throw new Error('useTodos must be used within a TodosProvider')
	}
	return context
}