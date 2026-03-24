import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './site.css'

// Точка входа React-приложения. Здесь монтируем `App` в DOM-узел `#app`.
const rootEl = document.getElementById('app')
if (!rootEl) throw new Error('Root element #app not found')

createRoot(rootEl).render(
  React.createElement(
    React.StrictMode,
    null,
    React.createElement(App),
  ),
)
