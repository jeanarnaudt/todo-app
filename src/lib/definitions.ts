import type {Dispatch, SetStateAction, ReactNode} from 'react'

export type TodoType = {
	id: number
	text: string
	done: boolean
}

export interface TodosContextType {
	todos: TodoType[]
	setTodos: Dispatch<SetStateAction<TodoType[]>>
	addTodo: (text: string) => void
	editTodo: (id: number, text: string) => void
	toggleTodo: (id: number) => void
	deleteTodo: (id: number) => void
	clearCompleted: () => void
}

export interface TodosProviderProps {
	children: ReactNode
}

export type Theme = 'light' | 'dark'

export interface ThemeContextProps {
	theme: Theme
	setTheme: Dispatch<SetStateAction<Theme>>
	toggleTheme: () => void
}

export interface ThemeProviderProps {
	children: ReactNode
}

export type TodosAction =
	| { type: 'ADD_TODO'; payload: TodoType }
	| { type: 'EDIT_TODO'; payload: TodoType }
	| { type: 'DELETE_TODO'; payload: number }
	| { type: 'TOGGLE_TODO'; payload: number }
	| { type: 'CLEAR_TODOS' }
