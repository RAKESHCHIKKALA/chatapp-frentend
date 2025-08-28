import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Store from "./store/store.js"
import {Provider} from "react-redux"
import App from './App.jsx'
import {BrowserRouter} from "react-router-dom"
import { loadUser } from './store/userSlice'

// Initialize user state from localStorage
const token = localStorage.getItem("token");
console.log("Main.jsx - Token from localStorage:", token ? "exists" : "missing");

if (token) {
  console.log("Main.jsx - Dispatching loadUser action");
  // Dispatch loadUser action to restore user state
  Store.dispatch(loadUser());
  
  // Check the state after dispatching
  const state = Store.getState();
  console.log("Main.jsx - Redux state after loadUser:", state);
} else {
  console.log("Main.jsx - No token found, skipping user initialization");
}

createRoot(document.getElementById('root')).render(
<BrowserRouter>
  <Provider store={Store}>  
    <App/>
  </Provider>
</BrowserRouter>
)
