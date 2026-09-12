import type {TodoType, TodosAction} from '../lib/definitions.ts'

export function TodosReducer(state: TodoType[], action: TodosAction): TodoType[] {
	switch (action.type) {
		case 'ADD_TODO':
			return [...state, action.payload]
		case 'EDIT_TODO':
			return state.map((todo) => todo.id === action.payload.id ? action.payload : todo)
		case 'DELETE_TODO':
			return state.filter((todo) => todo.id !== action.payload)
		case 'TOGGLE_TODO':
			return state.map((todo) => todo.id === action.payload ? {...todo, done: !todo.done} : todo)
		case 'CLEAR_TODOS':
			return []
		default:
			return state
	}
}