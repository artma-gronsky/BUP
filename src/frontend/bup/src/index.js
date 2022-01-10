import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import {BrowserRouter} from "react-router-dom";
import {StateProvider} from "./contexts/state-context";

ReactDOM.render(
    <React.StrictMode>
            <BrowserRouter>
                <StateProvider>
                <App/>
                </StateProvider>
            </BrowserRouter>
    </React.StrictMode>,
    document.getElementById('root')
);
