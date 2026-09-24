import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { LeadProvider } from './context/LeadContext.jsx'
import { TaskProvider } from './context/TaskContext.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <LeadProvider>
        <TaskProvider>
          <App />
        </TaskProvider>
      </LeadProvider>
    </ErrorBoundary>
  </StrictMode>,
)
