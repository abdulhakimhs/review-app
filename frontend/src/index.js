import React from 'react'
import App from './App'
import {BrowserRouter} from "react-router-dom"
import "./index.css"
import ThemeProvider from './context/ThemeProvider'
import {createRoot} from 'react-dom/client';

const rootElement = document.getElementById("root");
 
const root = createRoot(rootElement);
root.render(
    <BrowserRouter>
        <ThemeProvider>
            <App /> 
        </ThemeProvider>
    </BrowserRouter>
);