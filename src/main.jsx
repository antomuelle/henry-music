import React from 'react'
import ReactDOM from 'react-dom/client'
import { Auth0Provider } from '@auth0/auth0-react'
import { Provider } from 'react-redux'
import { RouterProvider } from 'react-router-dom'
import { configureStore } from '@reduxjs/toolkit'
import { router } from './router'
import { Reducer } from './slice'
import './styles/index.css'
import { Toast } from './components/Shorts'

const store = configureStore({ reducer: Reducer })
const {
  VITE_AUTH0_DOMAIN,
  VITE_AUTH0_CLIENT_ID,
  VITE_AUTH0_AUDIENCE,
} = import.meta.env

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <Auth0Provider
        domain={VITE_AUTH0_DOMAIN}
        clientId={VITE_AUTH0_CLIENT_ID}
        authorizationParams={{
          audience: VITE_AUTH0_AUDIENCE,
          redirect_uri: window.location.origin
        }} >
        <RouterProvider router={router} />
      </Auth0Provider>
      <Toast />
    </Provider>
  </React.StrictMode>,
)
