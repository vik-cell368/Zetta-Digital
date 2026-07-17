import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import './i18n';

const rootElement = document.getElementById('root')!;

// Use a global variable to track the root to prevent multiple initializations
let root = (window as any)._reactRoot;

if (!root) {
  root = createRoot(rootElement);
  (window as any)._reactRoot = root;
}

root.render(
  <StrictMode>
    <App />
  </StrictMode>,
);
