import {createContext, useContext, useMemo, useCallback} from 'react'

import {initialTodos} from '../lib/data.ts'
import type {TodoProps, TodosContextType, TodosProviderProps} from '../lib/definitions.ts'
import {useLocalStorage} from '../hook/useLocalStorage.tsx'

export const TodosContext = createContext<TodosContextType | null>(null)

export default function TodosProvider({children}: TodosProviderProps) {
	const [todos, setTodos] = useLocalStorage<TodoProps[]>('todos', initialTodos)
	
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

	const value = useMemo<TodosContextType>(() => ({
		todos,
		setTodos,
		addTodo,
		editTodo,
		toggleTodo,
		deleteTodo,
		clearCompleted,
	}), [todos, setTodos, addTodo, editTodo, toggleTodo, deleteTodo, clearCompleted])

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