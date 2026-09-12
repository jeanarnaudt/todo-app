import {useEffect, useRef, useState} from 'react'
import type * as React from 'react'

import type {TodoComponentProps} from '../lib/definitions.ts'
import {icons} from '../lib/icons.tsx'
import {useTodos} from '../context/TodosContext.tsx'

export default function Todo({id, text, done, onEditingChange}: TodoComponentProps) {
	const {toggleTodo, deleteTodo, editTodo} = useTodos()

	const [isEditing, setIsEditing] = useState(false)
	const [draft, setDraft] = useState(text)
	const inputRef = useRef<HTMLInputElement>(null)
	// Set by Escape so the blur that follows unmounting does not commit.
	const cancelledRef = useRef(false)

	useEffect(() => {
		if (isEditing) {
			inputRef.current?.focus()
			inputRef.current?.select()
		}
	}, [isEditing])

	function startEditing() {
		// Chrome does not fire blur when the focused input unmounts, so a prior
		// Escape can leave this set; clear it or the next blur-save is swallowed.
		cancelledRef.current = false
		setDraft(text)
		setEditing(true)
	}

	function commit() {
		const trimmed = draft.trim()
		// Empty input reverts; unchanged text skips a pointless state write.
		if (trimmed !== '' && trimmed !== text) editTodo(id, trimmed)
		setEditing(false)
	}

	function cancel() {
		cancelledRef.current = true
		setDraft(text)
		setEditing(false)
	}

	function handleBlur() {
		if (cancelledRef.current) {
			cancelledRef.current = false
			return
		}
		commit()
	}

	// Every editing transition goes through here so the owner of the row can
	// drop `draggable` while the input is mounted.
	function setEditing(isEditing: boolean) {
		setIsEditing(isEditing)
		onEditingChange?.(isEditing)
	}

	function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
		if (e.key === 'Enter') commit()
		else if (e.key === 'Escape') cancel()
	}

	return (
		<div className="todo">
			<input
				type="checkbox"
				id={`todo-${id}`}
				checked={done}
				onChange={() => toggleTodo(id)}
			/>
			<label htmlFor={`todo-${id}`}></label>
			{isEditing ? (
				<input
					ref={inputRef}
					type="text"
					value={draft}
					onChange={e => setDraft(e.target.value)}
					onKeyDown={handleKeyDown}
					onBlur={handleBlur}
				/>
			) : (
				<p onDoubleClick={startEditing}>{text}</p>
			)}
			<button onClick={() => deleteTodo(id)}>{icons.cross}</button>
		</div>
	)
}