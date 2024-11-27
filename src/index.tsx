import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { RequestsProvider } from './Components/Hooks/useRequests';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <RequestsProvider>
  <App />
</RequestsProvider>
);

reportWebVitals();
