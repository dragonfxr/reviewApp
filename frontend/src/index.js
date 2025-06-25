import ReactDom from "react-dom/client";
import App from "./App";
import './index.css';

import { BrowserRouter } from 'react-router-dom';

import ContextProviders from "./components/context";

const rootElement = document.getElementById('root');
const root = ReactDom.createRoot(rootElement);

root.render(
    <BrowserRouter>
        <ContextProviders>
            <App />
        </ContextProviders>
    </BrowserRouter>
);