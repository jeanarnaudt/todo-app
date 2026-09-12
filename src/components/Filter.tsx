export type FilterType = 'all' | 'active' | 'completed'

interface FilterProps {
	filter: FilterType
	setFilter: (filter: FilterType) => void
}

export default function Filter({filter, setFilter}: FilterProps) {
	return (
		<div className="filter">
			<button
				type="button"
				className={filter === 'all' ? 'active' : ''}
				onClick={() => setFilter('all')}
			>
				all
			</button>
			<button
				type="button"
				className={filter === 'active' ? 'active' : ''}
				onClick={() => setFilter('active')}
			>
				active
			</button>
			<button
				type="button"
				className={filter === 'completed' ? 'active' : ''}
				onClick={() => setFilter('completed')}
			>
				completed
			</button>
		</div>
	)
}