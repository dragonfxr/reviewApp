import ReactDom from "react-dom/client";
import App from "./App";
import './index.css';

import { BrowserRouter } from 'react-router-dom';

const rootElement = document.getElementById('root');
const root = ReactDom.createRoot(rootElement);

root.render(
    <BrowserRouter>
        <App />
    </BrowserRouter>
);