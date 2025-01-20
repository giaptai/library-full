import { createRoot } from 'react-dom/client'
import './index.css'
import { App } from './App.tsx'
import { BrowserRouter } from "react-router-dom";
import { Auth0Provider } from '@auth0/auth0-react';


//this is index.tsx
createRoot(document.getElementById('root') as HTMLElement).render(
  <Auth0Provider
    domain="dev-b731ujia2ategk8i.us.auth0.com"
    clientId="kwPUjFmHWmFLfOjmTUvDK7ofA2KuWjJ7"
    authorizationParams={{
      redirect_uri: window.location.origin,
      // audience: "https://dev-b731ujia2ategk8i.us.auth0.com/api/v2/",
      // scope: "read:current_user update:current_user_metadata"
    }}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Auth0Provider>,
)
