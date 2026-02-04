import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import './index.css'
import App from './App.tsx'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { persistor, store } from './redux/store.ts'
import { PersistGate } from 'redux-persist/integration/react'


createRoot(document.getElementById('root')!).render(
  <StrictMode>

    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
          <App />
        </GoogleOAuthProvider>
      </PersistGate>
    </Provider>
  </StrictMode>,
)
