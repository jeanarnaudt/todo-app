import { createRoot } from 'react-dom/client'

import './index.css'

import App from './App.tsx'
import ThemeProvider from './context/ThemeContext.tsx'
import TodosProvider from './context/TodosContext.tsx'

createRoot(document.getElementById('root')!).render(
  <ThemeProvider>
    <TodosProvider>
      <App />
    </TodosProvider>
  </ThemeProvider>,
)
