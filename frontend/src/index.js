import React from 'react'
import App from './App'
import {BrowserRouter} from "react-router-dom"
import "./index.css"
import {createRoot} from 'react-dom/client';
import ContextProviders from './context'

const rootElement = document.getElementById("root");
 
const root = createRoot(rootElement);
root.render(
    <BrowserRouter>
        <ContextProviders>
            <App />
        </ContextProviders>
    </BrowserRouter>
);