import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux'
import store, { persistor } from './redux/store.js'  // ✅ import persistor from store directly
import { Toaster } from 'sonner'
import ThemeProvider from './components/ThemeProvider.jsx'  // ✅ your custom ThemeProvider, not next-themes
import { PersistGate } from 'redux-persist/integration/react'

// ✅ removed: persistStore(store) called twice — already done in store.js

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider>
          <App />
          <Toaster /> 
        </ThemeProvider>
      </PersistGate>
    </Provider>
  </StrictMode>,
)