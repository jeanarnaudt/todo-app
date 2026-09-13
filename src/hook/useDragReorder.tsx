import {useCallback, useRef, useState} from 'react'
import type * as React from 'react'

export type DropPosition = 'before' | 'after'

interface UseDragReorderOptions {
	ids: number[]
	enabled: boolean
	onReorder: (draggedId: number, targetId: number) => void
	isLocked?: (id: number) => boolean
}

interface DragItemProps {
	draggable: boolean
	tabIndex?: number
	onPointerDown: (e: React.PointerEvent<HTMLElement>) => void
	onDragStart: (e: React.DragEvent<HTMLElement>) => void
	onDragOver: (e: React.DragEvent<HTMLElement>) => void
	onDrop: (e: React.DragEvent<HTMLElement>) => void
	onDragEnd: (e: React.DragEvent<HTMLElement>) => void
	onKeyDown: (e: React.KeyboardEvent<HTMLElement>) => void
}

interface UseDragReorder {
	draggingId: number | null
	overId: number | null
	dropPosition: DropPosition | null
	announcement: string
	clearOverId: () => void
	getItemProps: (id: number) => DragItemProps
}

export function useDragReorder({ids, enabled, onReorder, isLocked}: UseDragReorderOptions): UseDragReorder {
	const [draggingId, setDraggingId] = useState<number | null>(null)
	const [overId, setOverId] = useState<number | null>(null)
	const [dropPosition, setDropPosition] = useState<DropPosition | null>(null)
	const [announcement, setAnnouncement] = useState('')

	const draggedIdRef = useRef<number | null>(null)
	const gestureBlockedRef = useRef(false)

	const reset = useCallback(() => {
		draggedIdRef.current = null
		setDraggingId(null)
		setOverId(null)
		setDropPosition(null)
	}, [])

	const clearOverId = useCallback(() => {
		setOverId(null)
		setDropPosition(null)
	}, [])

	const getItemProps = useCallback((id: number): DragItemProps => {
		const locked = isLocked?.(id) ?? false
		const draggable = enabled && !locked

		return {
			draggable,
			tabIndex: enabled ? 0 : undefined,

			onPointerDown(e) {
				gestureBlockedRef.current = Boolean(
					(e.target as HTMLElement).closest('input, button, label, a'),
				)
			},

			onDragStart(e) {
				if (!draggable || gestureBlockedRef.current) {
					e.preventDefault()
					return
				}
				draggedIdRef.current = id
				e.dataTransfer.setData('text/plain', String(id))
				e.dataTransfer.effectAllowed = 'move'
				requestAnimationFrame(() => setDraggingId(id))
			},

			onDragOver(e) {
				const draggedId = draggedIdRef.current
				if (draggedId === null) return
				e.preventDefault()
				e.dataTransfer.dropEffect = 'move'
				if (draggedId === id) {
					clearOverId()
					return
				}
				const from = ids.indexOf(draggedId)
				const to = ids.indexOf(id)
				setOverId(id)
				setDropPosition(from < to ? 'after' : 'before')
			},

			onDrop(e) {
				e.preventDefault()
				const draggedId = draggedIdRef.current
				if (draggedId !== null && draggedId !== id) onReorder(draggedId, id)
				reset()
			},

			onDragEnd() {
				reset()
			},

			onKeyDown(e) {
				if (!enabled || !e.altKey) return
				if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') return

				const index = ids.indexOf(id)
				if (index === -1) return
				const target = e.key === 'ArrowUp' ? index - 1 : index + 1
				if (target < 0 || target >= ids.length) return

				e.preventDefault()
				onReorder(id, ids[target])
				const direction = e.key === 'ArrowUp' ? 'up' : 'down'
				setAnnouncement(`Moved ${direction} to position ${target + 1} of ${ids.length}`)
			},
		}
	}, [ids, enabled, isLocked, onReorder, reset, clearOverId])

	return {draggingId, overId, dropPosition, announcement, clearOverId, getItemProps}
}
